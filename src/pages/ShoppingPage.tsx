import { useMemo, useState } from 'react';
import { categories, ingredientById, ingredients } from '../data/ingredients';
import { searchIngredients } from '../domain/search';
import IngredientImage from '../components/IngredientImage';
import { useStore } from '../store/store';

export default function ShoppingPage() {
  const s = useStore();
  const [q, setQ] = useState('');
  const results = useMemo(() => (q.trim() ? searchIngredients(ingredients, q).slice(0, 6) : []), [q]);
  const groups = useMemo(() => categories
    .map((c) => ({ c, items: s.shopping.filter((x) => ingredientById.get(x.id)?.category === c.id) }))
    .filter((g) => g.items.length), [s.shopping]);
  const done = s.shopping.filter((x) => x.done).length;

  return (
    <div className="px-4 pt-[max(env(safe-area-inset-top),12px)]">
      <h1 className="text-2xl font-extrabold tracking-tight">Liste de courses</h1>
      <div className="relative mt-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} type="search" placeholder="Ajouter un article…" aria-label="Ajouter un article"
          className="w-full rounded-2xl border-0 bg-white px-4 py-3 text-base shadow-sm ring-1 ring-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-stone-900 dark:ring-stone-700" />
        {results.length > 0 && (
          <ul className="card absolute inset-x-0 top-full z-10 mt-1 overflow-hidden p-1">
            {results.map((i) => (
              <li key={i.id}>
                <button className="flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left hover:bg-orange-50 dark:hover:bg-stone-800" onClick={() => { s.addShopping([i.id]); setQ(''); }}>
                  <IngredientImage ing={i} className="h-8 w-8" emojiClass="text-xl" /> {i.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {s.shopping.length === 0 ? (
        <div className="py-16 text-center text-stone-500">
          <p className="text-5xl">🛒</p>
          <p className="mt-3">Ta liste est vide. Depuis une recette, ajoute les ingrédients manquants en un clic.</p>
        </div>
      ) : (
        <>
          <div className="mt-4 space-y-4">
            {groups.map(({ c, items }) => (
              <section key={c.id}>
                <h2 className="mb-1 text-sm font-semibold text-stone-500">{c.emoji} {c.name}</h2>
                <ul className="card divide-y divide-stone-100 dark:divide-stone-800">
                  {items.map((x) => {
                    const i = ingredientById.get(x.id)!;
                    return (
                      <li key={x.id} className="flex items-center gap-3 px-3 py-2">
                        <input type="checkbox" checked={x.done} onChange={() => s.toggleShopping(x.id)} className="h-6 w-6 accent-orange-600" aria-label={`Acheté : ${i.name}`} />
                        <IngredientImage ing={i} className="h-9 w-9" emojiClass="text-2xl" />
                        <span className={`flex-1 ${x.done ? 'text-stone-400 line-through' : ''}`}>{i.name}</span>
                        <button onClick={() => s.removeShopping(x.id)} className="px-2 text-stone-400" aria-label={`Supprimer ${i.name}`}>✕</button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
          <button className="btn-primary mt-5 w-full" disabled={!done} onClick={s.boughtToFridge}>
            🧊 J’ai acheté ({done}) → mettre dans le frigo
          </button>
        </>
      )}
    </div>
  );
}
