const which = new URLSearchParams(location.search).get('tool');
document.getElementById('name').textContent = which === 'seven' ? 'tool-seven' : which === 'six' ? 'tool-six' : 'Example tool';
const said = document.getElementById('said');
for (const b of document.querySelectorAll('button')) b.addEventListener('click', () => {
  const on = b.getAttribute('aria-pressed') !== 'true';
  b.setAttribute('aria-pressed', String(on));
  said.textContent = b.textContent + (on ? ' is lit.' : ' is off.');
});
let inTool = false;
try { inTool = window.self !== window.top; } catch (e) { inTool = true; }
if (inTool) {
  const tell = () => { try { window.parent.postMessage({ type: 'tool-panel-height', height: Math.ceil(document.body.getBoundingClientRect().height) }, '*'); } catch (e) { /* no page around it */ } };
  tell();
  window.addEventListener('load', tell);
  if (window.ResizeObserver) new ResizeObserver(tell).observe(document.body);
}
