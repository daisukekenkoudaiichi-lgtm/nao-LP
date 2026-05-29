import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const COURSE_LABELS: Record<string, string> = {
  half      : '特別ハーフコース（¥6,500）',
  omakase   : '店主のおまかせコース（¥10,000）',
  selection : '店主の厳選コース（¥12,000）',
}

function formatDate(dateStr: string): string {
  const DOW = ['日', '月', '火', '水', '木', '金', '土']
  const d   = new Date(`${dateStr}T00:00:00+09:00`)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${DOW[d.getDay()]}）`
}

Deno.serve(async (req) => {

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const { reservation_date, name, kana, email, phone, party_size, course_type, allergies, notes } = body

    // ── バリデーション ──────────────────────────────────
    if (!reservation_date || !name || !phone || !party_size || !course_type) {
      return new Response(
        JSON.stringify({ error: '必須項目が不足しています' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const today = new Date().toLocaleDateString('sv', { timeZone: 'Asia/Tokyo' })
    if (reservation_date < today) {
      return new Response(
        JSON.stringify({ error: '過去の日付には予約できません' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // ── Supabase クライアント ───────────────────────────
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    // ── 空席チェック ────────────────────────────────────
    const { data: avail } = await supabase
      .from('availability')
      .select('available_seats')
      .eq('date', reservation_date)
      .single()

    if (avail && avail.available_seats < party_size) {
      return new Response(
        JSON.stringify({ error: 'ご希望の人数分の空席がございません' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // ── 顧客 UPSERT（電話番号で識別） ─────────────────
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .upsert(
        { phone, name, email: email || null },
        { onConflict: 'phone' },
      )
      .select()
      .single()

    if (customerError) throw customerError

    // ── 予約 INSERT ────────────────────────────────────
    const { data: reservation, error: reservationError } = await supabase
      .from('reservations')
      .insert({
        customer_id      : customer.id,
        reservation_date,
        party_size,
        course_type,
        allergies        : allergies || null,
        notes            : notes    || null,
        status           : 'confirmed',
        source           : 'web',
      })
      .select()
      .single()

    if (reservationError) throw reservationError

    // ── メール送信（失敗してもDB登録は成功扱い） ────────
    try {
    const resend      = new Resend(Deno.env.get('RESEND_API_KEY'))
    const ownerEmail  = Deno.env.get('OWNER_EMAIL')!
    const fromEmail   = Deno.env.get('FROM_EMAIL') ?? 'onboarding@resend.dev'
    const dateLabel   = formatDate(reservation_date)
    const courseLabel = COURSE_LABELS[course_type] ?? course_type

    // 顧客への確認メール
    if (email) {
      const { error: mailErr } = await resend.emails.send({
        from   : `和食 直 <${fromEmail}>`,
        to     : email,
        subject: `ご予約確認 — 和食 直（${dateLabel}）`,
        html: `
<div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#333;line-height:1.8">
  <p style="font-size:20px;color:#8a6b2a;border-bottom:1px solid #e0c98a;padding-bottom:8px">ご予約ありがとうございます</p>
  <p>${name} 様</p>
  <p>以下の内容でご予約を承りました。</p>
  <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px">
    <tr><td style="padding:8px 4px;border-bottom:1px solid #eee;color:#888;width:30%">日時</td>
        <td style="padding:8px 4px;border-bottom:1px solid #eee">${dateLabel}　18:00〜22:00</td></tr>
    <tr><td style="padding:8px 4px;border-bottom:1px solid #eee;color:#888">人数</td>
        <td style="padding:8px 4px;border-bottom:1px solid #eee">${party_size}名様</td></tr>
    <tr><td style="padding:8px 4px;border-bottom:1px solid #eee;color:#888">コース</td>
        <td style="padding:8px 4px;border-bottom:1px solid #eee">${courseLabel}</td></tr>
    ${allergies ? `<tr><td style="padding:8px 4px;border-bottom:1px solid #eee;color:#888">アレルギー</td>
        <td style="padding:8px 4px;border-bottom:1px solid #eee">${allergies}</td></tr>` : ''}
    ${notes ? `<tr><td style="padding:8px 4px;border-bottom:1px solid #eee;color:#888">備考</td>
        <td style="padding:8px 4px;border-bottom:1px solid #eee">${notes}</td></tr>` : ''}
  </table>
  <p style="font-size:14px"><strong>和食 直</strong><br>〒085-0014 北海道釧路市末広町２丁目９<br>TEL: <a href="tel:0154640222">0154-64-0222</a></p>
  <p style="font-size:12px;color:#aaa">※ キャンセルは前日18時までにお電話ください。<br>※ サービス料として別途10%を頂戴いたします。</p>
</div>`,
      })

      await supabase.from('notification_logs').insert({
        reservation_id : reservation.id,
        type           : 'new_reservation',
        sent_to        : email,
        success        : !mailErr,
        error_message  : mailErr?.message ?? null,
      })
    }

    // 店主への通知メール
    const { error: ownerErr } = await resend.emails.send({
      from   : `予約システム <${fromEmail}>`,
      to     : ownerEmail,
      subject: `【新規予約】${dateLabel} ${name}様 ${party_size}名`,
      html: `
<div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#333;line-height:1.8">
  <p style="font-size:20px;color:#c0392b;border-bottom:1px solid #f0c0c0;padding-bottom:8px">【新規予約】が入りました</p>
  <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px">
    <tr><td style="padding:8px 4px;border-bottom:1px solid #eee;color:#888;width:30%">日付</td>
        <td style="padding:8px 4px;border-bottom:1px solid #eee">${dateLabel}</td></tr>
    <tr><td style="padding:8px 4px;border-bottom:1px solid #eee;color:#888">お名前</td>
        <td style="padding:8px 4px;border-bottom:1px solid #eee">${name}（${kana ?? ''}）</td></tr>
    <tr><td style="padding:8px 4px;border-bottom:1px solid #eee;color:#888">人数</td>
        <td style="padding:8px 4px;border-bottom:1px solid #eee">${party_size}名様</td></tr>
    <tr><td style="padding:8px 4px;border-bottom:1px solid #eee;color:#888">コース</td>
        <td style="padding:8px 4px;border-bottom:1px solid #eee">${courseLabel}</td></tr>
    <tr><td style="padding:8px 4px;border-bottom:1px solid #eee;color:#888">電話</td>
        <td style="padding:8px 4px;border-bottom:1px solid #eee"><a href="tel:${phone}">${phone}</a></td></tr>
    ${email ? `<tr><td style="padding:8px 4px;border-bottom:1px solid #eee;color:#888">メール</td>
        <td style="padding:8px 4px;border-bottom:1px solid #eee">${email}</td></tr>` : ''}
    ${allergies ? `<tr><td style="padding:8px 4px;border-bottom:1px solid #eee;color:#888">アレルギー</td>
        <td style="padding:8px 4px;border-bottom:1px solid #eee;color:#c0392b"><strong>${allergies}</strong></td></tr>` : ''}
    ${notes ? `<tr><td style="padding:8px 4px;border-bottom:1px solid #eee;color:#888">備考</td>
        <td style="padding:8px 4px;border-bottom:1px solid #eee">${notes}</td></tr>` : ''}
  </table>
  <p style="font-size:12px;color:#aaa">受付: ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}</p>
</div>`,
    })

    await supabase.from('notification_logs').insert({
      reservation_id : reservation.id,
      type           : 'new_reservation',
      sent_to        : ownerEmail,
      success        : !ownerErr,
      error_message  : ownerErr?.message ?? null,
    })

    } catch (mailErr) {
      // メール失敗はログだけ残してDB登録は成功扱い
      console.error('[reserve] mail error:', mailErr)
    }

    return new Response(
      JSON.stringify({ reservation_id: reservation.id, status: 'confirmed' }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )

  } catch (err) {
    console.error('[reserve] error:', err)
    return new Response(
      JSON.stringify({ error: 'サーバーエラーが発生しました' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
