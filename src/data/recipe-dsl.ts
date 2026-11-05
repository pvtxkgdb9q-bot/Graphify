import type { Difficulty, Equipment, MealType, Recipe, RecipeIngredient, Unit } from '../domain/types';
import { slugify } from './ingredients';

const UNIT: Record<string, Unit> = {
  g: 'g', ml: 'ml', p: 'pièce', cs: 'c.à.s', cc: 'c.à.c', pi: 'pincée', t: 'tranche', gs: 'gousse', br: 'brin',
};

/**
 * Mini-langage pour décrire des ingrédients :
 * "blanc-de-poulet 600g, oignon 1p, ail 2gs, persil?"  (? = optionnel)
 */
export function ing(spec: string): RecipeIngredient[] {
  return spec
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((raw) => {
      let s = raw;
      const optional = s.endsWith('?');
      if (optional) s = s.slice(0, -1);
      const [id, q] = s.split(/\s+/);
      const m = q?.match(/^([\d.]+)([a-z]+)$/);
      const r: RecipeIngredient = { id };
      if (m) { r.qty = Number(m[1]); r.unit = UNIT[m[2]]; }
      if (optional) r.optional = true;
      return r;
    });
}

export function mergeIngredients(list: RecipeIngredient[]): RecipeIngredient[] {
  const out: RecipeIngredient[] = [];
  for (const r of list) {
    const prev = out.find((x) => x.id === r.id);
    if (!prev) { out.push({ ...r }); continue; }
    if (prev.unit === r.unit && prev.qty != null && r.qty != null) prev.qty += r.qty;
    if (!r.optional) prev.optional = undefined;
  }
  return out;
}

export interface Opt {
  label: string;
  ing: string;
  step?: string;
  tags?: string[];
  /** valeur libre utilisable dans les titres/étapes */
  x?: string;
}
export const o = (label: string, ingSpec: string, step?: string, x?: string, tags?: string[]): Opt => ({
  label, ing: ingSpec, step, x, tags,
});

export type Sel = Record<string, Opt>;

export interface Template {
  key: string;
  cuisine: string;
  meal: MealType[];
  prep: number;
  cook: number;
  diff: Difficulty;
  eq: Equipment[];
  servings?: number;
  base: string;
  slots: Record<string, Opt[]>;
  title: (s: Sel) => string;
  steps: (s: Sel) => string[];
  tags?: string[];
  skip?: (s: Sel) => boolean;
  /** temps de cuisson spécifique à la sélection */
  cookFor?: (s: Sel) => number;
}

function cartesian(slots: Record<string, Opt[]>): Sel[] {
  let acc: Sel[] = [{}];
  for (const [name, opts] of Object.entries(slots)) {
    const next: Sel[] = [];
    for (const a of acc) for (const opt of opts) next.push({ ...a, [name]: opt });
    acc = next;
  }
  return acc;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const clean = (s: string) => s.replace(/\s+/g, ' ').replace(/\s+,/g, ',').trim();

export function expand(t: Template): Recipe[] {
  return cartesian(t.slots)
    .filter((s) => !t.skip?.(s))
    .map((s) => {
      const title = cap(clean(t.title(s)));
      const all = [...ing(t.base), ...Object.values(s).flatMap((x) => ing(x.ing))];
      return {
        id: slugify(title),
        title,
        cuisine: t.cuisine,
        mealTypes: t.meal,
        prep: t.prep,
        cook: t.cookFor ? t.cookFor(s) : t.cook,
        difficulty: t.diff,
        servings: t.servings ?? 4,
        equipment: t.eq,
        ingredients: mergeIngredients(all),
        steps: t.steps(s).filter(Boolean).map(clean),
        tags: [...new Set([...(t.tags ?? []), ...Object.values(s).flatMap((x) => x.tags ?? [])])],
      };
    });
}

export interface Classic {
  title: string;
  cuisine: string;
  meal: MealType[];
  prep: number;
  cook: number;
  diff: Difficulty;
  eq: Equipment[];
  servings?: number;
  ing: string;
  steps: string[];
  tags?: string[];
}

export function classic(c: Classic): Recipe {
  return {
    id: slugify(c.title),
    title: c.title,
    cuisine: c.cuisine,
    mealTypes: c.meal,
    prep: c.prep,
    cook: c.cook,
    difficulty: c.diff,
    servings: c.servings ?? 4,
    equipment: c.eq,
    ingredients: mergeIngredients(ing(c.ing)),
    steps: c.steps,
    tags: c.tags ?? [],
  };
}
