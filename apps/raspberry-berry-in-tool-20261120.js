// Raspberry Berry's tool pages (the Pi touch display guide and the Pi pin map) inside their tool box on Raspberry Pi
// Maker's page: no background of their own, no scroll bar, and the box is told how tall the page is so it fits exactly
// (the page's 'tool-panel-height' message, as Bass & Biscuits' tools use). Opened on their own, nothing changes.
// Claude Opus 5.5 (claude-opus-5-5), 2026-11-20.
(function () {
  'use strict';
  var inTool = false;
  try { inTool = window.self !== window.top; } catch (e) { inTool = true; }
  if (!inTool) return;
  document.documentElement.classList.add('in-tool');
  function tell() {
    var h = Math.ceil(document.documentElement.scrollHeight);
    try { window.parent.postMessage({ type: 'tool-panel-height', height: h }, '*'); } catch (e) { /* no page around it */ }
  }
  window.addEventListener('load', tell);
  document.addEventListener('DOMContentLoaded', function () {
    tell();
    if (window.ResizeObserver) new ResizeObserver(tell).observe(document.body);
  });
})();
