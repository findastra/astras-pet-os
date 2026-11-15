const $ = id => document.getElementById(id);
const hosted = document.body.hasAttribute('data-hosted') || location.protocol === 'file:';
let state;
let ended = false;
// What the public page shows: the expected first trade, Thursday 19 November 2026, 9:30am in New York.
const EXAMPLE = { title: 'Anthropic IPO', ticker: 'ANT', exchange: 'Nasdaq', targetAt: 1795098600 };

async function request(path, body) {
  const response = await fetch(path, body === undefined ? {} : {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Could not update the app.');
  return data;
}

const clock = (seconds, days = true) => {
  const d = Math.floor(seconds / 86400), h = Math.floor(seconds / 3600) % (days ? 24 : Infinity);
  const m = String(Math.floor(seconds / 60) % 60).padStart(2, '0'), s = String(seconds % 60).padStart(2, '0');
  return (days && d ? `${d}d ` : '') + `${days && d ? String(h).padStart(2, '0') : h}:${m}:${s}`;
};

// Discord writes its timers as 5:12:33 left before the bell and 1:02:09 elapsed after it, in green beside a
// controller. Far from the bell the card has no timer, as on Discord.
function drawTimer() {
  const now = Math.floor(Date.now() / 1000);
  const line = $('timer').parentElement;
  line.classList.remove('running');
  const card = state?.card;
  if (ended) $('timer').textContent = 'App closed. You can close this tab.';
  else if (!hosted && state && !state.config.clientId) $('timer').textContent = 'Add a Discord Application ID (README)';
  else if (!hosted && state?.mode !== 'manual') $('timer').textContent = 'Ready when you are';
  else if (card?.timestamps?.end) {
    $('timer').textContent = clock(Math.max(0, card.timestamps.end - now), false) + ' left';
    line.classList.add('running');
  } else if (card?.timestamps?.start) {
    $('timer').textContent = clock(Math.max(0, now - card.timestamps.start), false) + ' elapsed';
    line.classList.add('running');
  } else $('timer').textContent = '';
  // The big count over the galaxy: days, hours, minutes and seconds to the opening bell, then that it is trading.
  const config = state?.config || EXAMPLE;
  const left = config.targetAt - now;
  document.querySelector('.bell').classList.toggle('live', left <= 0);
  $('big-count').textContent = left > 0 ? clock(left) : `${config.ticker} is trading`;
  $('big-label').textContent = left > 0 ? `until ${config.ticker} opens on ${config.exchange}` : `on ${config.exchange} since the opening bell`;
}

function drawCard(card, config) {
  $('title-preview').textContent = card?.name || config.title;
  $('event-preview').textContent = card?.details || `${config.exchange}: ${config.ticker}`;
  $('state-preview').textContent = card?.state || 'First trading day is over';
}

async function refresh() {
  if (ended || hosted) return;
  try {
    state = await request('/api/status');
    drawCard(state.card, state.config);
    $('date').textContent = state.config.showDate ? 'Hide Date' : 'Show Date';
    $('date').setAttribute('aria-pressed', String(state.config.showDate === true));
    // Start and Stop are one choice: only the current mode is lit.
    for (const mode of ['manual', 'off']) $(mode).setAttribute('aria-pressed', String(state.mode === mode));
    drawTimer();
  } catch {
    state = null;
    drawTimer();
  }
}

$('date').addEventListener('click', async () => {
  if (hosted) {
    const on = $('date').getAttribute('aria-pressed') !== 'true';
    $('date').setAttribute('aria-pressed', String(on));
    $('date').textContent = on ? 'Hide Date' : 'Show Date';
    $('event-preview').textContent = on ? 'Nasdaq: ANT · Thu, Nov 19' : 'Nasdaq: ANT';
    return;
  }
  if (!state) return;
  $('date').disabled = true;
  try { await request('/api/config', { showDate: !state.config.showDate }); await refresh(); }
  catch {}
  finally { $('date').disabled = false; }
});

for (const mode of ['manual', 'off']) {
  $(mode).addEventListener('click', async () => {
    if (hosted) {
      for (const other of ['manual', 'off']) $(other).setAttribute('aria-pressed', String(other === mode));
      return;
    }
    $(mode).disabled = true;
    try { await request('/api/mode', { mode }); await refresh(); }
    catch {}
    finally { $(mode).disabled = false; }
  });
}
// Quit closes the whole app, so a stray click only asks: a second click within 3 seconds quits.
let quitAsk;
$('quit').addEventListener('click', async () => {
  if (!quitAsk) {
    $('quit').textContent = 'Click again to quit';
    quitAsk = setTimeout(() => { quitAsk = null; $('quit').textContent = 'Quit'; }, 3000);
    return;
  }
  clearTimeout(quitAsk);
  try {
    await request('/api/quit', {});
    ended = true;
    state = null;
    drawTimer();
    document.querySelectorAll('button').forEach(button => { button.disabled = true; });
  } catch {}
});
if (hosted) {
  // The public page: the example card, counting the days to the expected bell.
  document.body.classList.add('hosted');
  $('download').hidden = false;
  $('quit').hidden = true;
  const day = seconds => { const d = new Date(seconds * 1000); return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000; };
  const days = day(EXAMPLE.targetAt) - day(Math.floor(Date.now() / 1000));
  const words = days > 1 ? `${days} days to go` : days === 1 ? 'Trading tomorrow' : days === 0 ? 'Opening bell today' : "It's here!";
  state = { config: EXAMPLE, card: { name: EXAMPLE.title, details: 'Nasdaq: ANT · Thu, Nov 19', state: words } };
  drawCard(state.card, EXAMPLE);
  $('manual').setAttribute('aria-pressed', 'true');
  $('off').setAttribute('aria-pressed', 'false');
} else void refresh();
drawTimer();
setInterval(refresh, 2000);
setInterval(drawTimer, 1000);
