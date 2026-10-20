// Whose farm, whose pet (Astra, 2026-10-20; docs/farm-owner-and-single-pets-20261019.md): pets.json names the farm
// owner's GitHub account and a pet may name its own, the animal guard reads both, a farm changes only its own pets, and
// the signed-in account must agree. On Astra's farm everything is as it was. Claude Opus 5.5 (claude-opus-5-5).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { GITHUB_OWNER, farmOwner, petOwner, isAnimal, assertAnimal, assertOwnPet, assertSignedInAsOwner, sameAccount, animalRepos } from '../scripts/animal-guard-20261013.mjs';

const astra = JSON.parse(readFileSync(new URL('../pets.json', import.meta.url), 'utf8'));
// Dev's farm, as it will look: her hub copy and her own pet on her account, two of Astra's example pets kept as hers.
const dev = {
  cage: 'devs-pet-os', github_owner: 'XxdevilishxX',
  pets: [{ repo: 'devs-pet-os', role: 'host' }, { repo: 'meme-fiend', github_owner: 'findastra' }, { repo: 'dev-diary' }],
  pipeline: [{ repo: 'api-fairy', github_owner: 'findastra' }],
  candidates: [{ repo: 'new-newt' }],
};

test("Astra's farm names her account, and no pet needs an account of its own", () => {
  assert.equal(astra.github_owner, 'findastra');
  assert.equal(farmOwner(astra), 'findastra');
  for (const p of [...astra.pets, ...astra.pipeline]) assert.ok(!('github_owner' in p), `${p.repo} is on the farm owner's account`);
  for (const r of animalRepos(astra)) assert.equal(petOwner(astra, r), 'findastra');
  assert.equal(farmOwner({ ...astra, github_owner: undefined }), GITHUB_OWNER, 'an older copy without the field is still Astra\'s farm');
  assert.equal(petOwner(astra, 'piranesi-house'), null, 'a candidate has no home on the farm');
});

test("on another farm, its own pets are on its account and the examples stay Astra's", () => {
  assert.equal(farmOwner(dev), 'XxdevilishxX');
  assert.ok(isAnimal(dev, 'dev-diary') && isAnimal(dev, 'XxdevilishxX/dev-diary'));
  assert.ok(isAnimal(dev, 'xxdevilishxx/dev-diary'), 'GitHub ignores letter case in account names');
  assert.equal(isAnimal(dev, 'findastra/dev-diary'), false);
  assert.ok(isAnimal(dev, 'findastra/meme-fiend') && isAnimal(dev, 'meme-fiend') && isAnimal(dev, 'findastra/api-fairy'));
  assert.equal(isAnimal(dev, 'XxdevilishxX/meme-fiend'), false, 'the example is Astra\'s repo, not a repo of the same name on Dev\'s account');
  assert.equal(petOwner(dev, 'devs-pet-os'), 'XxdevilishxX', 'the hub copy is on the farm owner\'s account');
  assert.equal(isAnimal(dev, 'new-newt'), false, 'a candidate is still not an animal');
  assert.throws(() => assertAnimal(dev, 'someone/dev-diary', 'tag'), /Animal guard: refusing to tag/);
});

test('a malformed name is never an animal, and a malformed account stops the guard', () => {
  for (const bad of ['findastra/file-master/x', '../file-master', 'findastra/', '/file-master', ' file-master', 'find astra/file-master', '', null]) {
    assert.equal(isAnimal(astra, bad), false, JSON.stringify(bad));
  }
  assert.throws(() => farmOwner({ github_owner: '-findastra' }), /pets\.json github_owner "-findastra" is not a GitHub account name/);
  assert.throws(() => farmOwner({ github_owner: 'find astra' }), /not a GitHub account name/);
  assert.throws(() => isAnimal({ ...dev, pets: [{ repo: 'x', github_owner: 'a/b' }] }, 'x'), /the github_owner of x "a\/b" is not a GitHub account name/);
});

test('a farm changes only its own pets on GitHub; another account\'s pet gets a private copy instead', () => {
  assert.ok(assertOwnPet(dev, 'dev-diary') && assertOwnPet(dev, 'devs-pet-os'));
  assert.throws(() => assertOwnPet(dev, 'meme-fiend', 'make private'), /refusing to make private "meme-fiend": it is findastra's pet, not XxdevilishxX's, so only findastra changes it on GitHub\. Make your own private copy instead: pet-privatizer copy findastra\/meme-fiend <new-name> --yes/);
  assert.throws(() => assertOwnPet(dev, 'lunas-log'), /Animal guard: refusing/);
  assert.ok(assertOwnPet(astra, 'meme-fiend'), 'on Astra\'s farm every pet is hers');
});

test('the signed-in account must be the farm owner pets.json names, ignoring letter case', () => {
  assert.ok(assertSignedInAsOwner(astra, 'findastra') && assertSignedInAsOwner(astra, 'FindAstra'));
  assert.ok(assertSignedInAsOwner(dev, 'xxdevilishxx'));
  assert.throws(() => assertSignedInAsOwner(astra, 'XxdevilishxX'), /pets\.json says its GitHub owner is findastra, but you are signed in to GitHub as XxdevilishxX\. Sign in as findastra \(gh auth switch\), or, if this is your own farm, change "github_owner"/);
  assert.throws(() => assertSignedInAsOwner(dev, ''), /You are not signed in to GitHub\. Sign in as XxdevilishxX/);
  assert.ok(sameAccount('ABC', 'abc') && !sameAccount('abc', 'abd') && !sameAccount('', '') && !sameAccount(undefined, undefined));
});
