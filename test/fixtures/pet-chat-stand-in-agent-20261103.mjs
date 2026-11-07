// A stand-in for Claude Code or Codex in the pet chat helper's test: it answers the sign-in check, writes what it was
// started with to a record file, changes one file in its folder, and prints the same kind of lines the real one does.
// node pet-chat-stand-in-agent-20261103.mjs <claude|codex> <record file> [the agent's own arguments...]
// Claude Opus 5.5 (claude-opus-5-5), 2026-11-03.
import fs from 'node:fs';
import path from 'node:path';

const [kind, record, ...args] = process.argv.slice(2);
const words = args.join(' ');
if (words === 'auth status') { console.log(JSON.stringify({ loggedIn: true, authMethod: 'claude.ai' })); process.exit(0); }
if (words === 'login status') { console.error('Logged in using ChatGPT'); process.exit(0); }

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (c) => { input += c; });
process.stdin.on('end', async () => {
  const env = Object.keys(process.env).filter((k) => /^(CLAUDE|ANTHROPIC_|OPENAI_API_KEY)/i.test(k));
  fs.appendFileSync(record, JSON.stringify({ kind, args, input, cwd: process.cwd(), env }) + '\n');
  if (/be slow/.test(input)) await new Promise((r) => setTimeout(r, 60000));
  const name = /second/.test(input) ? 'chat-note-2.md' : 'chat-note.md';
  fs.writeFileSync(path.join(process.cwd(), name), `Written by the stand-in ${kind}: ${input.split('\n').at(-1)}\n`);
  const out = (o) => process.stdout.write(JSON.stringify(o) + '\n');
  if (kind === 'claude') {
    out({ type: 'system', subtype: 'init', session_id: 's-stand-in' });
    out({ type: 'stream_event', event: { type: 'content_block_start', content_block: { type: 'text' } } });
    out({ type: 'stream_event', event: { type: 'content_block_delta', delta: { type: 'text_delta', text: 'Hello, ' } } });
    out({ type: 'stream_event', event: { type: 'content_block_delta', delta: { type: 'text_delta', text: 'I am here. Ünïcode ✓' } } });
    out({ type: 'assistant', message: { content: [{ type: 'tool_use', name: 'Write', input: { file_path: path.join(process.cwd(), name) } }] } });
    out({ type: 'result', subtype: 'success', is_error: false, result: 'Hello, I am here.', session_id: 's-stand-in' });
  } else {
    out({ type: 'thread.started', thread_id: 't-stand-in' });
    out({ type: 'item.completed', item: { type: 'file_change', changes: [{ path: path.join(process.cwd(), name), kind: 'add' }] } });
    out({ type: 'item.completed', item: { type: 'agent_message', text: 'Codex here: done.' } });
    out({ type: 'turn.completed', usage: {} });
  }
});
