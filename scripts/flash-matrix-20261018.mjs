// The Flash Audit matrix, read from docs/flash-audit-20261014.md itself: every check's priority order, its name and
// its dot (Astra, 2026-10-18). ⚪ grey: the Idle Flash Audit checks it and fixes it without Astra. 🔵 blue: it is
// checked, and the answer waits for an Active Flash Session with her. The Idle Flash Audit tools read the order and the
// dots from here instead of keeping a second list, so a new row or a changed dot reaches them with no code change.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-18.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const GREY = '⚪';
export const BLUE = '🔵';
export const MATRIX_PATH = fileURLToPath(new URL('../docs/flash-audit-20261014.md', import.meta.url));

/** The section 3 matrix rows, most important first: [{ id, dot, title }]. A row without a dot is an error. */
export function parseMatrix(md) {
  const start = md.search(/^## 3\. /m);
  if (start < 0) throw new Error('Flash Audit matrix: no "## 3." section');
  const rest = md.slice(start + 1);
  const end = rest.search(/^## \d+\. /m);
  const rows = [];
  for (const line of (end < 0 ? rest : rest.slice(0, end)).split(/\r?\n/)) {
    const m = /^\|\s*(?:(⚪|🔵)️?\s*)?(A\d{2})\s*\|\s*([^|]*?)\s*\|/u.exec(line);
    if (!m) continue;
    if (!m[1]) throw new Error(`Flash Audit matrix: ${m[2]} has no grey (⚪) or blue (🔵) dot`);
    if (rows.some((r) => r.id === m[2])) throw new Error(`Flash Audit matrix: ${m[2]} is listed twice`);
    rows.push({ id: m[2], dot: m[1], title: m[3] });
  }
  if (!rows.length) throw new Error('Flash Audit matrix: no rows found');
  return rows;
}

/** { rows, order, dot, title } from the matrix file (FLASH_MATRIX overrides the path). */
export function readMatrix(path = process.env.FLASH_MATRIX || MATRIX_PATH) {
  const rows = parseMatrix(readFileSync(path, 'utf8'));
  return {
    rows,
    order: rows.map((r) => r.id),
    dot: Object.fromEntries(rows.map((r) => [r.id, r.dot])),
    title: Object.fromEntries(rows.map((r) => [r.id, r.title])),
  };
}

// A finding takes its row's dot, unless the auditor marked it as one of the row's sentences that start with the
// other dot (section 3: "A sentence inside a row that starts with the other dot goes the other way"). A check the
// matrix does not know waits for Astra.
export const rowDot = (row, matrix) => row.dot || matrix.dot[row.check] || BLUE;

// Each decision on a round card answers one matrix row. Most take that row's dot; the ones marked here are that row's
// sentence of the other dot, quoted beside it.
export const DECISIONS = {
  'Pet name': { check: 'A06', dot: BLUE }, // A06: "🔵 A placeholder or a new name is Astra's"
  'Program name': { check: 'A07' },
  Job: { check: 'A16', dot: BLUE }, // A16: "🔵 A field the pet submitted itself (cage.submit) ... is a decision"
  Branches: { check: 'A17', dot: BLUE }, // idle-flash-audit doc: merges are hers, other assistants' branches included
  Visibility: { check: 'A13', dot: BLUE }, // A13: "🔵 Public or private is Astra's"
  Art: { check: 'A01' },
  Route: { check: 'A10', dot: BLUE }, // A10: "🔵 ... putting a program on a new public site (GitHub Pages) is hers"
  'Pet program': { check: 'A59', dot: BLUE }, // A59: "🔵 ... two pets on one program, is Astra's"
  Merge: { check: null, dot: BLUE }, // merging is hers to OK, in chat (AGENTS.md)
};
export function decisionDot(kind, matrix) {
  const d = DECISIONS[kind];
  return (d && (d.dot || matrix.dot[d.check])) || BLUE;
}
