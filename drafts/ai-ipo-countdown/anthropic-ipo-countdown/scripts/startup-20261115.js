import { setStartup } from '../src/windows-startup-20261115.js';
const enabled = !process.argv.includes('--remove');
setStartup(enabled);
console.log(enabled
  ? 'Anthropic IPO Countdown will start quietly at Windows sign-in. Keep this app folder in place.'
  : 'Anthropic IPO Countdown will no longer start at Windows sign-in.');
