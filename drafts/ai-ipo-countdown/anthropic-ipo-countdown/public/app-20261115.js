const $ = id => document.getElementById(id);
const hosted = document.body.hasAttribute('data-hosted') || location.protocol === 'file:';
let state;
let ended = false;
let formFilled = false;
// What the public page shows: the expected first trade, Thursday 19 November 2026, 9:30am in New York.
const EXAMPLE = { title: 'Anthropic IPO', ticker: 'ANT', exchange: 'Nasdaq', targetAt: 1795098600, pricingAt: 1795039200 };

async function request(path, body) {
  const response = await fetch(path, body === undefined ? {} : {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Could not update the app.');
  return data;
}

// The date boxes show the PC's own time; the app keeps seconds since 1970, so time zones never mix up.
function toLocalInput(seconds) {
  const d = new Date(seconds * 1000);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function fromLocalInput(value) {
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : Math.floor(time / 1000);
}
const clock = (seconds, days = true) => {
  const d = Math.floor(seconds / 86400), h = Math.floor(seconds / 3600) % (days ? 24 : Infinity);
  const m = String(Math.floor(seconds / 60) % 60).padStart(2, '0'), s = String(seconds % 60).padStart(2, '0');
  return (days && d ? `${d}d ` : '') + `${days && d ? String(h).padStart(2, '0') : h}:${m}:${s}`;
};

// Discord draws its timers as 5:12:33 left before the bell and 1:02:09 elapsed after it, in green beside the bell.
function drawTimer() {
  const now = Math.floor(Date.now() / 1000);
  const line = $('timer').parentElement;
  line.classList.remove('running');
  const config = state?.config || EXAMPLE;
  if (ended) { $('timer').textContent = 'App closed. You can close this tab.'; }
  else if (state?.card?.timestamps?.end) {
    $('timer').textContent = clock(Math.max(0, state.card.timestamps.end - now), false) + ' left';
    line.classList.add('running');
  } else if (state?.card?.timestamps?.start) {
    $('timer').textContent = clock(Math.max(0, now - state.card.timestamps.start), false) + ' elapsed';
    line.classList.add('running');
  } else $('timer').textContent = '';
  // The big count over the galaxy: days, hours, minutes and seconds to the opening bell, then that it is trading.
  const bell = document.querySelector('.bell');
  if (!config.targetAt) { $('big-count').textContent = '--:--:--'; $('big-label').textContent = 'Choose the first trade'; return; }
  const left = config.targetAt - now;
  bell.classList.toggle('live', left <= 0);
  $('big-count').textContent = left > 0 ? clock(left) : `${config.ticker} is trading`;
  $('big-label').textContent = left > 0 ? `until ${config.ticker} opens on ${config.exchange}` : `on ${config.exchange} since the opening bell`;
}

function drawSummary(config) {
  if (!config?.targetAt) { $('setup-summary').textContent = 'Choose the first trade'; return; }
  const d = new Date(config.targetAt * 1000);
  const date = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  $('setup-summary').textContent = `${date} · ${config.exchange}: ${config.ticker}`;
}

function drawCard(card, config) {
  drawSummary(config);
  $('title-preview').textContent = card?.name || config?.title || 'Anthropic IPO';
  $('event-preview').textContent = card?.details || (config ? `${config.exchange}: ${config.ticker}` : '');
  $('state-preview').textContent = card?.state || (config?.targetAt ? 'Trading day is over' : 'Choose the first trade');
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
    $('status-line').textContent = state.message;
    $('client-label').hidden = Boolean(state.config.clientId) && formFilled;
    if (!formFilled) {
      // Filled once, so a refresh never overwrites what is being typed.
      $('ticker').value = state.config.ticker;
      $('exchange').value = state.config.exchange;
      $('client').value = state.config.clientId;
      if (state.config.targetAt) $('when').value = toLocalInput(state.config.targetAt);
      if (state.config.pricingAt) $('pricing').value = toLocalInput(state.config.pricingAt);
      if (!state.config.clientId) $('setup-box').open = true;
      formFilled = true;
    }
    drawTimer();
  } catch {
    state = null;
    $('status-line').textContent = 'The app is not answering. Start it again from its folder.';
    drawTimer();
  }
}

$('setup').addEventListener('submit', async event => {
  event.preventDefault();
  const targetAt = fromLocalInput($('when').value);
  if (targetAt === null) { $('save-status').textContent = 'Choose the date and time of the first trade.'; return; }
  const input = { targetAt, pricingAt: fromLocalInput($('pricing').value), ticker: $('ticker').value, exchange: $('exchange').value };
  if (hosted) {
    state = { config: { ...EXAMPLE, ...input, ticker: input.ticker.toUpperCase() } };
    drawCard(null, state.config);
    drawTimer();
    $('save-status').textContent = 'This is a preview. Download the app to put it on your profile.';
    return;
  }
  input.clientId = $('client').value.trim();
  try {
    await request('/api/config', input);
    $('save-status').textContent = 'Saved.';
    await refresh();
  } catch (error) { $('save-status').textContent = error.message; }
});

$('date').addEventListener('click', async () => {
  if (hosted || !state) return;
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
    document.querySelectorAll('button, input').forEach(control => { control.disabled = true; });
  } catch {}
});
if (hosted) {
  // The public page shows the expected dates, counting live.
  document.body.classList.add('hosted');
  $('download').hidden = false;
  $('quit').hidden = true;
  $('client-label').hidden = true;
  $('ticker').value = EXAMPLE.ticker;
  $('exchange').value = EXAMPLE.exchange;
  $('when').value = toLocalInput(EXAMPLE.targetAt);
  $('pricing').value = toLocalInput(EXAMPLE.pricingAt);
  // The example card: whole calendar days to the bell, as the app counts them.
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
