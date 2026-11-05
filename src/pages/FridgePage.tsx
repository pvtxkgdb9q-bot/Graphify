import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories, ingredientById, ingredients } from '../data/ingredients';
import { searchIngredients } from '../domain/search';
import IngredientCard from '../components/IngredientCard';
import IngredientImage from '../components/IngredientImage';
import { useStore } from '../store/store';
import { recipeById } from '../data/db';

export default function FridgePage() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<string>('all');
  const fridge = useStore((s) => s.fridge);
  const pantry = useStore((s) => s.pantry);
  const usage = useStore((s) => s.usage);
  const toggle = useStore((s) => s.toggleFridge);
  const clear = useStore((s) => s.clearFridge);
  const navigate = useNavigate();
  const fridgeSet = useMemo(() => new Set(fridge), [fridge]);
  const pantrySet = useMemo(() => new Set(pantry), [pantry]);
  const onToggle = useCallback((id: string) => toggle(id), [toggle]);

  const frequent = useMemo(
    () => Object.entries(usage).sort((a, b) => b[1] - a[1]).slice(0, 24).map(([id]) => ingredientById.get(id)).filter(Boolean),
    [usage],
  );

  const list = useMemo(() => {
    if (q.trim()) return searchIngredients(ingredients, q);
    if (cat === 'frequent') return frequent as typeof ingredients;
    if (cat === 'all') return ingredients;
    return ingredients.filter((i) => i.category === cat);
  }, [q, cat, frequent]);

  return (
    <div>
      <header className="sticky top-0 z-20 bg-orange-50/95 px-4 pb-2 pt-[max(env(safe-area-inset-top),12px)] backdrop-blur dark:bg-stone-950/95">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold tracking-tight"><span className="text-orange-600">Frigo</span> Festin</h1>
          <span className="text-xs text-stone-500">{ingredients.length} ingrédients · {recipeById.size} recettes</span>
        </div>
        <div className="relative mt-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un ingrédient (ex. patate, steak haché…)"
            className="w-full rounded-2xl border-0 bg-white py-3 pl-11 pr-10 text-base shadow-sm ring-1 ring-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-stone-900 dark:ring-stone-700"
            type="search"
            aria-label="Rechercher un ingrédient"
          />
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">🔍</span>
        </div>
        {!q && (
          <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4">
            <button className={`chip ${cat === 'all' ? 'chip-on' : 'chip-off'}`} onClick={() => setCat('all')}>Tout</button>
            {frequent.length > 0 && (
              <button className={`chip ${cat === 'frequent' ? 'chip-on' : 'chip-off'}`} onClick={() => setCat('frequent')}>⭐ Fréquents</button>
            )}
            {categories.map((c) => (
              <button key={c.id} className={`chip ${cat === c.id ? 'chip-on' : 'chip-off'}`} onClick={() => setCat(c.id)}>
                {c.emoji} {c.name}
              </button>
            ))}
          </div>
        )}
      </header>

      {fridge.length > 0 && (
        <section className="px-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-stone-600 dark:text-stone-300">🧊 Mon frigo ({fridge.length})</h2>
            <button onClick={clear} className="text-sm font-medium text-rose-600">Tout vider</button>
          </div>
          <div className="no-scrollbar -mx-4 mt-2 flex gap-2 overflow-x-auto px-4 pb-1">
            {fridge.map((id) => {
              const i = ingredientById.get(id);
              if (!i) return null;
              return (
                <button key={id} onClick={() => toggle(id)} className="flex shrink-0 items-center gap-1.5 rounded-full bg-white py-1 pl-1 pr-3 text-sm shadow-sm ring-1 ring-orange-300 dark:bg-stone-900" aria-label={`Retirer ${i.name}`}>
                  <IngredientImage ing={i} className="h-7 w-7" emojiClass="text-lg" />
                  {i.name} <span className="text-stone-400">✕</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <main className="px-4 pt-3">
        {q && <p className="mb-2 text-sm text-stone-500">{list.length} résultat{list.length > 1 ? 's' : ''}</p>}
        {list.length === 0 ? (
          <p className="py-12 text-center text-stone-500">Aucun ingrédient trouvé pour « {q} ».</p>
        ) : (
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5 lg:grid-cols-6">
            {list.map((i) => (
              <IngredientCard key={i.id} ing={i} selected={fridgeSet.has(i.id)} pantry={pantrySet.has(i.id)} onToggle={onToggle} />
            ))}
          </div>
        )}
      </main>

      {fridge.length > 0 && (
        <div className="fixed inset-x-0 bottom-[calc(56px+env(safe-area-inset-bottom))] z-20 px-4 pb-3">
          <button onClick={() => navigate('/repas')} className="btn-primary mx-auto flex w-full max-w-md text-lg">
            🍽️ Trouver des repas <span className="rounded-full bg-white/25 px-2 text-sm">{fridge.length}</span>
          </button>
        </div>
      )}
    </div>
  );
}
