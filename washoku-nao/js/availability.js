/**
 * availability.js — 予約空席カレンダー + 予約フォーム
 *
 * ■ 手動運用: RESERVATIONS に「日付: 予約済み人数」を入力
 * ■ API連携:  API_URL を設定すると Supabase から自動取得
 */

/* ═══════════════════════════════════════════
 * 設定（ここだけ変更すればOK）
 * ═══════════════════════════════════════════ */
const CAL_CONFIG = {
  totalSeats    : 10,
  warnThreshold : 3,
  contactEmail  : 'info@washoku-nao.jp',

  reservations: {
    // API接続後はDBから自動取得 / ここはAPI障害時のフォールバック用
  },

  extraClosed: [],
};

const API_URL = 'https://johrztiitxndabamqwgi.supabase.co/functions/v1';

/* ═══════════════════════════════════════════
 * 状態
 * ═══════════════════════════════════════════ */
let currentYear, currentMonth, reservationData;
let selectedDate = null; // { y, m, d, avail, label }
const fetchedMonths = new Set(); // 取得済み月のキャッシュ

/* ═══════════════════════════════════════════
 * ユーティリティ
 * ═══════════════════════════════════════════ */
const DOW    = ['日', '月', '火', '水', '木', '金', '土'];
function pad(n)            { return String(n).padStart(2, '0'); }
function dateKey(y, m, d)  { return `${y}-${pad(m)}-${pad(d)}`; }
function isSunday(y, m, d) { return new Date(y, m - 1, d).getDay() === 0; }

function isClosed(y, m, d) {
  if (isSunday(y, m, d)) return true;
  if (CAL_CONFIG.extraClosed.includes(dateKey(y, m, d))) return true;
  return false;
}

function getAvailable(y, m, d) {
  const booked = reservationData[dateKey(y, m, d)] ?? 0;
  return Math.max(0, CAL_CONFIG.totalSeats - booked);
}

/* API から指定月の空席データを取得してキャッシュに格納 */
async function fetchMonthData(y, m) {
  const monthKey = `${y}-${pad(m)}`;
  if (fetchedMonths.has(monthKey)) return; // 取得済みはスキップ

  try {
    const res = await fetch(`${API_URL}/availability?month=${monthKey}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // API形式 { available, total } → 予約済み人数（booked）に変換して格納
    for (const [date, info] of Object.entries(data.dates ?? {})) {
      reservationData[date] = info.total - info.available;
    }
    fetchedMonths.add(monthKey);
  } catch (e) {
    console.warn(`[availability] ${monthKey} 取得失敗（手動設定で代替）:`, e);
  }
}

/* ═══════════════════════════════════════════
 * カレンダー描画
 * ═══════════════════════════════════════════ */
function renderCalendar(y, m) {
  currentYear  = y;
  currentMonth = m;

  document.getElementById('cal-month-label').textContent = `${y}年 ${m}月`;
  const grid = document.getElementById('cal-grid');
  grid.innerHTML = '';
  document.getElementById('cal-selected-info')?.classList.add('hidden');

  const today       = new Date();
  const firstDay    = new Date(y, m - 1, 1).getDay();
  const daysInMonth = new Date(y, m, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const el = document.createElement('div');
    el.className = 'cal-cell cal-empty';
    grid.appendChild(el);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const cell    = document.createElement('button');
    const isToday = y === today.getFullYear() && m === today.getMonth() + 1 && d === today.getDate();
    const isPast  = new Date(y, m - 1, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const closed  = isClosed(y, m, d);
    const avail   = (!closed && !isPast) ? getAvailable(y, m, d) : 0;

    let cls = 'cal-cell ';
    let seat = '';
    if (closed || isPast) {
      cls += 'cal-closed'; seat = closed ? '休業' : ''; cell.disabled = true;
    } else if (avail === 0) {
      cls += 'cal-full'; seat = '満席'; cell.disabled = true;
    } else if (avail <= CAL_CONFIG.warnThreshold) {
      cls += 'cal-warn'; seat = `残${avail}`;
    } else {
      cls += 'cal-open'; seat = `${avail}席`;
    }

    if (isToday) cls += ' cal-today';
    cell.className   = cls;
    cell.dataset.date = dateKey(y, m, d);
    cell.innerHTML   = `<span class="cal-day-num">${d}</span><span class="cal-day-seat">${seat}</span>`;

    if (!cell.disabled) {
      cell.addEventListener('click', () => selectDate(y, m, d, avail));
    }
    grid.appendChild(cell);
  }
}

/* ═══════════════════════════════════════════
 * 日付選択
 * ═══════════════════════════════════════════ */
function selectDate(y, m, d, avail) {
  document.querySelectorAll('.cal-cell.cal-selected')
    .forEach(el => el.classList.remove('cal-selected'));

  const cell = document.querySelector(`.cal-cell[data-date="${dateKey(y, m, d)}"]`);
  if (cell) cell.classList.add('cal-selected');

  const dow   = DOW[new Date(y, m - 1, d).getDay()];
  const label = `${y}年${m}月${d}日（${dow}）`;

  selectedDate = { y, m, d, avail, label };

  // Analytics: 日付を選択した
  if (typeof gtag !== 'undefined') gtag('event', 'date_selected', { event_category: 'reservation', date: dateKey(y, m, d), available_seats: avail });

  document.getElementById('cal-selected-date').textContent  = label;
  document.getElementById('cal-selected-seats').textContent = `空席 ${avail} 席　／　受付時間 18:00〜22:00`;
  document.getElementById('cal-selected-info')?.classList.remove('hidden');
}

/* ═══════════════════════════════════════════
 * カレンダーモーダル開閉
 * ═══════════════════════════════════════════ */
async function openCalModal() {
  const modal = document.getElementById('reserve-calendar-modal');
  const panel = modal?.querySelector('.cal-panel');
  modal?.classList.remove('opacity-0', 'pointer-events-none');
  panel?.classList.remove('translate-y-4');
  document.body.style.overflow = 'hidden';

  // Analytics: カレンダーを開いた
  if (typeof gtag !== 'undefined') gtag('event', 'calendar_open', { event_category: 'reservation' });

  // 開くたびに今月・来月のキャッシュをクリアして最新データを取得
  const now = new Date();
  const y = now.getFullYear(), m = now.getMonth() + 1;
  const next = m < 12 ? m + 1 : 1;
  const nextY = m < 12 ? y : y + 1;
  fetchedMonths.delete(`${y}-${pad(m)}`);
  fetchedMonths.delete(`${nextY}-${pad(next)}`);
  await Promise.all([
    fetchMonthData(y, m),
    fetchMonthData(nextY, next),
  ]);
  renderCalendar(currentYear, currentMonth);
}

function closeCalModal() {
  const modal = document.getElementById('reserve-calendar-modal');
  const panel = modal?.querySelector('.cal-panel');
  modal?.classList.add('opacity-0', 'pointer-events-none');
  panel?.classList.add('translate-y-4');
  if (!document.getElementById('reserve-form-modal')?.classList.contains('pointer-events-none')) return;
  document.body.style.overflow = '';
}

/* ═══════════════════════════════════════════
 * フォームモーダル開閉
 * ═══════════════════════════════════════════ */
function openFormModal() {
  if (!selectedDate) return;

  // Analytics: 予約フォームを開いた
  if (typeof gtag !== 'undefined') gtag('event', 'form_open', { event_category: 'reservation', date: dateKey(selectedDate.y, selectedDate.m, selectedDate.d) });

  // カレンダーを隠す
  closeCalModal();

  // ヘッダーに日付セット
  document.getElementById('rf-header-date').textContent   = selectedDate.label;
  document.getElementById('rf-success-date').textContent  = selectedDate.label;

  // フォームを初期状態にリセット
  resetForm();

  const modal = document.getElementById('reserve-form-modal');
  const panel = modal?.querySelector('.rf-panel');
  modal?.classList.remove('opacity-0', 'pointer-events-none');
  panel?.classList.remove('translate-y-4');
  document.body.style.overflow = 'hidden';

  // 最上部にスクロール
  panel?.scrollTo(0, 0);
}

function closeFormModal() {
  const modal = document.getElementById('reserve-form-modal');
  const panel = modal?.querySelector('.rf-panel');
  modal?.classList.add('opacity-0', 'pointer-events-none');
  panel?.classList.add('translate-y-4');
  document.body.style.overflow = '';
}

function backToCalendar() {
  closeFormModal();
  setTimeout(openCalModal, 200);
}

/* ═══════════════════════════════════════════
 * フォームリセット
 * ═══════════════════════════════════════════ */
function resetForm() {
  const form = document.getElementById('reserve-form');
  form?.reset();
  form?.classList.remove('hidden');
  document.getElementById('rf-loading')?.classList.add('hidden');
  document.getElementById('rf-success')?.classList.add('hidden');
  document.getElementById('rf-error-view')?.classList.add('hidden');

  // バリデーションエラークリア
  document.querySelectorAll('.rf-error').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.rf-invalid').forEach(el => el.classList.remove('rf-invalid'));
}

/* ═══════════════════════════════════════════
 * バリデーション
 * ═══════════════════════════════════════════ */
function validateForm() {
  let valid = true;

  const fields = [
    { id: 'rf-name',  msg: 'rf-name'  },
    { id: 'rf-kana',  msg: 'rf-kana'  },
    { id: 'rf-email', msg: 'rf-email' },
    { id: 'rf-phone', msg: 'rf-phone' },
    { id: 'rf-party', msg: 'rf-party' },
  ];

  fields.forEach(({ id }) => {
    const input = document.getElementById(id);
    const error = input?.nextElementSibling;
    if (!input?.value.trim() || (id === 'rf-email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value))) {
      input?.classList.add('rf-invalid');
      error?.classList.remove('hidden');
      valid = false;
    } else {
      input?.classList.remove('rf-invalid');
      error?.classList.add('hidden');
    }
  });

  // コース選択チェック
  const courseChecked = document.querySelector('input[name="course_type"]:checked');
  const courseError   = document.querySelector('.rf-error-course');
  if (!courseChecked) {
    courseError?.classList.remove('hidden');
    valid = false;
  } else {
    courseError?.classList.add('hidden');
  }

  return valid;
}

/* ═══════════════════════════════════════════
 * フォーム送信
 * ═══════════════════════════════════════════ */
async function submitReservation(e) {
  e.preventDefault();
  if (!validateForm()) return;

  const form    = document.getElementById('reserve-form');
  const loading = document.getElementById('rf-loading');
  const success = document.getElementById('rf-success');
  const errView = document.getElementById('rf-error-view');
  const errMsg  = document.getElementById('rf-error-msg');

  form.classList.add('hidden');
  loading.classList.remove('hidden');

  const data = {
    reservation_date : dateKey(selectedDate.y, selectedDate.m, selectedDate.d),
    name             : document.getElementById('rf-name').value.trim(),
    kana             : document.getElementById('rf-kana').value.trim(),
    email            : document.getElementById('rf-email').value.trim(),
    phone            : document.getElementById('rf-phone').value.trim(),
    party_size       : Number(document.getElementById('rf-party').value),
    course_type      : document.querySelector('input[name="course_type"]:checked').value,
    allergies        : document.getElementById('rf-allergies').value.trim(),
    notes            : document.getElementById('rf-notes').value.trim(),
  };

  try {
    // ── 現在はコンソール確認のみ（API実装後に差し替え）──
    if (API_URL) {
      const res = await fetch(`${API_URL}/reserve`, {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await res.text());
    } else {
      // API未設定時: 1秒待って成功扱い（開発用）
      await new Promise(r => setTimeout(r, 1000));
      console.log('[予約フォーム] 送信データ:', data);
    }

    loading.classList.add('hidden');
    success.classList.remove('hidden');

    // Analytics: 予約完了
    const prices = { half: 6500, omakase: 10000, selection: 12000 };
    if (typeof gtag !== 'undefined') gtag('event', 'reservation_complete', {
      event_category : 'reservation',
      course_type    : data.course_type,
      party_size     : data.party_size,
      value          : (prices[data.course_type] || 0) * data.party_size,
      currency       : 'JPY',
    });

    // カレンダーのローカルデータも仮更新
    const key = data.reservation_date;
    reservationData[key] = (reservationData[key] ?? 0) + data.party_size;
    renderCalendar(currentYear, currentMonth);

  } catch (err) {
    loading.classList.add('hidden');
    console.error('[予約フォーム] エラー:', err);

    // サーバーエラー・通信エラーの場合は電話案内ポップアップを表示
    const isServerError = !err.message
      || err.message.includes('500')
      || err.message.includes('fetch')
      || err.message.includes('network')
      || err.message.includes('NetworkError')
      || err.message.includes('サーバーエラー');

    if (isServerError) {
      closeFormModal();
      document.getElementById('server-error-modal')?.classList.remove('hidden');
    } else {
      errMsg.textContent = err.message || '通信エラーが発生しました。しばらく経ってから再度お試しください。';
      errView.classList.remove('hidden');
    }
  }
}

/* ═══════════════════════════════════════════
 * バッジ更新
 * ═══════════════════════════════════════════ */
function updateBadge() {
  const dot  = document.getElementById('availability-dot');
  const text = document.getElementById('availability-text');
  if (!dot || !text) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let availSum = 0;

  // 今日から30日先までチェック
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const y = d.getFullYear(), m = d.getMonth() + 1, dd = d.getDate();
    if (isClosed(y, m, dd)) continue;
    availSum += getAvailable(y, m, dd);
  }

  if (availSum === 0) {
    dot.style.background = '#f87171';
    dot.style.boxShadow  = '0 0 6px #f87171';
    text.textContent     = '近日満席です';
    text.style.color     = '#f87171';
  } else {
    dot.style.background = '#34d399';
    dot.style.boxShadow  = '0 0 6px #34d399';
    text.textContent     = 'カレンダーで空席を確認';
    text.style.color     = '';
  }
}

/* ═══════════════════════════════════════════
 * 初期化
 * ═══════════════════════════════════════════ */
async function init() {
  // 手動設定をベースに（API失敗時のフォールバック）
  reservationData = { ...CAL_CONFIG.reservations };

  const now = new Date();
  const y   = now.getFullYear();
  const m   = now.getMonth() + 1;

  // 今月から6ヶ月分を並列取得
  const fetches = [];
  for (let i = 0; i < 6; i++) {
    const dm = m + i;
    fetches.push(fetchMonthData(dm > 12 ? y + 1 : y, dm > 12 ? dm - 12 : dm));
  }
  await Promise.all(fetches);

  renderCalendar(y, m);
  updateBadge();

  /* ── カレンダーモーダル ── */
  document.getElementById('open-calendar-btn')?.addEventListener('click', openCalModal);
  document.getElementById('cta-reserve-btn')?.addEventListener('click', openCalModal);
  document.getElementById('cal-close')?.addEventListener('click', closeCalModal);
  document.getElementById('cal-backdrop')?.addEventListener('click', closeCalModal);

  document.getElementById('cal-prev')?.addEventListener('click', async () => {
    let m = currentMonth - 1, y = currentYear;
    if (m < 1) { m = 12; y--; }
    await fetchMonthData(y, m);
    renderCalendar(y, m);
  });
  document.getElementById('cal-next')?.addEventListener('click', async () => {
    let m = currentMonth + 1, y = currentYear;
    if (m > 12) { m = 1; y++; }
    await fetchMonthData(y, m);
    renderCalendar(y, m);
  });

  /* ── 「この日を予約する」→ フォームを開く ── */
  document.getElementById('cal-to-form-btn')?.addEventListener('click', openFormModal);

  /* ── フォームモーダル ── */
  document.getElementById('form-backdrop')?.addEventListener('click', closeFormModal);
  document.getElementById('rf-close-btn')?.addEventListener('click', closeFormModal);
  document.getElementById('rf-back-btn')?.addEventListener('click', backToCalendar);
  document.getElementById('reserve-form')?.addEventListener('submit', submitReservation);
  document.getElementById('rf-done-btn')?.addEventListener('click', closeFormModal);
  document.getElementById('rf-retry-btn')?.addEventListener('click', () => {
    document.getElementById('rf-error-view')?.classList.add('hidden');
    document.getElementById('reserve-form')?.classList.remove('hidden');
  });

  /* ── ESC で閉じる ── */
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!document.getElementById('reserve-form-modal')?.classList.contains('pointer-events-none')) {
      closeFormModal();
    } else {
      closeCalModal();
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
