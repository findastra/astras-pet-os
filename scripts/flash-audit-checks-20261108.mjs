// The Flash Audit on The Farm (Astra, 2026-11-08: "I think the flash audit needs to be a panel on the farm so that each
// of those shows up as a tool and I can click it and it will go through all of whatever we have right now and all the
// other pet programs and check to see if those components of those other programs are up to standard"; deck "The
// Farm: art and lights", "All recommended": a tool box in The Farm's L1, the last results at once and Run through a
// helper on her PC, and The Farm owns it while GitHub Goldfish keeps the checks about words on GitHub).
// What the page needs to know about the checks: which ones the auditor runs by itself, which are Goldfish's, and where
// the last run's results are. Node's built-in modules only. Claude Opus 5.5 (claude-opus-5-5), 2026-11-08.
import { existsSync, readdirSync, readFileSync } from 'node:fs';

export const LABEL = 'the-farm-v1.0-flash-audit-v1.0';
export const AUDITOR = 'scripts/idle-flash-audit-20261017.mjs';
export const HELPER = 'scripts/flash-audit-helper-20261108.mjs';
// Where the helper on Astra's PC answers (the page asks it to run the audit again) and where it writes the newest run:
// Documents\Astra's PetOS Data\astras-pet-os\flash-audit, two folders above the farm, as the other helpers do.
export const HELPER_PORT = 38778;
export const DATA_FOLDER = ['astras-pet-os', 'flash-audit'];
export const PAGE_DATA = 'flash-audit-page-data.js';
// The helper writes where it answers into this file when it starts, so no committed file names a local address (the
// hub's public-safety rule): the page reads it from Astra's PC, the way the program lights read the watch's.
export const HELPER_PAGE_DATA = 'flash-audit-helper-page-data.js';

// The checks the auditor runs by itself over every pet program (the test reads them back from the auditor's code).
// The page checks are compared with the Model Pet Program at every build instead (scripts/flash-template-20261112.mjs,
// 2026-11-12), and every other check is done by an assistant during a Flash Audit, so its pill says so.
export const AUTOMATED = ['A01', 'A02', 'A05', 'A06', 'A07', 'A09', 'A10', 'A13', 'A14', 'A15', 'A16', 'A17', 'A18', 'A26', 'A31',
  'A54', 'A55', 'A56'];
// The rows of Goldfish's preflight the auditor leaves out: the ones it marks Not verified on every pet whatever it
// finds, and the ones that look in a pet's own app for page markers the pages no longer use (A41 the old Clicker
// Training section, A44 the shared phone on every page, A45 the old stationery, A52 the L3 activity bubble, replaced
// 2026-11-03; 83 findings each on 2026-11-08). Until 2026-11-12 the first ones were counted as the auditor's, so The
// Farm said "all pass" for checks nobody had run.
export const PREFLIGHT_LEFT_OUT = ['A19', 'A20', 'A21', 'A22', 'A25', 'A26', 'A27', 'A28', 'A29', 'A30', 'A32', 'A39', 'A41', 'A43', 'A44',
  'A45', 'A46', 'A47', 'A48', 'A49', 'A50', 'A51', 'A52'];
// GitHub Goldfish keeps the checks about words on GitHub (answer 5): the README and its credit, status and link labels,
// and current names only. They stay in The Farm's tool box, marked as Goldfish's.
export const GOLDFISH_WORDS = ['A15', 'A31', 'A57'];
// What a finding says, in the matrix's words (docs/flash-audit-20261014.md, section 2: Missing, Incorrect, Not verified).
export const STATUSES = ['Missing', 'Incorrect', 'Not verified', 'On a branch'];

/** The newest saved run: docs/flash-audit-rounds-<date>/ledger-main.json, the newest date first. { date, pets } or null. */
export function latestLedger(root = '.') {
  const dir = `${root}/docs`;
  if (!existsSync(dir)) return null;
  const rounds = readdirSync(dir).filter((n) => /^flash-audit-rounds-\d{8}$/.test(n) && existsSync(`${dir}/${n}/ledger-main.json`)).sort();
  const last = rounds.pop();
  if (!last) return null;
  return { date: last.slice(-8), pets: JSON.parse(readFileSync(`${dir}/${last}/ledger-main.json`, 'utf8')) };
}

/** One check over every pet program in a ledger: the pets audited, and each finding with its pet. */
export function checkResults(ledger, id) {
  const audited = (ledger?.pets || []).filter((p) => p.audited);
  const findings = audited.flatMap((p) => (p.rows || []).filter((r) => r.check === id && r.status !== 'Pass')
    .map((r) => ({ pet: p.icon, program: p.program, repo: p.repo, status: r.status, detail: r.detail || '' })));
  const counts = Object.fromEntries(STATUSES.map((s) => [s, findings.filter((f) => f.status === s).length]));
  const failing = new Set(findings.map((f) => f.repo));
  return { audited: audited.length, passing: audited.filter((p) => !failing.has(p.repo)).length, findings, counts };
}
