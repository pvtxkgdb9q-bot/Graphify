import { Link } from 'react-router-dom';
import { ingredientById } from '../data/ingredients';
import type { EnrichedRecipe } from '../domain/types';
import IngredientImage from './IngredientImage';
import { useStore } from '../store/store';
import { grams } from '../domain/nutrition';

const SKIP_CAT = new Set(['epices', 'herbes', 'sauces']);

export function heroIngredients(r: EnrichedRecipe, n = 3) {
  return r.ingredients
    .filter((ri) => !ri.optional)
    .map((ri) => ({ i: ingredientById.get(ri.id)!, g: grams(ri, ingredientById.get(ri.id)) }))
    .filter(({ i }) => i && !i.isPantryDefault && !SKIP_CAT.has(i.category))
    .sort((a, b) => b.g - a.g)
    .slice(0, n)
    .map(({ i }) => i);
}

export default function RecipeCard({ r, missing = [], subs = 0 }: { r: EnrichedRecipe; missing?: string[]; subs?: number }) {
  const fav = useStore((s) => s.favorites.includes(r.id));
  const hero = heroIngredients(r);
  return (
    <Link to={`/recette/${r.id}`} className="card flex gap-3 p-3 transition hover:ring-orange-300 active:scale-[.99]">
      <div className="grid h-24 w-24 shrink-0 grid-cols-2 grid-rows-2 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-orange-100 to-amber-50 p-1 dark:from-stone-800 dark:to-stone-900">
        {hero.map((i, k) => (
          <IngredientImage key={i.id} ing={i} className={k === 0 ? 'col-span-2 h-12 w-12' : 'h-9 w-9'} emojiClass={k === 0 ? 'text-3xl' : 'text-2xl'} />
        ))}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 font-semibold leading-snug">{r.title}</h3>
          {fav && <span aria-label="favori">❤️</span>}
        </div>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-stone-500 dark:text-stone-400">
          <span>⏱ {formatTime(r.totalTime)}</span>
          <span>🔥 {r.nutrition.kcal} kcal</span>
          <span>💪 {r.nutrition.protein} g</span>
          {r.hearty && <span className="rounded-full bg-orange-100 px-2 font-semibold text-orange-700 dark:bg-orange-900/50 dark:text-orange-200">Copieux</span>}
        </div>
        {missing.length > 0 && (
          <p className="mt-1.5 line-clamp-2 text-xs text-rose-600 dark:text-rose-400">
            Manque : {missing.map((id) => ingredientById.get(id)?.name ?? id).join(', ')}
          </p>
        )}
        {missing.length === 0 && subs > 0 && <p className="mt-1.5 text-xs text-amber-600">{subs} substitution{subs > 1 ? 's' : ''}</p>}
      </div>
    </Link>
  );
}

export function formatTime(min: number) {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} h ${m}` : `${h} h`;
}
