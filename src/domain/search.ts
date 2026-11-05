import type { Ingredient } from './types';

export const norm = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/œ/g, 'oe').replace(/[’'-]/g, ' ').replace(/\s+/g, ' ').trim();

const stem = (w: string) => (w.length > 3 ? w.replace(/(s|x)$/, '') : w);
const words = (s: string) => norm(s).split(' ').filter(Boolean).map(stem);

export function searchIngredients(list: Ingredient[], q: string): Ingredient[] {
  const qw = words(q);
  if (!qw.length) return list;
  const scored: { i: Ingredient; s: number }[] = [];
  for (const i of list) {
    let best = 0;
    for (const [k, text] of [i.name, ...i.synonyms].entries()) {
      const tw = words(text);
      const all = qw.every((w) => tw.some((t) => t.startsWith(w)));
      if (!all) continue;
      const exact = norm(text) === norm(q) || tw.join(' ') === qw.join(' ');
      best = Math.max(best, (exact ? 100 : 50) - (k > 0 ? 5 : 0) - tw.length);
    }
    if (best > 0) scored.push({ i, s: best });
  }
  return scored.sort((a, b) => b.s - a.s).map((x) => x.i);
}
