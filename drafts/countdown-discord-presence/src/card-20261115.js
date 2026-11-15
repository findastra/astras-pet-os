// What the Discord card says, and the settings that shape it.

// The project's own Discord application. Not registered yet: until Astra makes "Countdown Presence" in the
// Discord Developer Portal and its ID is written here, the page asks for an Application ID once.
// Application IDs are public, so friends can use the built-in one without any setup.
export const BUILT_IN_CLIENT_ID = '';

// Card art: loaded by Discord straight from the public repo, so nobody has to upload it in the Developer Portal.
// Bump ?v= whenever the card art changes so Discord fetches the new image instead of a cached one.
export const HOURGLASS_URL = 'https://raw.githubusercontent.com/findastra/countdown-discord-presence/main/public/hourglass-card-20261115.png?v=1';

const DAY = 86400;
const HOUR = 3600;
export const DEFAULTS = Object.freeze({ title: 'Countdown', event: 'Something big', targetAt: null, showDate: true,
  celebrateHours: 24, automaticOnStart: true });

export function clean(value, max = 110) {
  return String(value ?? '').replace(/[\x00-\x1f\x7f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
}

// "12 days to go", "Tomorrow", "Today": whole calendar days in the PC's own time zone, so an event at 9am
// tomorrow says "Tomorrow" tonight, never "0 days to go".
export function daysLeft(targetAt, now, timeZoneOffsetMinutes = new Date(now * 1000).getTimezoneOffset()) {
  const local = seconds => Math.floor((seconds - timeZoneOffsetMinutes * 60) / DAY);
  return local(targetAt) - local(now);
}

export function remaining(targetAt, now, offset) {
  const seconds = targetAt - now;
  if (seconds <= 0) return 'here';
  const days = daysLeft(targetAt, now, offset);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days < 7 * 8) return `${days} days to go`;
  const weeks = Math.floor(days / 7);
  return `${weeks} weeks to go`;
}

// "Sat, Dec 25" in English, from the PC's own time zone.
export function shortDate(targetAt, offset = new Date(targetAt * 1000).getTimezoneOffset()) {
  const d = new Date((targetAt - offset * 60) * 1000);
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getUTCDay()];
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getUTCMonth()];
  return `${day}, ${month} ${d.getUTCDate()}`;
}

// Where the countdown stands: counting, celebrating (the moment has come, for celebrateHours) or over.
export function phase(config, now) {
  if (!Number.isInteger(config.targetAt)) return 'unset';
  if (now < config.targetAt) return 'counting';
  return now < config.targetAt + config.celebrateHours * HOUR ? 'celebrating' : 'over';
}

export class Presence {
  mode = 'off';
  setMode(mode) {
    if (!['off', 'manual'].includes(mode)) throw new Error('Choose Start or Stop.');
    this.mode = mode;
  }
}

// The card Discord shows. Discord draws the live "05:12:33 left" itself from timestamps.end, so it is sent only on
// the last day: further out, the hours would read as "283:12:33 left", so the line says "12 days to go" instead.
export function activity(config, now = Math.floor(Date.now() / 1000), offset) {
  const where = phase(config, now);
  if (where === 'unset' || where === 'over') return null;
  const event = clean(config.event, 100) || DEFAULTS.event;
  const card = {
    type: 0,
    // Card title. Discord shows this instead of the registered app name.
    name: clean(config.title, 64) || DEFAULTS.title,
    details: event,
    assets: { large_image: config.image || HOURGLASS_URL, large_text: config.showDate ? shortDate(config.targetAt, offset) : 'Countdown' },
  };
  if (where === 'celebrating') {
    card.state = "It's here!";
    return card;
  }
  const left = remaining(config.targetAt, now, offset);
  card.state = config.showDate && left !== 'Today' ? `${left} · ${shortDate(config.targetAt, offset)}` : left;
  if (config.targetAt - now <= DAY) card.timestamps = { end: config.targetAt };
  return card;
}

export function validateConfig(input = {}) {
  const clientId = String(input.clientId || BUILT_IN_CLIENT_ID).trim();
  if (clientId && !/^\d{17,20}$/.test(clientId)) throw new Error('Paste the 17–20 digit Discord Application ID. No token needed.');
  const savedImage = String(input.image || HOURGLASS_URL).trim();
  // Refresh only this app's built-in art; keep custom image URLs and asset keys.
  const image = /^https:\/\/raw\.githubusercontent\.com\/findastra\/countdown-discord-presence\/main\/public\/hourglass-card-\d{8}\.png(?:\?v=\d+)?$/.test(savedImage) ? HOURGLASS_URL : savedImage;
  if (!/^[a-z0-9_-]{1,128}$/.test(image) && !/^https:\/\/[^\s"<>]{1,240}$/.test(image)) throw new Error('Use an uploaded asset key or an https image link.');
  let targetAt = input.targetAt ?? null;
  if (targetAt !== null) {
    targetAt = Number(targetAt);
    // Seconds since 1970; from the year 2000 to 2200.
    if (!Number.isInteger(targetAt) || targetAt < 946684800 || targetAt > 7258118400) throw new Error('Choose a date and time for the countdown.');
  }
  const title = clean(input.title ?? DEFAULTS.title, 64);
  const event = clean(input.event ?? DEFAULTS.event, 100);
  if (title.length < 2) throw new Error('Give the card a title of at least 2 letters.');
  if (!event) throw new Error('Say what you are counting down to.');
  const celebrateHours = input.celebrateHours === undefined ? DEFAULTS.celebrateHours : Number(input.celebrateHours);
  if (!Number.isInteger(celebrateHours) || celebrateHours < 0 || celebrateHours > 168) throw new Error('Celebrate for 0 to 168 hours.');
  return { clientId, image, title, event, targetAt, showDate: input.showDate !== false, celebrateHours,
    automaticOnStart: input.automaticOnStart !== false };
}
