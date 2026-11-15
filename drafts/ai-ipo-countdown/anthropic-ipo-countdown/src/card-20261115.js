// What the Discord card says, and the settings that shape it.

// One edition per company. The OpenAI edition is a copy of this folder with its own EDITION, port and galaxy
// (README, "Adding a company").
export const EDITION = Object.freeze({
  app: 'anthropic-ipo-countdown',
  company: 'Anthropic',
  // Reported on 2026-11-15 (roadshow from 2026-11-10): ticker ANT on Nasdaq, priced on or about Wednesday
  // 18 November, first trade expected Thursday 19 November 2026. Not final: the page lets you change every one.
  ticker: 'ANT',
  exchange: 'Nasdaq',
  // 9:30am in New York (the opening bell), 19 November 2026 = 14:30 UTC.
  targetAt: 1795098600,
  // 5pm in New York, 18 November 2026 = 22:00 UTC: IPOs are usually priced after that day's close.
  pricingAt: 1795039200,
  // This app's control page, on this PC only (OpenAI's edition: 38768).
  port: 38767,
});

// The project's own Discord application. Not registered yet: until Astra registers one (a non-brand name, such as
// "IPO Countdown", which can serve every edition) and its ID is written here, the page asks for an Application ID once.
export const BUILT_IN_CLIENT_ID = '';

// Card art: Astra's approved gold five-arm galaxy (2026-10-30), the same GIF Anthropic Discord Presence shows. Discord
// loads it from findastra/ai-discord-presence, whose rules keep that address fixed.
export const GALAXY_URL = 'https://raw.githubusercontent.com/findastra/ai-discord-presence/main/anthropic-discord-presence/public/galaxy-card.gif?v=10';

const DAY = 86400;
const HOUR = 3600;

export function clean(value, max = 110) {
  return String(value ?? '').replace(/[\x00-\x1f\x7f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
}

// Whole calendar days in the PC's own time zone, so the night before reads "Tomorrow", never "0 days to go".
export function daysLeft(targetAt, now, timeZoneOffsetMinutes = new Date(now * 1000).getTimezoneOffset()) {
  const local = seconds => Math.floor((seconds - timeZoneOffsetMinutes * 60) / DAY);
  return local(targetAt) - local(now);
}

// "Thu, Nov 19" in English, in the PC's own time zone.
export function shortDate(seconds, offset = new Date(seconds * 1000).getTimezoneOffset()) {
  const d = new Date((seconds - offset * 60) * 1000);
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getUTCDay()];
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getUTCMonth()];
  return `${day}, ${month} ${d.getUTCDate()}`;
}

// Where the countdown stands: counting, trading (the first celebrateHours after the bell) or over.
export function phase(config, now) {
  if (!Number.isInteger(config.targetAt)) return 'unset';
  if (now < config.targetAt) return 'counting';
  return now < config.targetAt + config.celebrateHours * HOUR ? 'trading' : 'over';
}

// The second line: how far off it is, with the pricing day on the way.
export function countdownLine(config, now, offset) {
  const days = daysLeft(config.targetAt, now, offset);
  const pricing = Number.isInteger(config.pricingAt) && config.pricingAt < config.targetAt ? config.pricingAt : null;
  if (days <= 0) return 'Opening bell today';
  if (pricing !== null && daysLeft(pricing, now, offset) === 0) return now < pricing ? 'Pricing today' : 'Priced · trading tomorrow';
  if (days === 1) return 'Trading tomorrow';
  if (days < 7 * 8) return `${days} days to go`;
  return `${Math.floor(days / 7)} weeks to go`;
}

export class Presence {
  mode = 'off';
  setMode(mode) {
    if (!['off', 'manual'].includes(mode)) throw new Error('Choose Start or Stop.');
    this.mode = mode;
  }
}

// The card Discord shows.
// - Counting: "Anthropic IPO" / "Nasdaq: ANT · Thu, Nov 19" / "4 days to go". In the last 24 hours Discord draws the
//   live "5:12:33 left" from timestamps.end; further out it would read as hundreds of hours, so words count the days.
// - Trading: "Now trading on Nasdaq: ANT" / "It's here!", with Discord's elapsed timer counting from the opening bell.
export function activity(config, now = Math.floor(Date.now() / 1000), offset) {
  const where = phase(config, now);
  if (where === 'unset' || where === 'over') return null;
  const listing = `${config.exchange}: ${config.ticker}`;
  const date = shortDate(config.targetAt, offset);
  const card = {
    type: 0,
    // Card title. Discord shows this instead of the registered app name.
    name: config.title,
    assets: { large_image: config.image, large_text: `${config.title} · ${date}` },
  };
  if (where === 'trading') {
    card.details = `Now trading on ${listing}`;
    card.state = "It's here!";
    card.timestamps = { start: config.targetAt };
    return card;
  }
  card.details = config.showDate ? `${listing} · ${date}` : listing;
  card.state = countdownLine(config, now, offset);
  if (!config.showDate) card.assets.large_text = config.title;
  if (config.targetAt - now <= DAY) card.timestamps = { end: config.targetAt };
  return card;
}

const isTime = value => Number.isInteger(value) && value >= 946684800 && value <= 7258118400;
function time(value, fallback, message) {
  if (value === undefined) return fallback;
  if (value === null) return null;
  const number = Number(value);
  if (!isTime(number)) throw new Error(message);
  return number;
}

export function validateConfig(input = {}) {
  const clientId = String(input.clientId || BUILT_IN_CLIENT_ID).trim();
  if (clientId && !/^\d{17,20}$/.test(clientId)) throw new Error('Paste the 17–20 digit Discord Application ID. No token needed.');
  const savedImage = String(input.image || GALAXY_URL).trim();
  // Refresh only the built-in galaxy; keep custom image URLs and asset keys.
  const image = /^https:\/\/raw\.githubusercontent\.com\/findastra\/ai-discord-presence\/main\/anthropic-discord-presence\/public\/galaxy-card\.gif(?:\?v=\d+)?$/.test(savedImage) ? GALAXY_URL : savedImage;
  if (!/^[a-z0-9_-]{1,128}$/.test(image) && !/^https:\/\/[^\s"<>]{1,240}$/.test(image)) throw new Error('Use an uploaded asset key or an https image link.');
  // The first trade is required; only the pricing date can be left empty.
  const targetAt = time(input.targetAt === null ? 'none' : input.targetAt, EDITION.targetAt, 'Choose the date and time of the first trade.');
  const pricingAt = time(input.pricingAt, EDITION.pricingAt, 'Choose the pricing date and time, or leave it empty.');
  const title = clean(input.title ?? `${EDITION.company} IPO`, 64);
  if (title.length < 2) throw new Error('Give the card a title of at least 2 letters.');
  const ticker = clean(input.ticker ?? EDITION.ticker, 10).toUpperCase();
  if (!/^[A-Z][A-Z0-9.]{0,9}$/.test(ticker)) throw new Error('Use a ticker of letters and numbers, such as ANT.');
  const exchange = clean(input.exchange ?? EDITION.exchange, 24);
  if (exchange.length < 2) throw new Error('Name the exchange, such as Nasdaq.');
  const celebrateHours = input.celebrateHours === undefined ? 24 : Number(input.celebrateHours);
  if (!Number.isInteger(celebrateHours) || celebrateHours < 0 || celebrateHours > 168) throw new Error('Celebrate for 0 to 168 hours.');
  return { clientId, image, title, ticker, exchange, targetAt, pricingAt, showDate: input.showDate !== false,
    celebrateHours, automaticOnStart: input.automaticOnStart !== false };
}
