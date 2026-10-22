// The six social-row styles for Astra's profile README, drawn as previews on Portfolio Puffer's pet program page.
// Astra, 2026-10-22: "can we see all these on the portfolio puffer pet program?" (the "Profile Social Row" canvas).
// The README itself is changed by GitHub Goldfish's social-row tool (github-goldfish/scripts/social-row-20261017.mjs,
// `--style N`); this file only shows the styles. Every color is a gradient (Astra, 2026-10-17).
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-22.

// The live style on findastra/findastra (the goldfish:social-row block). Change it here when the README changes.
export const LIVE_STYLE = 5;
export const TOOL = 'github-aquarium-v1.0-social-row-v1.0';
export const GOLDFISH_SCRIPT = 'https://github.com/findastra/github-goldfish/blob/main/scripts/social-row-20261017.mjs';
// Built as README pictures so far (the Goldfish tool refuses the rest with "not built yet").
export const BUILT = [5];

export const LINKS = [
  { label: "Mommy's Discord", handle: 'Join MMY', icon: 'discord', url: 'https://discord.gg/YJUHtGGrJe' },
  { label: 'VR TikTok', handle: '@findastra', icon: 'tiktok', url: 'https://www.tiktok.com/@findastra' },
  { label: 'Pole Dance TikTok', handle: '@astra_on_fire', icon: 'tiktok', url: 'https://www.tiktok.com/@astra_on_fire' },
  { label: 'VRChat Instagram', handle: '@astra_on_fire', icon: 'instagram', url: 'https://www.instagram.com/astra_on_fire' },
];

const ICONS = {
  discord: 'M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z',
  tiktok: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
  instagram: 'M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077',
};

// The six styles of the canvas, each link a gradient [from, to].
export const STYLES = [
  { n: 1, name: 'Sunset sweep', about: 'your current colors flowing pink → red → orange → yellow; labels without handles', layout: 'row', sep: '·', icons: true, text: 'label', grads: [['#ff2d7a', '#ff3b4f'], ['#ff3b4f', '#ff6a2b'], ['#ff6a2b', '#ffb21f'], ['#ffb21f', '#fff01f']] },
  { n: 2, name: 'Handles only', about: 'each icon with just its handle, in your current hues', layout: 'row', icons: true, text: 'handle', grads: [['#ff2d7a', '#ff2b2b'], ['#ff2b2b', '#ff8c1a'], ['#ff8c1a', '#fff01f'], ['#fff01f', '#ff2d7a']] },
  { n: 3, name: 'Sparkle line', about: 'no icons; ✧ ˚+. .× sparkles like your header, cool pink → lavender → blue → mint', layout: 'row', sparkles: ['✧', '˚+.', '✧', '.×', '✧'], icons: false, text: 'label', grads: [['#ff7ad9', '#c9a7ff'], ['#c9a7ff', '#8fa8ff'], ['#8fa8ff', '#5fd4ff'], ['#5fd4ff', '#6dffc8']] },
  { n: 4, name: 'Neon pills', about: 'rounded capsules with gradient outlines, iridescent cyan → violet → magenta → gold', layout: 'pill', icons: true, text: 'label', grads: [['#3ef0ff', '#7f7bff'], ['#7f7bff', '#d05bff'], ['#d05bff', '#ff4fa3'], ['#ff4fa3', '#ffd54f']] },
  { n: 5, name: 'Icon stack', about: 'a bigger icon above each label, lime → teal → sky → violet → pink', layout: 'stack', icons: true, text: 'label', grads: [['#b8ff4a', '#3ff0c2'], ['#3ff0c2', '#4fb3ff'], ['#4fb3ff', '#c77dff'], ['#c77dff', '#ff6ad5']] },
  { n: 6, name: 'Full spectrum', about: 'each link its own glowing hue: rose, amber, lime, sky', layout: 'row', glow: true, icons: true, text: 'label', grads: [['#ff5c8a', '#ff9a5c'], ['#ffb03b', '#e8ff5c'], ['#8dff6a', '#4dffd2'], ['#5cc8ff', '#a98bff']] },
];

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const textGrad = ([a, b]) => `background:linear-gradient(90deg,${a},${b});-webkit-background-clip:text;background-clip:text;color:transparent`;

function icon(style, i, size) {
  const id = `sr${style.n}-${i}`;
  const [a, b] = style.grads[i];
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><defs><linearGradient id="${id}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><path d="${ICONS[LINKS[i].icon]}" fill="url(#${id})"/></svg>`;
}

/** One style's row, the way it would sit on the profile (GitHub's dark column). */
export function previewRow(style) {
  const cells = LINKS.map((l, i) => {
    const words = `<span style="${textGrad(style.grads[i])}">${esc(style.text === 'handle' ? l.handle : l.label)}</span>`;
    const title = esc(`${l.label}: ${l.handle}`);
    if (style.layout === 'stack') return `<a class="sr-link sr-stack" href="${esc(l.url)}" title="${title}">${icon(style, i, 26)}${words}</a>`;
    if (style.layout === 'pill') return `<a class="sr-link sr-pill" href="${esc(l.url)}" title="${title}" style="background:linear-gradient(#0d1117,#0d1117) padding-box,linear-gradient(90deg,${style.grads[i][0]},${style.grads[i][1]}) border-box">${icon(style, i, 16)}${words}</a>`;
    const glow = style.glow ? ` style="filter:drop-shadow(0 0 6px ${style.grads[i][0]}88)"` : '';
    return `<a class="sr-link" href="${esc(l.url)}" title="${title}"${glow}>${style.icons ? icon(style, i, 18) : ''}${words}</a>`;
  });
  let row;
  if (style.sparkles) row = style.sparkles.map((s, k) => `<span class="sr-sep" aria-hidden="true" style="${textGrad(style.grads[Math.min(k, 3)])}">${s}</span>${cells[k] || ''}`).join('');
  else if (style.sep) row = cells.join(`<span class="sr-sep" aria-hidden="true">${style.sep}</span>`);
  else row = cells.join('');
  return `<div class="sr-preview"><div class="sr-row${style.layout === 'stack' ? ' sr-row-stack' : ''}">${row}</div></div>`;
}

export const CSS = `.sr-list{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:minmax(0,1fr);gap:14px}.sr-item{min-width:0;border:1px solid var(--line,#e5dde1);border-radius:14px;padding:12px 14px}.sr-item.live{border-color:#3ff0c2;box-shadow:0 0 0 2px #3ff0c233}.sr-head{display:flex;flex-wrap:wrap;align-items:baseline;gap:6px 10px;margin:0 0 8px}.sr-head h3{margin:0;font-size:15px}.sr-badge{font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;border-radius:999px;padding:2px 8px;background:#e9f9f4;color:#0b5c48}.sr-badge.off{background:#f1ecef;color:#6c5866}.sr-preview{background:#0d1117;border-radius:10px;padding:14px 10px;overflow-x:auto}.sr-row{display:flex;justify-content:center;align-items:center;gap:14px;white-space:nowrap;min-width:max-content;margin:auto;font:15px/1.3 -apple-system,'Segoe UI',Helvetica,sans-serif}.sr-row-stack{align-items:flex-start;gap:34px;font-size:13px}.sr-link{display:inline-flex;align-items:center;gap:6px;text-decoration:none}.sr-link:hover{text-decoration:underline;text-decoration-color:#8b949e}.sr-stack{flex-direction:column;gap:5px}.sr-pill{border:1.5px solid transparent;border-radius:999px;padding:5px 12px;font-size:14px}.sr-sep{color:#6e7681}`;

/** The Social Row tool panel's body: every style, the live one marked, and how to switch. */
export function socialRowBody() {
  const items = STYLES.map((s) => {
    const live = s.n === LIVE_STYLE;
    const state = live ? '<span class="sr-badge">on your profile</span>' : `<span class="sr-badge off">${BUILT.includes(s.n) ? 'ready' : 'preview only'}</span>`;
    return `<li class="sr-item${live ? ' live' : ''}"><div class="sr-head"><h3>${s.n} · ${esc(s.name)}</h3>${state}<span class="small">${esc(s.about)}</span></div>${previewRow(s)}</li>`;
  }).join('');
  return `<style>${CSS}</style><p class="small">The social links at the top of your GitHub profile, in each style you picked (every color a gradient). Style ${LIVE_STYLE} is on your profile now.</p><ol class="sr-list">${items}</ol>
<details class="about"><summary>More details</summary><p class="small">GitHub Goldfish's social-row tool (<code>${TOOL}</code>, <a href="${GOLDFISH_SCRIPT}">social-row-20261017.mjs</a>) changes the README: it draws one picture per link in the chosen style and rewrites only the social-row block. Style ${BUILT.join(', ')} can go on the profile today; the others are previews here until the tool draws them, then a switch on this panel turns one on.</p></details>`;
}
