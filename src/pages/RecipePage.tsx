import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { matcher, recipeById } from '../data/db';
import { ingredientById } from '../data/ingredients';
import type { RecipeIngredient } from '../domain/types';
import IngredientImage from '../components/IngredientImage';
import RecipeCard, { formatTime, heroIngredients } from '../components/RecipeCard';
import { useStore } from '../store/store';

export function formatQty(ri: RecipeIngredient, factor: number): string {
  if (ri.qty == null) return '';
  let q = ri.qty * factor;
  const u = ri.unit ?? 'g';
  if (u === 'g' || u === 'ml') {
    q = q >= 100 ? Math.round(q / 10) * 10 : Math.round(q / 5) * 5 || Math.round(q);
    if (q >= 1000) return `${(q / 1000).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} ${u === 'g' ? 'kg' : 'L'}`;
    return `${q} ${u}`;
  }
  q = Math.round(q * 2) / 2;
  if (q === 0) q = 0.5;
  const n = q === 0.5 ? '½' : Number.isInteger(q) ? String(q) : `${Math.floor(q)} ½`;
  const plural = q > 1 && ['tranche', 'gousse', 'brin', 'pincée'].includes(u) ? 's' : '';
  return u === 'pièce' ? n : `${n} ${u}${plural}`;
}

const STATUS = {
  have: { label: 'Dans mon frigo', cls: 'text-emerald-600', icon: '✅' },
  pantry: { label: 'Placard', cls: 'text-emerald-600', icon: '🏠' },
  sub: { label: 'Substitution', cls: 'text-amber-600', icon: '🔄' },
  missing: { label: 'Manquant', cls: 'text-rose-600', icon: '❌' },
};

export default function RecipePage() {
  const { id = '' } = useParams();
  const r = recipeById.get(id);
  const navigate = useNavigate();
  const s = useStore();
  const [servings, setServings] = useState(s.defaultServings);
  const [bigEater, setBigEater] = useState(s.bigEater);
  const [added, setAdded] = useState(false);
  const [cooked, setCooked] = useState(false);
  const [doneSteps, setDoneSteps] = useState<number[]>([]);

  useEffect(() => {
    let lock: { release: () => Promise<void> } | undefined;
    const nav = navigator as Navigator & { wakeLock?: { request: (t: 'screen') => Promise<{ release: () => Promise<void> }> } };
    nav.wakeLock?.request('screen').then((l) => { lock = l; }).catch(() => {});
    return () => { lock?.release().catch(() => {}); };
  }, []);

  const fridge = useMemo(() => new Set(s.fridge), [s.fridge]);
  const pantry = useMemo(() => new Set(s.pantry), [s.pantry]);

  const pairings = useMemo(() => {
    if (!r || !r.mealTypes.includes('plat')) return [];
    const matches = matcher.match({ fridge, pantry, diets: s.diets, disliked: new Set(s.disliked) });
    const pick = (t: string) => matches.filter((m) => m.recipe.mealTypes.includes(t as never) && !m.recipe.mealTypes.includes('plat') && m.missing.length <= 1).slice(0, 2);
    return [...pick('entree'), ...pick('dessert')];
  }, [r, fridge, pantry, s.diets, s.disliked]);

  if (!r) {
    return (
      <div className="p-8 text-center">
        <p>Recette introuvable.</p>
        <Link to="/repas" className="font-semibold text-orange-600">← Retour aux repas</Link>
      </div>
    );
  }

  const details = matcher.details(r, fridge, pantry);
  const missing = details.filter((d) => d.status === 'missing' && !d.optional).map((d) => d.id);
  const factor = (servings / r.servings) * (bigEater ? s.bigEaterFactor : 1);
  const fav = s.favorites.includes(r.id);
  const hero = heroIngredients(r, 5);
  const perPortion = bigEater ? s.bigEaterFactor : 1;

  return (
    <article className="pb-6">
      <div className="relative bg-gradient-to-br from-orange-500 to-amber-400 px-4 pb-6 pt-[max(env(safe-area-inset-top),12px)] text-white dark:from-orange-800 dark:to-amber-700">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="rounded-full bg-white/20 px-3 py-1.5 text-sm font-semibold backdrop-blur">← Retour</button>
          <button onClick={() => s.toggleFavorite(r.id)} className="rounded-full bg-white/20 px-3 py-1.5 text-xl backdrop-blur" aria-label={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}>{fav ? '❤️' : '🤍'}</button>
        </div>
        <div className="mt-4 flex justify-center gap-2">
          {hero.map((i) => (
            <div key={i.id} className="rounded-2xl bg-white/90 p-1.5 shadow dark:bg-stone-900/80">
              <IngredientImage ing={i} className="h-14 w-14 sm:h-16 sm:w-16" emojiClass="text-3xl" />
            </div>
          ))}
        </div>
        <h1 className="mt-4 text-center text-2xl font-extrabold leading-tight drop-shadow-sm">{r.title}</h1>
        <p className="mt-1 text-center text-sm capitalize opacity-90">{r.cuisine} · {r.difficulty}</p>
        <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
          {[['⏱', formatTime(r.totalTime), 'total'], ['🔥', `${Math.round(r.nutrition.kcal * perPortion)}`, 'kcal/pers.'], ['💪', `${Math.round(r.nutrition.protein * perPortion)} g`, 'protéines'], ['🍝', `${Math.round(r.nutrition.carbs * perPortion)} g`, 'glucides']].map(([i, v, l]) => (
            <div key={l} className="rounded-2xl bg-white/20 px-1 py-2 backdrop-blur"><div className="text-base font-bold">{i} {v}</div><div className="opacity-90">{l}</div></div>
          ))}
        </div>
        {r.hearty && <p className="mt-3 text-center"><span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-orange-700">🍖 Plat copieux</span></p>}
      </div>

      <div className="mx-auto max-w-2xl space-y-4 px-4 pt-4">
        <section className="card p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button className="btn-ghost h-10 w-10 p-0 text-xl" onClick={() => setServings((v) => Math.max(1, v - 1))} aria-label="Moins de portions">−</button>
              <span className="min-w-[90px] text-center font-semibold">{servings} personne{servings > 1 ? 's' : ''}</span>
              <button className="btn-ghost h-10 w-10 p-0 text-xl" onClick={() => setServings((v) => Math.min(12, v + 1))} aria-label="Plus de portions">+</button>
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
              <input type="checkbox" checked={bigEater} onChange={(e) => setBigEater(e.target.checked)} className="h-5 w-5 accent-orange-600" />
              Grand mangeur (×{String(s.bigEaterFactor).replace('.', ',')})
            </label>
          </div>
        </section>

        <section className="card p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Ingrédients</h2>
            <span className="text-xs text-stone-500">{details.filter((d) => d.status !== 'missing').length}/{details.length} disponibles</span>
          </div>
          <ul className="mt-3 divide-y divide-stone-100 dark:divide-stone-800">
            {r.ingredients.map((ri, k) => {
              const ing = ingredientById.get(ri.id)!;
              const d = details[k];
              const st = STATUS[d.status];
              return (
                <li key={ri.id} className="flex items-center gap-3 py-2">
                  <IngredientImage ing={ing} className="h-10 w-10" emojiClass="text-2xl" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">
                      {ing.name}{ri.optional && <span className="text-xs font-normal text-stone-400"> (facultatif)</span>}
                    </p>
                    <p className={`text-xs ${st.cls}`}>
                      {st.icon} {d.status === 'sub' ? `Remplacer par : ${ingredientById.get(d.via!)?.name}` : st.label}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold tabular-nums">{formatQty(ri, factor)}</span>
                </li>
              );
            })}
          </ul>
          {missing.length > 0 && (
            <button className="btn-primary mt-3 w-full" disabled={added} onClick={() => { s.addShopping(missing); setAdded(true); }}>
              {added ? '✓ Ajouté à la liste de courses' : `🛒 Ajouter les ${missing.length} manquant${missing.length > 1 ? 's' : ''} aux courses`}
            </button>
          )}
        </section>

        <section className="card p-4">
          <h2 className="text-lg font-bold">Préparation</h2>
          <p className="text-xs text-stone-500">Préparation {formatTime(r.prep)}{r.cook ? ` · cuisson ${formatTime(r.cook)}` : ''} · touche une étape pour la cocher</p>
          <ol className="mt-3 space-y-3">
            {r.steps.map((step, k) => {
              const done = doneSteps.includes(k);
              return (
                <li key={k}>
                  <button onClick={() => setDoneSteps(done ? doneSteps.filter((x) => x !== k) : [...doneSteps, k])} className={`flex w-full gap-3 text-left ${done ? 'opacity-50' : ''}`}>
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${done ? 'bg-emerald-500 text-white' : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200'}`}>{done ? '✓' : k + 1}</span>
                    <span className={`pt-1 text-[17px] leading-relaxed ${done ? 'line-through' : ''}`}>{step}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="card p-4 text-sm">
          <h2 className="text-lg font-bold">Valeurs nutritionnelles estimées</h2>
          <p className="text-xs text-stone-500">Par portion{bigEater ? ' grand mangeur' : ' standard'}</p>
          <div className="mt-2 grid grid-cols-4 gap-2 text-center">
            {[['Énergie', `${Math.round(r.nutrition.kcal * perPortion)} kcal`], ['Protéines', `${Math.round(r.nutrition.protein * perPortion)} g`], ['Glucides', `${Math.round(r.nutrition.carbs * perPortion)} g`], ['Lipides', `${Math.round(r.nutrition.fat * perPortion)} g`]].map(([l, v]) => (
              <div key={l} className="rounded-xl bg-stone-50 p-2 dark:bg-stone-800"><div className="font-bold">{v}</div><div className="text-xs text-stone-500">{l}</div></div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {r.diet.vegetarian && <span className="chip chip-off">🌱 Végétarien</span>}
            {r.diet.vegan && <span className="chip chip-off">🌿 Végan</span>}
            {r.diet.glutenFree && <span className="chip chip-off">Sans gluten</span>}
            {r.diet.lactoseFree && <span className="chip chip-off">Sans lactose</span>}
            {r.tags.map((t) => <span key={t} className="chip chip-off">#{t}</span>)}
          </div>
        </section>

        <button className="btn-ghost w-full" disabled={cooked} onClick={() => { s.markCooked(r.id); setCooked(true); }}>
          {cooked ? '✓ Ajouté à l’historique' : '👨‍🍳 Je l’ai cuisiné'}
        </button>

        {pairings.length > 0 && (
          <section>
            <h2 className="mb-2 text-lg font-bold">Pour compléter le repas</h2>
            <div className="space-y-2.5">{pairings.map((m) => <RecipeCard key={m.recipe.id} r={m.recipe} missing={m.missing} />)}</div>
          </section>
        )}
      </div>
    </article>
  );
}
