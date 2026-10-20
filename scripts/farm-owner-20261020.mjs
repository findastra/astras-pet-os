// Upstream and farm owner (Astra, 2026-10-20: "All recommended", Part 3 of docs/farm-owner-and-single-pets-20261019.md,
// card 058). The word findastra used to mean two things in the hub's scripts. On Astra's farm both are her account, so
// nobody noticed; on any other farm (first Dev's, XxdevilishxX) they are not:
//   upstream()   Astra's PetOS itself, where every farm comes from: its releases and the installer link, the pictures
//                (the one art source), the guide, the System Map and the pet program pages on its public site, its docs,
//                and Astra's official pets: findastra/astras-pet-os. The same on every farm.
//   farmOwner()  whose pets these are: pets.json `github_owner` (scripts/animal-guard-20261013.mjs).
// ownerOf() says which account one repo lives on: a pet's own `github_owner`, else the farm owner's; a candidate the
// round found is on the farm owner's account unless its entry says otherwise; and a repo this farm's pets.json does not
// list at all (a seed, a roadmap pet or a draft from Astra's PetOS's own lists) is upstream's.
// Astra-only tools (her profile round, the Flash Audit, the one-art-source check) keep findastra on purpose and say so.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-20.
import { assertAccount, farmOwner, petOwner, sameAccount } from './animal-guard-20261013.mjs';

export { farmOwner, petOwner, sameAccount };

export const INSTALLER_ASSET = 'astras-pet-os-installer.zip';

/** Astra's PetOS itself (upstream): where every farm's releases, pictures, guide and pages come from. */
export function upstream() {
  const owner = 'findastra', hub = 'astras-pet-os', url = `https://github.com/${owner}/${hub}`;
  return {
    owner, hub, repo: `${owner}/${hub}`, url,
    blob: `${url}/blob/main`, tree: `${url}/tree/main`,
    raw: `https://raw.githubusercontent.com/${owner}/${hub}/main`,
    pages: `https://${owner}.github.io/${hub}`,
    installer: `${url}/releases/latest/download/${INSTALLER_ASSET}`,
  };
}

/** The GitHub account the repo `repo` lives on, as this farm's pets.json says (see the top of this file). */
export function ownerOf(registry, repo) {
  const home = petOwner(registry, repo);
  if (home) return home;
  const waiting = (registry.candidates || []).find((c) => c.repo === repo);
  if (waiting) return waiting.github_owner === undefined ? farmOwner(registry) : assertAccount(waiting.github_owner, `the github_owner of ${repo}`);
  return upstream().owner;
}

/** "owner/repo" for a repo this farm knows. */
export const repoOf = (registry, repo) => `${ownerOf(registry, repo)}/${repo}`;

/** The repo's page on GitHub, on its own account. */
export const repoUrl = (registry, repo) => `https://github.com/${repoOf(registry, repo)}`;
