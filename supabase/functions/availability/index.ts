import { createClient } from '@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url   = new URL(req.url)
    const month = url.searchParams.get('month') // 例: 2026-06

    // バリデーション
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return new Response(
        JSON.stringify({ error: 'monthパラメータが必要です（例: 2026-06）' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const [year, mon] = month.split('-').map(Number)
    const startDate   = `${month}-01`
    const endDate     = new Date(year, mon, 0).toISOString().split('T')[0] // 月末日

    // Supabase クライアント（anon key: availability ビューは匿名でも読める）
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
    )

    const { data, error } = await supabase
      .from('availability')
      .select('date, total_seats, booked_seats, available_seats')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date')

    if (error) throw error

    // 配列 → { "2026-06-10": { available: 7, total: 10 }, ... } に変換
    const dates: Record<string, { available: number; total: number }> = {}
    for (const row of data ?? []) {
      dates[row.date] = {
        available : row.available_seats,
        total     : row.total_seats,
      }
    }

    return new Response(
      JSON.stringify({ month, dates }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )

  } catch (err) {
    console.error('[availability] error:', err)
    return new Response(
      JSON.stringify({ error: 'サーバーエラーが発生しました' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
