const $ = id => document.getElementById(id);
const hosted = document.body.hasAttribute('data-hosted') || location.protocol === 'file:';
let state;
let ended = false;
let formFilled = false;

async function request(path, body) {
  const response = await fetch(path, body === undefined ? {} : {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Could not update the app.');
  return data;
}

// The date box shows the PC's own time; the app keeps seconds since 1970, so time zones never mix up.
function toLocalInput(seconds) {
  const d = new Date(seconds * 1000);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Discord draws the last day's timer as 5:12:33 left, in green beside the hourglass.
function drawTimer() {
  const line = $('timer').parentElement;
  line.classList.remove('running');
  if (ended) { $('timer').textContent = 'App closed. You can close this tab.'; return; }
  const end = state?.card?.timestamps?.end;
  if (!end) { $('timer').textContent = ''; return; }
  const left = Math.max(0, end - Math.floor(Date.now() / 1000));
  const h = Math.floor(left / 3600), m = Math.floor(left / 60) % 60, sec = String(left % 60).padStart(2, '0');
  $('timer').textContent = (h ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`) + ' left';
  line.classList.add('running');
}

function drawCard(card, config) {
  $('title-preview').textContent = card?.name || config?.title || 'Countdown';
  $('event-preview').textContent = card?.details || config?.event || 'Something big';
  $('state-preview').textContent = card?.state || (config?.targetAt ? 'Countdown over' : 'Choose a date');
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
    if (!formFilled) {
      // Filled once, so a refresh never overwrites what is being typed.
      $('event').value = state.config.event;
      $('title').value = state.config.title;
      $('client').value = state.config.clientId;
      if (state.config.targetAt) $('when').value = toLocalInput(state.config.targetAt);
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
  const when = new Date($('when').value);
  if (Number.isNaN(when.getTime())) { $('save-status').textContent = 'Choose a date and time.'; return; }
  const input = { event: $('event').value, title: $('title').value, targetAt: Math.floor(when.getTime() / 1000) };
  if (hosted) {
    state = { config: { ...input, showDate: true } };
    drawCard({ name: input.title, details: input.event, state: 'Counting down' });
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
  // The public page shows an example card with a live last-day timer.
  document.body.classList.add('hosted');
  $('download').hidden = false;
  $('quit').hidden = true;
  $('client').closest('label').hidden = true;
  const end = Math.floor(Date.now() / 1000) + 5 * 3600 + 12 * 60;
  state = { card: { name: 'Countdown', details: 'My birthday', state: 'Today', timestamps: { end } } };
  drawCard(state.card);
  $('manual').setAttribute('aria-pressed', 'true');
  $('off').setAttribute('aria-pressed', 'false');
  drawTimer();
} else void refresh();
setInterval(refresh, 2000);
setInterval(drawTimer, 1000);
