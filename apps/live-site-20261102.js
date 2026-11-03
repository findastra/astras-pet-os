// Marks the live site, so a pet program page shows its editorial status panel only on a working copy (Astra,
// 2026-11-02: "the editorial status panel on the one we're working on, but we don't have it on the live one... That
// way I know if I'm looking at the most recent push or if I'm looking at the one I'm working on"). The live site is
// the published GitHub Pages copy, any <owner>.github.io address. Loaded first in <head>, before anything is drawn, so
// the panel never flashes there. Claude Opus 5.5 (claude-opus-5-5), 2026-11-02.
if (/\.github\.io$/i.test(location.hostname)) document.documentElement.classList.add('live-site');
