const which = new URLSearchParams(location.search).get('tool');
document.getElementById('name').textContent = which === 'seven' ? 'Tool seven' : which === 'six' ? 'Tool six' : 'Example tool';
const said = document.getElementById('said');
for (const b of document.querySelectorAll('button')) b.addEventListener('click', () => {
  const on = b.getAttribute('aria-pressed') !== 'true';
  b.setAttribute('aria-pressed', String(on));
  said.textContent = b.textContent + (on ? ' is lit.' : ' is off.');
});
