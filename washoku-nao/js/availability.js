/**
 * availability.js — 予約空席カレンダー
 *
 * ■ 運用方法（手動モード）
 *   RESERVATIONS に「日付: 予約済み人数」を入力するだけ。
 *   例: '2026-05-18': 7  → 満席10のうち7予約済み = 残り3席
 *
 * ■ 休業日
 *   毎週日曜、毎月第2月曜が自動で休業日になります。
 *   EXTRA_CLOSED に追加の休業日を書けます。
 *
 * ■ 将来のAPI連携
 *   API_URL にエンドポイントを設定するとAPIから取得します。
 */

/* ═══════════════════════════════════════════
 * ★ 設定エリア（ここだけ変更すればOK）
 * ═══════════════════════════════════════════ */
const CAL_CONFIG = {
  totalSeats: 10,           // 1日あたりの最大受入数
  warnThreshold: 3,         // この席数以下で「残りわずか」表示
  contactEmail: 'info@washoku-nao.jp',

  // 予約済み人数（日付 → 埋まっている席数）
  // 0 = 空き満席 / totalSeats以上 = 満席
  reservations: {
    // ── 2026年5月 ──
    '2026-05-21': 8,
    '2026-05-22': 10,   // 満席
    '2026-05-23': 10,   // 満席
    '2026-05-27': 7,
    '2026-05-28': 10,   // 満席
    '2026-05-29': 9,
    '2026-05-30': 10,   // 満席
    // ── 2026年6月 ──
    '2026-06-03': 8,
    '2026-06-05': 10,   // 満席
    '2026-06-10': 7,
    '2026-06-12': 10,   // 満席
    '2026-06-17': 6,
    '2026-06-19': 10,   // 満席
  },

  // 定休日以外の臨時休業日
  extraClosed: [
    // '2026-06-15',
  ],
};

// API連携（nullなら手動設定を使用）
const API_URL = null;
// 例: const API_URL = '/api/availability';

/* ═══════════════════════════════════════════
 * 内部ロジック
 * ═══════════════════════════════════════════ */

let currentYear, currentMonth, reservationData;

function pad(n) { return String(n).padStart(2, '0'); }
function dateKey(y, m, d) { return `${y}-${pad(m)}-${pad(d)}`; }

// 第N月曜判定
function isNthMonday(date, n) {
  if (date.getDay() !== 1) return false;
  return Math.ceil(date.getDate() / 7) === n;
}

// 休業日判定（毎週日曜 + 第2月曜 + 臨時）
function isClosed(y, m, d) {
  const date = new Date(y, m - 1, d);
  const dow  = date.getDay();
  if (dow === 0) return true;                        // 日曜
  if (isNthMonday(date, 2)) return true;             // 第2月曜
  if (CAL_CONFIG.extraClosed.includes(dateKey(y, m, d))) return true;
  return false;
}

// 空席数を返す
function getAvailable(y, m, d) {
  const key    = dateKey(y, m, d);
  const booked = reservationData[key] ?? 0;
  return Math.max(0, CAL_CONFIG.totalSeats - booked);
}

/* ─── カレンダー描画 ─── */
function renderCalendar(y, m) {
  currentYear  = y;
  currentMonth = m;

  const label  = document.getElementById('cal-month-label');
  const grid   = document.getElementById('cal-grid');
  const info   = document.getElementById('cal-selected-info');
  if (!grid) return;

  label.textContent = `${y}年 ${m}月`;
  grid.innerHTML    = '';
  if (info) info.classList.add('hidden');

  const firstDay = new Date(y, m - 1, 1).getDay(); // 0=日
  const daysInMonth = new Date(y, m, 0).getDate();
  const today = new Date();

  // 空白セル
  for (let i = 0; i < firstDay; i++) {
    grid.appendChild(Object.assign(document.createElement('div'), { className: 'cal-cell cal-empty' }));
  }

  // 日付セル
  for (let d = 1; d <= daysInMonth; d++) {
    const cell    = document.createElement('button');
    const key     = dateKey(y, m, d);
    const isToday = (y === today.getFullYear() && m === today.getMonth() + 1 && d === today.getDate());
    const isPast  = new Date(y, m - 1, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const closed  = isClosed(y, m, d);
    const avail   = closed ? 0 : getAvailable(y, m, d);

    let statusClass = '';
    let seatLabel   = '';

    if (closed || isPast) {
      statusClass = 'cal-closed';
      seatLabel   = closed ? '休業' : '';
      cell.disabled = true;
    } else if (avail === 0) {
      statusClass = 'cal-full';
      seatLabel   = '満席';
      cell.disabled = true;
    } else if (avail <= CAL_CONFIG.warnThreshold) {
      statusClass = 'cal-warn';
      seatLabel   = `残${avail}`;
    } else {
      statusClass = 'cal-open';
      seatLabel   = `${avail}席`;
    }

    cell.className = `cal-cell ${statusClass}${isToday ? ' cal-today' : ''}`;
    cell.innerHTML = `<span class="cal-day-num">${d}</span><span class="cal-day-seat">${seatLabel}</span>`;
    cell.dataset.date  = key;
    cell.dataset.avail = avail;

    if (!cell.disabled) {
      cell.addEventListener('click', () => selectDate(y, m, d, avail));
    }

    grid.appendChild(cell);
  }
}

function selectDate(y, m, d, avail) {
  // 選択状態リセット
  document.querySelectorAll('.cal-cell.cal-selected').forEach(el => el.classList.remove('cal-selected'));
  const key  = dateKey(y, m, d);
  const cell = document.querySelector(`.cal-cell[data-date="${key}"]`);
  if (cell) cell.classList.add('cal-selected');

  // 下部情報パネル更新
  const info      = document.getElementById('cal-selected-info');
  const dateEl    = document.getElementById('cal-selected-date');
  const seatsEl   = document.getElementById('cal-selected-seats');
  const link      = document.getElementById('cal-reserve-link');
  if (!info) return;

  const DOW = ['日', '月', '火', '水', '木', '金', '土'];
  const dow  = DOW[new Date(y, m - 1, d).getDay()];
  dateEl.textContent  = `${y}年${m}月${d}日（${dow}）`;
  seatsEl.textContent = `空席 ${avail} 席 ／ 受付時間 17:00〜22:00`;

  const subject = encodeURIComponent(`ご予約のお問い合わせ（${y}年${m}月${d}日）`);
  const body    = encodeURIComponent(`【ご希望日】${y}年${m}月${d}日\n【人数】\n【お名前】\n【お電話番号】\n【アレルギー等】`);
  link.href     = `mailto:${CAL_CONFIG.contactEmail}?subject=${subject}&body=${body}`;

  info.classList.remove('hidden');
}

/* ─── モーダル開閉 ─── */
function openModal() {
  const modal = document.getElementById('reserve-calendar-modal');
  const panel = modal?.querySelector('.cal-panel');
  if (!modal) return;
  modal.classList.remove('opacity-0', 'pointer-events-none');
  panel?.classList.remove('translate-y-4');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('reserve-calendar-modal');
  const panel = modal?.querySelector('.cal-panel');
  if (!modal) return;
  modal.classList.add('opacity-0', 'pointer-events-none');
  panel?.classList.add('translate-y-4');
  document.body.style.overflow = '';
}

/* ─── 初期化 ─── */
async function init() {
  // データ取得
  if (API_URL) {
    try {
      const res = await fetch(API_URL, { cache: 'no-store' });
      const data = await res.json();
      reservationData = data.reservations ?? {};
    } catch {
      reservationData = CAL_CONFIG.reservations;
    }
  } else {
    reservationData = CAL_CONFIG.reservations;
  }

  // 当月を表示
  const now = new Date();
  renderCalendar(now.getFullYear(), now.getMonth() + 1);

  // イベント
  document.getElementById('open-calendar-btn')
    ?.addEventListener('click', openModal);

  document.getElementById('cal-close')
    ?.addEventListener('click', closeModal);

  document.getElementById('cal-backdrop')
    ?.addEventListener('click', closeModal);

  document.getElementById('cal-prev')?.addEventListener('click', () => {
    let m = currentMonth - 1, y = currentYear;
    if (m < 1) { m = 12; y--; }
    renderCalendar(y, m);
  });

  document.getElementById('cal-next')?.addEventListener('click', () => {
    let m = currentMonth + 1, y = currentYear;
    if (m > 12) { m = 1; y++; }
    renderCalendar(y, m);
  });

  // ESCキーで閉じる
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  // バッジ表示
  updateBadge(now.getFullYear(), now.getMonth() + 1);
}

function updateBadge(y, m) {
  const dot  = document.getElementById('availability-dot');
  const text = document.getElementById('availability-text');
  if (!dot || !text) return;

  // 今月の残席合計（平均）
  const now = new Date();
  let openDays = 0, availableSum = 0;
  const days = new Date(y, m, 0).getDate();
  for (let d = 1; d <= days; d++) {
    if (new Date(y, m - 1, d) < now) continue;
    if (isClosed(y, m, d)) continue;
    openDays++;
    availableSum += getAvailable(y, m, d);
  }

  const hasAvail = availableSum > 0;
  if (!hasAvail) {
    dot.style.background = '#f87171';
    dot.style.boxShadow  = '0 0 6px #f87171';
    text.textContent = `今月は満席です`;
    text.style.color = '#f87171';
  } else {
    text.textContent = `カレンダーで空席を確認`;
    text.style.color = '';
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
