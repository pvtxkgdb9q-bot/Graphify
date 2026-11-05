import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { matcher } from '../data/db';
import type { DietKey, Match } from '../domain/matcher';
import type { Equipment, MealType } from '../domain/types';
import RecipeCard from '../components/RecipeCard';
import { useStore } from '../store/store';

const MEALS: [MealType, string][] = [
  ['plat', 'Plat'], ['entree', 'Entrée'], ['accompagnement', 'Accompagnement'], ['petit-dejeuner', 'Petit-déj'],
  ['dessert', 'Dessert'], ['gouter', 'Goûter'], ['apero', 'Apéro'],
];
const TIMES: [number, string][] = [[15, '≤ 15 min'], [30, '≤ 30 min'], [60, '≤ 1 h']];
const DIETS: [DietKey, string][] = [
  ['vegetarian', 'Végétarien'], ['vegan', 'Végan'], ['glutenFree', 'Sans gluten'], ['lactoseFree', 'Sans lactose'], ['noPork', 'Sans porc'],
];
const EQUIP: [Equipment, string][] = [
  ['poele', 'Poêle'], ['four', 'Four'], ['casserole', 'Casserole'], ['cocotte', 'Cocotte'], ['wok', 'Wok'], ['mixeur', 'Mixeur'],
];
const SORTS = [['score', 'Pertinence'], ['hearty', 'Le plus copieux'], ['fast', 'Le plus rapide'], ['missing', 'Moins de manquants']] as const;
type SortKey = (typeof SORTS)[number][0];
const GROUPS = [
  ['ready', '✅ Réalisables'], ['almost', '🟡 Presque'], ['inspiration', '💡 Inspiration'],
] as const;
type GroupKey = (typeof GROUPS)[number][0];

const PAGE = 30;

export default function MealsPage() {
  const s = useStore();
  const navigate = useNavigate();
  const [group, setGroup] = useState<GroupKey>('ready');
  const [meal, setMeal] = useState<MealType | null>(null);
  const [time, setTime] = useState<number | null>(null);
  const [diff, setDiff] = useState<string | null>(null);
  const [hearty, setHearty] = useState(false);
  const [diets, setDiets] = useState<DietKey[]>([]);
  const [equip, setEquip] = useState<Equipment | null>(null);
  const [cuisine, setCuisine] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>('score');
  const [showFilters, setShowFilters] = useState(false);
  const [limit, setLimit] = useState(PAGE);

  const all = useMemo(
    () => matcher.match({
      fridge: new Set(s.fridge),
      pantry: new Set(s.pantry),
      diets: [...new Set([...s.diets, ...diets])],
      disliked: new Set(s.disliked),
      bigEater: s.bigEater,
    }),
    [s.fridge, s.pantry, s.diets, diets, s.disliked, s.bigEater],
  );

  const cuisines = useMemo(() => [...new Set(all.map((m) => m.recipe.cuisine))].sort(), [all]);

  const filtered = useMemo(() => {
    const f = all.filter(({ recipe: r }) =>
      (!meal || r.mealTypes.includes(meal))
      && (!time || r.totalTime <= time)
      && (!diff || r.difficulty === diff)
      && (!hearty || r.hearty)
      && (!equip || r.equipment.includes(equip))
      && (!cuisine || r.cuisine === cuisine));
    const cmp: Record<SortKey, (a: Match, b: Match) => number> = {
      score: (a, b) => b.score - a.score,
      hearty: (a, b) => b.recipe.nutrition.kcal - a.recipe.nutrition.kcal,
      fast: (a, b) => a.recipe.totalTime - b.recipe.totalTime,
      missing: (a, b) => a.missing.length - b.missing.length || b.score - a.score,
    };
    return f.sort(cmp[sort]);
  }, [all, meal, time, diff, hearty, equip, cuisine, sort]);

  const counts = useMemo(() => {
    const c = { ready: 0, almost: 0, inspiration: 0 };
    for (const m of filtered) c[m.group]++;
    return c;
  }, [filtered]);

  const visible = filtered.filter((m) => m.group === group);
  const activeFilters = [meal, time, diff, hearty || null, equip, cuisine].filter(Boolean).length + diets.length;

  const surprise = () => {
    const pool = filtered.filter((m) => m.group === 'ready');
    const src = pool.length ? pool : filtered;
    if (src.length) navigate(`/recette/${src[Math.floor(Math.random() * src.length)].recipe.id}`);
  };

  if (s.fridge.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="text-6xl">🧊</span>
        <h1 className="text-xl font-bold">Ton frigo est vide</h1>
        <p className="text-stone-500">Sélectionne ce que tu as sous la main et je te trouve plein d’idées de repas.</p>
        <Link to="/" className="btn-primary">Remplir mon frigo</Link>
      </div>
    );
  }

  const Chip = ({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button className={`chip ${on ? 'chip-on' : 'chip-off'}`} onClick={() => { onClick(); setLimit(PAGE); }}>{children}</button>
  );

  return (
    <div>
      <header className="sticky top-0 z-20 bg-orange-50/95 px-4 pb-2 pt-[max(env(safe-area-inset-top),12px)] backdrop-blur dark:bg-stone-950/95">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-2xl font-extrabold tracking-tight">{filtered.length} idées de repas</h1>
          <button onClick={surprise} className="btn-ghost px-3 py-2 text-sm">🎲 Surprends-moi</button>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-1 rounded-2xl bg-white p-1 ring-1 ring-stone-200 dark:bg-stone-900 dark:ring-stone-800">
          {GROUPS.map(([k, label]) => (
            <button
              key={k}
              onClick={() => { setGroup(k); setLimit(PAGE); }}
              className={`rounded-xl px-1 py-2 text-xs font-semibold sm:text-sm ${group === k ? 'bg-orange-600 text-white' : 'text-stone-600 dark:text-stone-300'}`}
            >
              {label} <span className="opacity-80">({counts[k]})</span>
            </button>
          ))}
        </div>
        <div className="no-scrollbar -mx-4 mt-2 flex gap-2 overflow-x-auto px-4">
          <Chip on={showFilters} onClick={() => setShowFilters((v) => !v)}>⚙️ Filtres{activeFilters ? ` (${activeFilters})` : ''}</Chip>
          <Chip on={hearty} onClick={() => setHearty((v) => !v)}>🍖 Copieux</Chip>
          {MEALS.slice(0, 5).map(([k, l]) => <Chip key={k} on={meal === k} onClick={() => setMeal(meal === k ? null : k)}>{l}</Chip>)}
        </div>
      </header>

      {showFilters && (
        <section className="card mx-4 mt-2 space-y-3 p-4 text-sm">
          <FilterRow label="Trier par">{SORTS.map(([k, l]) => <Chip key={k} on={sort === k} onClick={() => setSort(k)}>{l}</Chip>)}</FilterRow>
          <FilterRow label="Type de repas">{MEALS.map(([k, l]) => <Chip key={k} on={meal === k} onClick={() => setMeal(meal === k ? null : k)}>{l}</Chip>)}</FilterRow>
          <FilterRow label="Temps">{TIMES.map(([k, l]) => <Chip key={k} on={time === k} onClick={() => setTime(time === k ? null : k)}>{l}</Chip>)}</FilterRow>
          <FilterRow label="Difficulté">{['facile', 'moyen', 'difficile'].map((d) => <Chip key={d} on={diff === d} onClick={() => setDiff(diff === d ? null : d)}>{d}</Chip>)}</FilterRow>
          <FilterRow label="Régime">{DIETS.map(([k, l]) => <Chip key={k} on={diets.includes(k) || s.diets.includes(k)} onClick={() => setDiets(diets.includes(k) ? diets.filter((x) => x !== k) : [...diets, k])}>{l}</Chip>)}</FilterRow>
          <FilterRow label="Équipement">{EQUIP.map(([k, l]) => <Chip key={k} on={equip === k} onClick={() => setEquip(equip === k ? null : k)}>{l}</Chip>)}</FilterRow>
          <FilterRow label="Cuisine">{cuisines.map((c) => <Chip key={c} on={cuisine === c} onClick={() => setCuisine(cuisine === c ? null : c)}>{c}</Chip>)}</FilterRow>
          {activeFilters > 0 && (
            <button className="text-sm font-semibold text-rose-600" onClick={() => { setMeal(null); setTime(null); setDiff(null); setHearty(false); setDiets([]); setEquip(null); setCuisine(null); }}>
              Effacer les filtres
            </button>
          )}
        </section>
      )}

      <main className="space-y-2.5 px-4 pt-3">
        {visible.length === 0 ? (
          <div className="py-10 text-center text-stone-500">
            <p className="text-4xl">🤔</p>
            <p className="mt-2">Rien dans cette catégorie avec ces filtres.</p>
            {group !== 'almost' && counts.almost > 0 && <button className="mt-3 font-semibold text-orange-600" onClick={() => setGroup('almost')}>Voir les {counts.almost} recettes où il manque 1 ou 2 ingrédients →</button>}
            {group === 'almost' && counts.inspiration > 0 && <button className="mt-3 font-semibold text-orange-600" onClick={() => setGroup('inspiration')}>Voir les {counts.inspiration} idées d’inspiration →</button>}
            {counts.almost + counts.inspiration + counts.ready === 0 && <Link to="/" className="mt-3 block font-semibold text-orange-600">Ajouter des ingrédients →</Link>}
          </div>
        ) : (
          <div className="grid gap-2.5 md:grid-cols-2">
            {visible.slice(0, limit).map((m) => <RecipeCard key={m.recipe.id} r={m.recipe} missing={m.missing} subs={m.subs.length} />)}
          </div>
        )}
        {visible.length > limit && (
          <button className="btn-ghost w-full" onClick={() => setLimit((l) => l + PAGE)}>Voir plus ({visible.length - limit} restantes)</button>
        )}
      </main>
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 font-semibold text-stone-600 dark:text-stone-300">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
