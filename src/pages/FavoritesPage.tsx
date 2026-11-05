import { useState } from 'react';
import { Link } from 'react-router-dom';
import { recipeById } from '../data/db';
import RecipeCard from '../components/RecipeCard';
import { useStore } from '../store/store';

export default function FavoritesPage() {
  const [tab, setTab] = useState<'fav' | 'hist'>('fav');
  const favorites = useStore((s) => s.favorites);
  const history = useStore((s) => s.history);
  return (
    <div className="px-4 pt-[max(env(safe-area-inset-top),12px)]">
      <h1 className="text-2xl font-extrabold tracking-tight">Mes recettes</h1>
      <div className="mt-3 grid grid-cols-2 gap-1 rounded-2xl bg-white p-1 ring-1 ring-stone-200 dark:bg-stone-900 dark:ring-stone-800">
        <button onClick={() => setTab('fav')} className={`rounded-xl py-2 text-sm font-semibold ${tab === 'fav' ? 'bg-orange-600 text-white' : ''}`}>❤️ Favoris ({favorites.length})</button>
        <button onClick={() => setTab('hist')} className={`rounded-xl py-2 text-sm font-semibold ${tab === 'hist' ? 'bg-orange-600 text-white' : ''}`}>👨‍🍳 Historique ({history.length})</button>
      </div>
      <div className="mt-4 grid gap-2.5 md:grid-cols-2">
        {tab === 'fav' && favorites.map((id) => recipeById.get(id)).filter(Boolean).map((r) => <RecipeCard key={r!.id} r={r!} />)}
        {tab === 'hist' && history.map((h) => {
          const r = recipeById.get(h.id);
          if (!r) return null;
          return (
            <div key={`${h.id}-${h.at}`}>
              <p className="mb-1 text-xs text-stone-500">Cuisiné le {new Date(h.at).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
              <RecipeCard r={r} />
            </div>
          );
        })}
      </div>
      {((tab === 'fav' && !favorites.length) || (tab === 'hist' && !history.length)) && (
        <div className="py-16 text-center text-stone-500">
          <p className="text-5xl">{tab === 'fav' ? '🤍' : '🍳'}</p>
          <p className="mt-3">{tab === 'fav' ? 'Ajoute des recettes en favori avec le cœur.' : 'Les recettes marquées « Je l’ai cuisiné » apparaîtront ici.'}</p>
          <Link to="/repas" className="mt-3 inline-block font-semibold text-orange-600">Trouver des repas →</Link>
        </div>
      )}
    </div>
  );
}
