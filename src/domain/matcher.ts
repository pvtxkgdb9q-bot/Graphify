import type { Diet, EnrichedRecipe, Ingredient } from './types';

export type DietKey = keyof Diet;

export interface MatchOptions {
  fridge: Set<string>;
  pantry: Set<string>;
  diets?: DietKey[];
  disliked?: Set<string>;
  bigEater?: boolean;
}

export type Status = 'have' | 'pantry' | 'sub' | 'missing';

export interface IngredientStatus { id: string; status: Status; via?: string; optional: boolean }

export interface Match {
  recipe: EnrichedRecipe;
  score: number;
  missing: string[];
  subs: { id: string; via: string }[];
  usedFromFridge: number;
  group: 'ready' | 'almost' | 'inspiration';
}

export class Matcher {
  private index = new Map<string, number[]>();

  constructor(
    public readonly recipes: EnrichedRecipe[],
    private readonly byId: Map<string, Ingredient>,
  ) {
    recipes.forEach((r, i) => {
      for (const ri of r.ingredients) {
        const ids = [ri.id, ...(byId.get(ri.id)?.substitutes ?? [])];
        for (const id of ids) {
          let arr = this.index.get(id);
          if (!arr) this.index.set(id, (arr = []));
          if (arr[arr.length - 1] !== i) arr.push(i);
        }
      }
    });
  }

  statusOf(id: string, fridge: Set<string>, pantry: Set<string>): { status: Status; via?: string } {
    if (fridge.has(id)) return { status: 'have' };
    if (pantry.has(id)) return { status: 'pantry' };
    for (const s of this.byId.get(id)?.substitutes ?? []) {
      if (fridge.has(s) || pantry.has(s)) return { status: 'sub', via: s };
    }
    return { status: 'missing' };
  }

  details(r: EnrichedRecipe, fridge: Set<string>, pantry: Set<string>): IngredientStatus[] {
    return r.ingredients.map((ri) => ({ id: ri.id, optional: !!ri.optional, ...this.statusOf(ri.id, fridge, pantry) }));
  }

  match(opts: MatchOptions): Match[] {
    const { fridge, pantry, diets = [], disliked = new Set(), bigEater = false } = opts;
    const candidates = new Set<number>();
    for (const id of fridge) for (const i of this.index.get(id) ?? []) candidates.add(i);

    const out: Match[] = [];
    for (const i of candidates) {
      const r = this.recipes[i];
      if (diets.some((d) => !r.diet[d])) continue;
      if (r.ingredients.some((ri) => !ri.optional && disliked.has(ri.id))) continue;

      let required = 0, available = 0, optPresent = 0, used = 0;
      const missing: string[] = [];
      const subs: { id: string; via: string }[] = [];
      for (const ri of r.ingredients) {
        const st = this.statusOf(ri.id, fridge, pantry);
        if (st.status === 'have' || (st.status === 'sub' && fridge.has(st.via!))) used++;
        if (ri.optional) { if (st.status !== 'missing') optPresent++; continue; }
        required++;
        if (st.status === 'missing') missing.push(ri.id);
        else {
          available++;
          if (st.status === 'sub') subs.push({ id: ri.id, via: st.via! });
        }
      }
      if (used === 0) continue;
      const coverage = available / Math.max(1, required);
      const usage = used / Math.max(1, fridge.size);
      const score = 100 * coverage + 30 * usage + 5 * optPresent - 25 * missing.length - 3 * subs.length
        + (bigEater && r.hearty ? 10 : 0);
      const group = missing.length === 0 ? 'ready' : missing.length <= 2 ? 'almost' : 'inspiration';
      if (group === 'inspiration' && used < 2) continue;
      out.push({ recipe: r, score, missing, subs, usedFromFridge: used, group });
    }
    return out.sort((a, b) => b.score - a.score);
  }
}
