import type { Recipe } from '../domain/types';
import { classics } from './classics';
import { expand } from './recipe-dsl';
import * as plats from './templates-plats';
import * as sucre from './templates-sucre';

function build(): Recipe[] {
  const seen = new Set<string>();
  const out: Recipe[] = [];
  const all = [...classics, ...Object.values(plats).flatMap(expand), ...Object.values(sucre).flatMap(expand)];
  for (const r of all) {
    if (seen.has(r.id)) continue;
    seen.add(r.id);
    out.push(r);
  }
  return out;
}

export const recipes: Recipe[] = build();
