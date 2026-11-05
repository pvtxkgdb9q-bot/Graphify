import { useMemo, useState } from 'react';
import { ingredientById, ingredients } from '../data/ingredients';
import { searchIngredients } from '../domain/search';
import type { DietKey } from '../domain/matcher';
import { useStore } from '../store/store';

const DIETS: [DietKey, string][] = [
  ['vegetarian', 'Végétarien'], ['vegan', 'Végan'], ['glutenFree', 'Sans gluten'], ['lactoseFree', 'Sans lactose'], ['noPork', 'Sans porc'],
];

function Picker({ label, selected, onToggle }: { label: string; selected: string[]; onToggle: (id: string) => void }) {
  const [q, setQ] = useState('');
  const results = useMemo(() => (q.trim() ? searchIngredients(ingredients, q).slice(0, 8) : []), [q]);
  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {selected.map((id) => (
          <button key={id} className="chip chip-on" onClick={() => onToggle(id)}>{ingredientById.get(id)?.name ?? id} ✕</button>
        ))}
      </div>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={label} type="search"
        className="mt-2 w-full rounded-xl border-0 bg-stone-50 px-3 py-2 ring-1 ring-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-stone-800 dark:ring-stone-700" />
      {results.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1.5">
          {results.map((i) => (
            <button key={i.id} className={`chip ${selected.includes(i.id) ? 'chip-on' : 'chip-off'}`} onClick={() => { onToggle(i.id); setQ(''); }}>{i.emoji} {i.name}</button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const s = useStore();
  return (
    <div className="space-y-4 px-4 pt-[max(env(safe-area-inset-top),12px)]">
      <h1 className="text-2xl font-extrabold tracking-tight">Réglages</h1>

      <section className="card space-y-3 p-4">
        <h2 className="font-bold">🍖 Mode grand mangeur</h2>
        <label className="flex items-center justify-between">
          <span>Activé par défaut</span>
          <input type="checkbox" checked={s.bigEater} onChange={(e) => s.set({ bigEater: e.target.checked })} className="h-6 w-6 accent-orange-600" />
        </label>
        <div>
          <p className="text-sm">Coefficient par portion : <b>×{String(s.bigEaterFactor).replace('.', ',')}</b></p>
          <input type="range" min={1.25} max={2.5} step={0.25} value={s.bigEaterFactor} onChange={(e) => s.set({ bigEaterFactor: Number(e.target.value) })} className="w-full accent-orange-600" />
        </div>
        <div className="flex items-center justify-between">
          <span>Portions par défaut</span>
          <div className="flex items-center gap-2">
            <button className="btn-ghost h-9 w-9 p-0" onClick={() => s.set({ defaultServings: Math.max(1, s.defaultServings - 1) })}>−</button>
            <b className="w-6 text-center">{s.defaultServings}</b>
            <button className="btn-ghost h-9 w-9 p-0" onClick={() => s.set({ defaultServings: Math.min(12, s.defaultServings + 1) })}>+</button>
          </div>
        </div>
      </section>

      <section className="card space-y-2 p-4">
        <h2 className="font-bold">🥗 Régimes permanents</h2>
        <p className="text-sm text-stone-500">Les recettes incompatibles ne seront jamais proposées.</p>
        <div className="flex flex-wrap gap-2">
          {DIETS.map(([k, l]) => <button key={k} className={`chip ${s.diets.includes(k) ? 'chip-on' : 'chip-off'}`} onClick={() => s.toggleDiet(k)}>{l}</button>)}
        </div>
      </section>

      <section className="card space-y-2 p-4">
        <h2 className="font-bold">🙅 Ingrédients que je n’aime pas</h2>
        <Picker label="Rechercher un ingrédient à exclure" selected={s.disliked} onToggle={s.toggleDisliked} />
      </section>

      <section className="card space-y-2 p-4">
        <h2 className="font-bold">🏠 Placard de base</h2>
        <p className="text-sm text-stone-500">Ces ingrédients sont considérés comme toujours disponibles.</p>
        <Picker label="Ajouter au placard" selected={s.pantry} onToggle={s.togglePantry} />
        <button className="text-sm font-semibold text-orange-600" onClick={s.resetPantry}>Rétablir le placard par défaut</button>
      </section>

      <section className="card space-y-2 p-4 text-sm text-stone-600 dark:text-stone-300">
        <h2 className="font-bold text-stone-900 dark:text-stone-100">ℹ️ À propos</h2>
        <p>Frigo Festin fonctionne entièrement sur ton appareil : aucune donnée n’est envoyée sur un serveur. Installe-la sur ton écran d’accueil pour l’utiliser hors connexion.</p>
        <p>Photos d’ingrédients : TheMealDB (themealdb.com). Valeurs nutritionnelles estimées à partir de moyennes par ingrédient.</p>
        <button className="font-semibold text-rose-600" onClick={() => { if (confirm('Effacer toutes tes données (frigo, favoris, historique, courses, réglages) ?')) s.resetAll(); }}>
          Réinitialiser toutes les données
        </button>
      </section>
    </div>
  );
}
