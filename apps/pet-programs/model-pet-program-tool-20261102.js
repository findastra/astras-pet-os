const said = document.getElementById('said');
let runs = 0;
document.getElementById('run').addEventListener('click', () => {
  runs += 1;
  said.textContent = 'tool-six ran ' + runs + (runs === 1 ? ' time.' : ' times.');
});
let inTool = false;
try { inTool = window.self !== window.top; } catch (e) { inTool = true; }
if (inTool) {
  const tell = () => { try { window.parent.postMessage({ type: 'tool-panel-height', height: Math.ceil(document.body.getBoundingClientRect().height) }, '*'); } catch (e) { /* no page around it */ } };
  tell();
  window.addEventListener('load', tell);
  if (window.ResizeObserver) new ResizeObserver(tell).observe(document.body);
}
