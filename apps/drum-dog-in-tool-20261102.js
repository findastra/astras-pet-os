// Bass & Biscuits' tool pages (the APC64 board, the drum kits, the lessons) inside their tool box on the pet program
// page: no background of their own, no scroll bar, and the box is told how tall the page is so it fits exactly (the
// page's 'tool-panel-height' message, as the Window Star uses). Opened on their own, nothing changes.
// Astra, 2026-11-02: "get rid of like the scroll bar on it"; "I think we should try our hardest to put it on the actual
// page". Claude Opus 5.5 (claude-opus-5-5).
(function () {
  'use strict';
  var inTool = false;
  try { inTool = window.self !== window.top; } catch (e) { inTool = true; }
  if (!inTool) return;
  document.documentElement.classList.add('in-tool');
  function tell() {
    // The content's own height: the whole page's scrollHeight never drops below the box's current height, so the box
    // could grow but never shrink back.
    var h = Math.ceil(document.body.getBoundingClientRect().bottom + window.scrollY);
    try { window.parent.postMessage({ type: 'tool-panel-height', height: h }, '*'); } catch (e) { /* no page around it */ }
  }
  window.addEventListener('load', tell);
  document.addEventListener('DOMContentLoaded', function () {
    tell();
    if (window.ResizeObserver) new ResizeObserver(tell).observe(document.body);
  });
})();
