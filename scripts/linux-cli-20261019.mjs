// The astras-pet-os command (Astra, 2026-10-19): Astra's PetOS on Linux, installed by the Linux package as
// /usr/bin/astras-pet-os. A tool of The Farm. The release is read only in /usr/share/astras-pet-os; each person's
// farm is in their own home. Linux Penguin says which Linux this is and which of his tricks fits it. Pet services
// are an option: the package never turns one on, and `astras-pet-os stop` (the big red button) stops them all.
// Run `astras-pet-os help` for the commands. Claude Opus 5.5 (claude-opus-5-5), 2026-10-19.
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { RECEIPT, choosePets, farmPets, writeFarm } from './farm-setup-20261019.mjs';

export const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const VERSION = `v${JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).version}`;
const DATA = join(process.env.XDG_DATA_HOME || join(homedir(), '.local', 'share'), 'astras-pet-os');
const CONFIG = join(process.env.XDG_CONFIG_HOME || join(homedir(), '.config'), 'astras-pet-os');
export const FARM_DIR = join(DATA, 'farm');
const PETS_DIR = join(DATA, 'pets');
const PAGES = { map: 'system-map-20261012.html', desk: 'apps/astras-pet-apps-20261008.html' };
const PENGUIN = process.env.ASTRAS_PET_OS_PENGUIN_DIR || join(ROOT, 'pets', 'linux-iceberg');
const UNIT = (pet) => `astras-pet-os-pet@${pet}.service`;

/**
 * The pet programs that can run as a service of your own (a systemd user service), all off until you turn one on.
 * Each pet's code is its own repo, cloned by you into ~/.local/share/astras-pet-os/pets/<repo>: the package never
 * downloads code or packages for you.
 */
export const SERVICES = {
  'role-fairy': {
    pet: 'Role Fairy', repo: 'role-fairy', run: ['src/bot.js'], needs: ['config.json', 'node_modules'], env: ['DISCORD_BOT_TOKEN'],
    steps: [
      'git clone https://github.com/findastra/role-fairy.git "{dir}"',
      'cd "{dir}" && pnpm install --frozen-lockfile --prod   (her packages, from her lockfile)',
      'cp config.example.json config.json, then put in your server and channel IDs (her README says how)',
      'put DISCORD_BOT_TOKEN=... in {env} (only you can read it: chmod 600), then run setup once: node src/bot.js --setup',
    ],
    warning: 'Run each Discord bot on one computer only. If Role Fairy already runs somewhere else, leave her off here.',
  },
  'chat-rat': {
    pet: 'Chat Rat', repo: 'chat-rat', run: ['chat-rat-20261016.mjs', 'serve'], needs: [], env: [],
    steps: ['git clone https://github.com/findastra/chat-rat.git "{dir}"'],
    warning: 'Chat Rat listens on this computer only. His "open folder" button opens folders on Linux once his change (findastra/chat-rat#9) is merged; saving and searching chats work already.',
  },
};

const say = (line = '') => process.stdout.write(`${line}\n`);
const fail = (message) => { process.stderr.write(`${message}\n`); process.exitCode = 1; };
const has = (program) => spawnSync('sh', ['-c', `command -v ${program}`], { stdio: 'ignore' }).status === 0;

function osRelease() {
  for (const file of ['/etc/os-release', '/usr/lib/os-release']) {
    if (!existsSync(file)) continue;
    const fields = {};
    for (const line of readFileSync(file, 'utf8').split('\n')) {
      const m = /^([A-Z_]+)=(.*)$/.exec(line.trim());
      if (m) fields[m[1]] = m[2].replace(/^(["'])(.*)\1$/, '$2');
    }
    return fields;
  }
  return {};
}

/** Linux Penguin's line: which Linux this is (from his tool, the one place that decides it) and his trick for it. */
export function penguinSays() {
  const tool = join(PENGUIN, 'tools', 'linux-check-20261019.sh');
  if (!existsSync(tool)) return 'Linux Penguin is not in this install.';
  if (process.platform !== 'linux') return `Linux Penguin looks after Linux computers; this one runs ${process.platform}.`;
  const ask = (flag) => (spawnSync('bash', [tool, flag], { encoding: 'utf8' }).stdout || '').trim();
  const family = ask('--family');
  const trick = ask('--trick');
  const name = osRelease().PRETTY_NAME || 'this Linux';
  const families = { debian: 'Debian family', fedora: 'Fedora family', arch: 'Arch family', suse: 'SUSE family', alpine: 'Alpine' };
  const kin = families[family] || 'a family I do not know yet';
  if (!trick) return `Linux Penguin: this is ${name}, ${kin}. I have no trick for it yet; "astras-pet-os penguin" still checks it.`;
  return [
    `Linux Penguin: this is ${name}, ${kin}. My trick for it is ${trick}:`,
    `  ${join(PENGUIN, 'skills', `${family}-family`, 'SKILL.md')}`,
    '  Ask your AI to follow it, or run "astras-pet-os penguin" for my check of this computer.',
  ].join('\n');
}

function open(page) {
  const file = join(ROOT, PAGES[page]);
  if (process.platform === 'linux' && has('xdg-open')) {
    spawn('xdg-open', [file], { detached: true, stdio: 'ignore' }).unref();
    say(`Opening ${file}`);
  } else {
    say(`Open this page in your browser: ${file}`);
  }
}

function listPets() {
  const pets = farmPets(ROOT);
  const width = Math.max(...pets.map((p) => p.id.length));
  say(`${'id'.padEnd(width)}  kind              pet`);
  for (const p of pets) {
    const kind = p.core ? 'core (always on)' : p.draft ? 'example (draft)' : 'example';
    say(`${p.id.padEnd(width)}  ${kind.padEnd(16)}  ${p.name}${p.job ? ` -- ${p.job.length > 90 ? `${p.job.slice(0, 87)}...` : p.job}` : ''}`);
  }
}

async function setup(options) {
  let { farm, pets = [] } = options;
  if (!farm) {
    if (!process.stdin.isTTY) return fail('Choose a farm: astras-pet-os setup --farm example, or --farm scratch [--pets goldfish,api-fairy].');
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    say('Set up your farm');
    say("  1. Set up Your Farm with Astra's Example Pets: all of them. You can delete, modify, or clone any of them.");
    say("  2. Set up Your Farm From Scratch: just the core pets (the Friendly Farmer), plus any of Astra's pets you pick.");
    const answer = (await rl.question('Which one? [1/2] ')).trim();
    farm = answer === '2' ? 'scratch' : answer === '1' || answer === '' ? 'example' : null;
    if (farm === 'scratch') {
      listPets();
      pets = [(await rl.question('Pets to bring along (ids, separated by commas; Enter for none): ')).trim()];
    }
    rl.close();
    if (!farm) return fail('Nothing was set up: answer 1 or 2.');
  }
  const choice = choosePets(farmPets(ROOT), { farm, pets });
  const linux = process.platform === 'linux' ? { linux: { name: osRelease().PRETTY_NAME || '', id: osRelease().ID || '' } } : {};
  writeFarm(ROOT, FARM_DIR, choice, { version: VERSION, extra: linux });
  const name = (repo) => choice.onFarm.find((p) => p.repo === repo)?.name || repo;
  for (const [id, by] of Object.entries(choice.neededBy)) say(`${choice.onFarm.find((p) => p.id === id).name} comes along: ${by.map(name).join(' and ')} ${by.length === 1 ? 'needs' : 'need'} it.`);
  const n = choice.onFarm.length;
  say(`Your farm is ready: ${n} ${n === 1 ? 'pet' : 'pets'} (${choice.onFarm.map((p) => p.name).join(', ')}).`);
  say(`It is in ${FARM_DIR}. Run setup again any time to change it.`);
  say('Open the System Map: astras-pet-os map');
  say();
  say(penguinSays());
}

function envFile(pet) { return join(CONFIG, 'pets', `${pet}.env`); }

function nodeTooOld(range) {
  const want = /(\d+)\.(\d+)(?:\.(\d+))?/.exec(range || '');
  if (!want) return false;
  const have = process.versions.node.split('.').map(Number);
  const need = [Number(want[1]), Number(want[2]), Number(want[3] || 0)];
  for (let i = 0; i < 3; i++) if (have[i] !== need[i]) return have[i] < need[i];
  return false;
}

/** What still stands between a pet and running as a service; an empty list means it can run. */
export function serviceProblems(pet) {
  const s = SERVICES[pet];
  const dir = join(PETS_DIR, s.repo);
  const env = envFile(pet);
  const fill = (step) => step.replaceAll('{dir}', dir).replaceAll('{env}', env);
  if (!existsSync(dir)) return [`${s.pet}'s program is not on this computer yet. To get it:`, ...s.steps.map((x) => `  ${fill(x)}`)];
  const problems = [];
  const pkg = join(dir, 'package.json');
  const engines = existsSync(pkg) ? JSON.parse(readFileSync(pkg, 'utf8')).engines?.node : '';
  if (nodeTooOld(engines)) problems.push(`${s.pet} asks for Node ${engines}; this computer has Node ${process.versions.node}.`);
  for (const need of s.needs) if (!existsSync(join(dir, need))) problems.push(`${s.pet} needs ${join(dir, need)}. ${s.steps.map(fill).join('; ')}`);
  if (s.env.length) {
    if (!existsSync(env)) problems.push(`${s.pet} needs ${s.env.join(', ')} in ${env} (chmod 600, so only you can read it).`);
    else {
      if (process.platform !== 'win32' && (statSync(env).mode & 0o077)) problems.push(`${env} can be read by others: chmod 600 "${env}"`);
      const body = readFileSync(env, 'utf8');
      for (const name of s.env) if (!new RegExp(`^${name}=.+`, 'm').test(body)) problems.push(`${env} has no ${name}= line.`);
    }
  }
  return problems;
}

function systemctl(...args) { return spawnSync('systemctl', ['--user', ...args], { encoding: 'utf8' }); }

function canRunServices() {
  if (process.platform !== 'linux' || !has('systemctl')) { fail('Pet services need Linux with systemd.'); return false; }
  return true;
}

function services() {
  say('Pet services: pet programs that can run on their own in the background. They are all off unless you turned one on.');
  for (const [id, s] of Object.entries(SERVICES)) {
    let state = 'off';
    if (process.platform === 'linux' && has('systemctl')) {
      const active = systemctl('is-active', UNIT(id)).stdout.trim();
      const enabled = systemctl('is-enabled', UNIT(id)).stdout.trim();
      state = active === 'active' ? `on (${enabled === 'enabled' ? 'starts when you log in' : 'until you log out'})` : enabled === 'enabled' ? 'turned on, not running' : 'off';
    }
    say(`  ${id.padEnd(12)} ${s.pet}: ${state}`);
  }
  say('Turn one on: astras-pet-os service on <pet>. Off: astras-pet-os service off <pet>. All off now: astras-pet-os stop');
}

async function service(action, pet) {
  if (!SERVICES[pet]) return fail(`There is no pet service called '${pet || ''}'. You can pick: ${Object.keys(SERVICES).join(', ')}`);
  const s = SERVICES[pet];
  if (action === 'run') return runService(pet); // what the systemd unit runs
  if (!canRunServices()) return;
  if (action === 'off') {
    const r = systemctl('disable', '--now', UNIT(pet));
    return r.status === 0 ? say(`${s.pet} is off.`) : fail(r.stderr.trim());
  }
  if (action !== 'on') return fail('Use: astras-pet-os service on <pet>, or service off <pet>.');
  const problems = serviceProblems(pet);
  if (problems.length) return fail([`${s.pet} was not turned on:`, ...problems].join('\n'));
  say(s.warning);
  const r = systemctl('enable', '--now', UNIT(pet));
  if (r.status !== 0) return fail(r.stderr.trim());
  say(`${s.pet} is on, and starts when you log in. Log: journalctl --user -u ${UNIT(pet)}`);
}

/** The pet's exit code for systemd. Stopped with SIGTERM or SIGINT (a normal stop) is success, so the unit is not marked failed. */
export function serviceExitCode(code, signal) {
  if (code !== null && code !== undefined) return code;
  return signal === 'SIGTERM' || signal === 'SIGINT' ? 0 : 1;
}

function runService(pet) {
  const s = SERVICES[pet];
  const problems = serviceProblems(pet);
  if (problems.length) return fail([`${s.pet} cannot start:`, ...problems].join('\n'));
  const child = spawn(process.execPath, s.run, { cwd: join(PETS_DIR, s.repo), stdio: 'inherit', env: process.env });
  for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => child.kill(signal));
  child.on('exit', (code, signal) => { process.exitCode = serviceExitCode(code, signal); });
}

function stop() {
  if (!canRunServices()) return;
  const r = systemctl('stop', 'astras-pet-os-pet@*.service');
  if (r.status !== 0) return fail(r.stderr.trim() || 'Could not stop the pet services.');
  say('Every pet service is stopped. Ones you turned on start again when you log in; turn them off with: astras-pet-os service off <pet>');
}

function penguin() {
  const tool = join(PENGUIN, 'tools', 'linux-check-20261019.sh');
  if (!existsSync(tool)) return fail('Linux Penguin is not in this install.');
  const r = spawnSync('bash', [tool], { stdio: 'inherit' });
  process.exitCode = r.status ?? 1;
}

function help() {
  say(`Astra's PetOS ${VERSION} on Linux (beta)`);
  say();
  say('  astras-pet-os setup            set up your farm: Astra\'s example pets, or from scratch');
  say('      --farm example | --farm scratch [--pets goldfish,api-fairy]   (no questions asked)');
  say('  astras-pet-os list-pets        the pets you can put on your farm');
  say('  astras-pet-os pets plan add <pet>       the Friendly Farmer adds one pet, with the pets it needs; then: pets add <pet> --yes');
  say('  astras-pet-os pets plan remove <pet>    ...or takes one away; also: pets check, pets lock (your farm lock)');
  say('  astras-pet-os map              open the System Map');
  say('  astras-pet-os desk             open the Friendly Farmer\'s desk');
  say('  astras-pet-os penguin          Linux Penguin\'s check of this computer (read only)');
  say('  astras-pet-os services         the pet services you can turn on (all off unless you turn them on)');
  say('  astras-pet-os service on|off <pet>');
  say('  astras-pet-os stop             the big red button: stop every pet service now');
  say('  astras-pet-os version');
  say();
  say(existsSync(join(FARM_DIR, RECEIPT)) ? `Your farm: ${FARM_DIR}` : 'Your farm is not set up yet: astras-pet-os setup');
  say();
  say(penguinSays());
}

/** The Friendly Farmer's farm-pets tool on this farm (scripts/farm-pets-20261021.mjs): its own words and options. */
function farmPetsTool(args) {
  if (!existsSync(join(FARM_DIR, RECEIPT))) return fail('Your farm is not set up yet: astras-pet-os setup');
  const r = spawnSync(process.execPath, [join(ROOT, 'scripts', 'farm-pets-20261021.mjs'), ...args, '--farm', FARM_DIR, '--catalog', ROOT],
    { stdio: 'inherit', env: { ...process.env, ASTRAS_PET_OS_FARM_PETS_COMMAND: 'astras-pet-os pets' } });
  process.exitCode = r.status ?? 1;
}

export async function main(argv) {
  if (argv[0] === 'pets') return farmPetsTool(argv.slice(1));
  const { values, positionals } = parseArgs({
    args: argv, allowPositionals: true, strict: true,
    options: { farm: { type: 'string' }, pets: { type: 'string', multiple: true }, help: { type: 'boolean', short: 'h' } },
  });
  const [command = 'help', ...rest] = positionals;
  if (values.help) return help();
  switch (command) {
    case 'help': return help();
    case 'version': return say(`astras-pet-os ${VERSION} (release in ${ROOT})`);
    case 'map': case 'desk': return open(command);
    case 'list-pets': return listPets();
    case 'setup': return setup(values);
    case 'penguin': return penguin();
    case 'services': return services();
    case 'service': return service(rest[0], rest[1]);
    case 'stop': return stop();
    default: return fail(`astras-pet-os has no command '${command}'. Run: astras-pet-os help`);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main(process.argv.slice(2)).catch((error) => fail(error.message));
}
