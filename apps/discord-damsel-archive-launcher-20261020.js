// By Astra. OpenAI Codex (GPT-6), 2026-10-20.
// The sibling repo is reachable only when this page is opened from a local checkout.
// No requests, credentials, archive data or persistence.
(() => {
  const open = document.getElementById('dm-archive-open');
  const note = document.getElementById('dm-archive-open-note');
  if (!open || !note || location.protocol !== 'file:') return;
  open.href = '../../../findastra-discord-presence/discord-damsel-archive-review-20261020.html';
  open.textContent = 'Open local archive review';
  note.textContent = 'Requires the archive viewer in the Damsel repository beside this hub. This link does not check whether it is installed. No files are loaded until you choose them in the viewer.';
})();
