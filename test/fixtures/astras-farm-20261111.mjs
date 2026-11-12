// Astra's own farm, read from this copy's pets.json (Astra, 2026-11-11: her friend Dev makes her own farm and her
// first pet). Many tests describe Astra's farm, where her account owns every pet. On someone else's copy, after the
// Friendly Farmer's make-it-yours, pets.json names that person as the farm owner and marks each of Astra's pets
// "github_owner": "findastra", so those tests failed on every farm but Astra's. asAstrasFarm() puts the registry back
// the way Astra's own farm has it, so they check the same thing on every farm; on Astra's farm it changes nothing.
// Claude Opus 5.5 (claude-opus-5-5), 2026-11-11.
import { farmOwner, sameAccount, upstream } from '../../scripts/farm-owner-20261020.mjs';

const LISTS = ['pets', 'pipeline', 'candidates'];

/** True when this copy's pets.json is Astra's own farm (an older copy without the field is hers too). */
export const isAstrasFarm = (registry) => sameAccount(farmOwner(registry), upstream().owner);

/** A copy of the registry as Astra's own farm: her account owns the farm, and no pet names her account again. */
export function asAstrasFarm(registry) {
  const r = JSON.parse(JSON.stringify(registry));
  if (isAstrasFarm(r)) return r;
  r.github_owner = upstream().owner;
  for (const list of LISTS) for (const p of r[list] || []) if (sameAccount(p.github_owner, upstream().owner)) delete p.github_owner;
  return r;
}
