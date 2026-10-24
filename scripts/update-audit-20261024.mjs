// The update audit: is a pet's GitHub-released program up to date on this PC? (Astra, 2026-10-24: "Please make sure
// they are up to date with whatever GitHub has and that is shown in their indicator lights if they are updated or not.
// no auto github updates. if it happens to be found on updater audit, make the light orange, then have L3 ask me if L4
// wants to approve update.")
//
//   node scripts/update-audit-20261024.mjs            check every program below and write the results to pets.json
//   node scripts/update-audit-20261024.mjs --dry-run  print the results only
//
// It only reads: the installed program's version on this PC and the newest release on GitHub. It never downloads or
// installs anything. A newer release makes the program's check `update` (its light orange) and puts an approval in the
// pet's L4 control panel; the update itself waits for Astra's yes (the update-audit trick, skills/update-audit).
// Programs from Steam are not here: Steam reports their updates to Inference Iguana's program-watch.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-24.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

// Each program: the pet whose page shows it, its light's key, its GitHub repo, and where to read the installed version
// (an .exe's product version, or a Windows uninstall entry's DisplayVersion). A program not found on this PC is
// `missing` (grey, not created).
export const AUDITED = [
  { pet: 'rift-rabbit', key: 'third-party:vr-pole-overlay', name: 'VR Pole Overlay', repo: 'lukis101/VRPoleOverlay', exe: 'C:\\Program Files\\VRPoleOverlay\\VRPoleOverlay.exe' },
  { pet: 'rift-rabbit', key: 'third-party:space-override', name: 'Space Override', repo: 'Nyabsi/OpenVR-SpaceOverride', uninstall: 'SpaceOverride' },
  { pet: 'rift-rabbit', key: 'third-party:space-sync', name: 'Space Sync', repo: 'shinyflvre/OpenVR-SpaceSync', uninstall: 'SpaceSync' },
];

/** The first x.y.z (or x.y) in a string, as numbers; null when there is none. */
export function versionOf(text) {
  const m = /(\d+)\.(\d+)(?:\.(\d+))?/.exec(String(text || ''));
  return m ? [Number(m[1]), Number(m[2]), Number(m[3] || 0)] : null;
}
/** -1, 0 or 1. */
export function compare(a, b) {
  for (let i = 0; i < 3; i++) if ((a[i] || 0) !== (b[i] || 0)) return (a[i] || 0) < (b[i] || 0) ? -1 : 1;
  return 0;
}
/** A release's version: its tag, or else the version in its first asset's name (VR Pole Overlay tags "main"). */
export function releaseVersion(release) {
  return versionOf(release.tag_name) || versionOf((release.assets || [])[0]?.name) || versionOf(release.name);
}
/** The audit's result for one program, from what it found. */
export function verdict(p, installed, release, on) {
  const where = `on GitHub (github.com/${p.repo})`;
  if (!installed) return { result: 'missing', note: `Not installed on this PC. Its newest release ${where} is ${release ? `v${releaseVersion(release).join('.')}` : 'unknown'}.`, on };
  if (!release) return { result: 'issues', note: `Installed (${installed.join('.')}), but its newest release ${where} could not be read.`, on };
  const latest = releaseVersion(release);
  if (!latest) return { result: 'issues', note: `Installed (${installed.join('.')}); its newest release ${where} has no version number to compare.`, on };
  return compare(installed, latest) < 0
    ? { result: 'update', note: `Installed ${installed.join('.')}; the newest release ${where} is ${latest.join('.')} (${String(release.published_at).slice(0, 10)}). Nothing is updated until you approve it in L4.`, on, latest: latest.join('.') }
    : { result: 'works', note: `Installed ${installed.join('.')}, the newest release ${where}.`, on };
}

function installedVersion(p) {
  const ps = (cmd) => execFileSync('powershell.exe', ['-NoProfile', '-Command', cmd], { encoding: 'utf8' }).trim();
  if (p.exe) return existsSync(p.exe) ? versionOf(ps(`(Get-Item -LiteralPath '${p.exe}').VersionInfo.ProductVersion`)) : null;
  const out = ps(`Get-ItemProperty 'HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*','HKLM:\\Software\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*','HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*' -ErrorAction SilentlyContinue | Where-Object { $_.DisplayName -match '${p.uninstall}' } | ForEach-Object { "$($_.DisplayName) $($_.DisplayVersion)" } | Select-Object -First 1`);
  return out ? versionOf(out) || [0, 0, 0] : null;
}
async function latestRelease(repo) {
  const r = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=5`, { headers: { accept: 'application/vnd.github+json', 'user-agent': 'astras-pet-os-update-audit' } });
  if (!r.ok) return null;
  return (await r.json()).find((x) => !x.prerelease && !x.draft) || null;
}

/** Writes each result into its pet's `checks` in pets.json, keeping the file's layout everywhere else. */
export function writeChecks(text, results) {
  const nl = text.includes('\r\n') ? '\r\n' : '\n';
  const data = JSON.parse(text);
  for (const { p, check } of results) {
    const pet = [...data.pets, ...(data.pipeline || [])].find((x) => x.repo === p.pet);
    if (!pet) throw new Error(`no pet ${p.pet}`);
    pet.checks = { ...(pet.checks || {}), [p.key]: check };
  }
  return JSON.stringify(data, null, 2).replace(/\n/g, nl) + nl;
}

if (process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('update-audit-20261024.mjs')) {
  const on = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Denver' });
  const results = [];
  for (const p of AUDITED) {
    const check = verdict(p, installedVersion(p), await latestRelease(p.repo), on);
    results.push({ p, check });
    console.log(`${p.name.padEnd(16)} ${check.result.padEnd(8)} ${check.note}`);
  }
  if (!process.argv.includes('--dry-run')) {
    const text = readFileSync('pets.json', 'utf8');
    writeFileSync('pets.json', writeChecks(text, results));
    console.log('Wrote the results to pets.json; run npm run build to show them on the pages.');
  }
}
