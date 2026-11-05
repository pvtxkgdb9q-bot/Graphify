import { memo } from 'react';
import type { Ingredient } from '../domain/types';
import IngredientImage from './IngredientImage';

function IngredientCard({ ing, selected, onToggle, pantry }: { ing: Ingredient; selected: boolean; onToggle: (id: string) => void; pantry?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(ing.id)}
      aria-pressed={selected}
      className={`relative flex flex-col items-center gap-1 rounded-2xl bg-white p-2 pb-2.5 text-center shadow-sm ring-2 transition active:scale-95 dark:bg-stone-900 ${selected ? 'ring-orange-500 bg-orange-50 dark:bg-orange-950/40' : 'ring-transparent hover:ring-stone-200 dark:hover:ring-stone-700'}`}
    >
      {selected && <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-orange-600 text-xs font-bold text-white">✓</span>}
      {pantry && !selected && <span className="absolute left-1.5 top-1.5 rounded-full bg-emerald-100 px-1.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200" title="Dans le placard de base">placard</span>}
      <IngredientImage ing={ing} className="h-16 w-16 sm:h-20 sm:w-20" />
      <span className="line-clamp-2 text-[13px] font-medium leading-tight">{ing.name}</span>
    </button>
  );
}
export default memo(IngredientCard);
