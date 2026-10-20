// Animal guard (Astra, 2026-10-13). Everything inside the agent harness is an ANIMAL, and an agent in the
// seat may only act on animals. Scripts that change a repo, push to it or write files for it call this first.
//
// Who is an animal: a pet listed in the registry (pets.json `pets` or `pipeline`) in this repo, the protected
// core. Nobody becomes an animal by saying so: a repo's own pet.json, a `pet-app` topic or a new repo never makes
// it one. New pets wait at the gate in `candidates` until Astra merges a pull request that moves them in.
// That is how an animal cannot be created to break out of the harness.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-13.
//
// Whose farm, whose pet (Astra, 2026-10-20: every farm's own pets, docs/farm-owner-and-single-pets-20261019.md).
// pets.json `github_owner` names the farm owner's GitHub account, and a pet entry may name its own account (an example
// pet that stays Astra's on someone else's farm); without one, a pet is on the farm owner's account. Both live in the
// core, so they change only by a pull request that farm's L4 merges: nobody becomes the owner by saying so either.
// The signed-in account only has to agree with them (assertSignedInAsOwner); it never decides who the owner is.
import { relative, resolve, isAbsolute } from 'node:path';

export const GITHUB_OWNER = 'findastra'; // Astra's account: the farm owner when pets.json names none (an older copy)

// GitHub's rules: an account is 1 to 39 letters, digits or single hyphens, not starting or ending with one; a repo name
// is letters, digits, ".", "_" and "-". A repo is "name" or "owner/name", nothing more (Codex's check, 2026-10-14).
const ACCOUNT = /^[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}$/;
const ADDRESS = /^(?:[A-Za-z0-9-]+\/)?[A-Za-z0-9_.-]+$/;

/** True when `a` and `b` name the same GitHub account: GitHub ignores letter case in account names. */
export const sameAccount = (a, b) => typeof a === 'string' && typeof b === 'string' && a !== '' && a.toLowerCase() === b.toLowerCase();

function account(name, where) {
  if (typeof name !== 'string' || !ACCOUNT.test(name)) throw new Error(`Animal guard: ${where} "${name}" is not a GitHub account name.`);
  return name;
}

/** The farm owner's GitHub account: `github_owner` in pets.json. */
export function farmOwner(registry) {
  return account(registry.github_owner ?? GITHUB_OWNER, 'pets.json github_owner');
}

/** The repos of every animal in the registry: registered and pipeline pets, plus the core itself. */
export function animalRepos(registry) {
  const repos = [...(registry.pets || []), ...(registry.pipeline || [])].map((p) => p.repo).filter(Boolean);
  if (registry.cage) repos.push(registry.cage);
  return new Set(repos);
}

/** The GitHub account an animal lives on (its entry's own `github_owner`, else the farm owner's), or null. */
export function petOwner(registry, name) {
  const farm = farmOwner(registry);
  const entry = [...(registry.pets || []), ...(registry.pipeline || [])].find((p) => p.repo === name);
  if (entry) return entry.github_owner === undefined ? farm : account(entry.github_owner, `the github_owner of ${name}`);
  return name && name === registry.cage ? farm : null;
}

/** True when `repo` (a name like "file-master", or "findastra/file-master") is an animal on its own account. */
export function isAnimal(registry, repo) {
  if (typeof repo !== 'string' || !ADDRESS.test(repo)) return false;
  const [owner, name] = repo.includes('/') ? repo.split('/') : [null, repo];
  const home = petOwner(registry, name);
  if (!home) return false;
  return owner === null || sameAccount(owner, home); // other people's repos are never animals on this farm
}

/** Throws unless `repo` is an animal. Use before any script pushes, tags, releases or writes for a repo. */
export function assertAnimal(registry, repo, action = 'act on') {
  if (!isAnimal(registry, repo)) throw new Error(`Animal guard: refusing to ${action} "${repo}". Only animals (pets in pets.json) can be controlled; a new pet waits in candidates until Astra approves it.`);
  return true;
}

/** Throws unless the animal `name` is on the farm owner's own account: a farm changes only its own pets on GitHub. */
export function assertOwnPet(registry, name, action = 'change') {
  assertAnimal(registry, name, action);
  const home = petOwner(registry, name);
  const farm = farmOwner(registry);
  if (!sameAccount(home, farm)) throw new Error(`Animal guard: refusing to ${action} "${name}": it is ${home}'s pet, not ${farm}'s, so only ${home} changes it on GitHub. Make your own private copy instead: pet-privatizer copy ${home}/${name} <new-name> --yes`);
  return true;
}

/** Throws unless `login` (the account signed in to GitHub) is the farm owner pets.json names. */
export function assertSignedInAsOwner(registry, login) {
  const farm = farmOwner(registry);
  if (!login) throw new Error(`You are not signed in to GitHub. Sign in as ${farm}, this farm's owner: gh auth login`);
  if (!sameAccount(login, farm)) throw new Error(`This farm's pets.json says its GitHub owner is ${farm}, but you are signed in to GitHub as ${login}. Sign in as ${farm} (gh auth switch), or, if this is your own farm, change "github_owner" in its pets.json with a pull request.`);
  return true;
}

/** Throws unless `target` stays inside `root` (no "..", no other drive). Use before writing a file for an animal. */
export function assertInside(root, target) {
  const rel = relative(resolve(root), resolve(root, target));
  if (rel === '' || (!rel.startsWith('..') && !isAbsolute(rel))) return true;
  throw new Error(`Animal guard: "${target}" is outside "${root}". An animal only writes inside its own folder.`);
}
