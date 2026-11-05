import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DietKey } from '../domain/matcher';
import { ingredients } from '../data/ingredients';

export interface HistoryEntry { id: string; at: number }

interface State {
  fridge: string[];
  pantry: string[];
  favorites: string[];
  history: HistoryEntry[];
  shopping: { id: string; done: boolean }[];
  usage: Record<string, number>;
  bigEater: boolean;
  bigEaterFactor: number;
  defaultServings: number;
  diets: DietKey[];
  disliked: string[];
  toggleFridge: (id: string) => void;
  clearFridge: () => void;
  addToFridge: (ids: string[]) => void;
  togglePantry: (id: string) => void;
  resetPantry: () => void;
  toggleFavorite: (id: string) => void;
  markCooked: (id: string) => void;
  addShopping: (ids: string[]) => void;
  toggleShopping: (id: string) => void;
  removeShopping: (id: string) => void;
  boughtToFridge: () => void;
  set: (p: Partial<State>) => void;
  toggleDiet: (d: DietKey) => void;
  toggleDisliked: (id: string) => void;
  resetAll: () => void;
}

const defaultPantry = () => ingredients.filter((i) => i.isPantryDefault).map((i) => i.id);
const toggle = (arr: string[], id: string) => (arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);

const initial = {
  fridge: [] as string[],
  pantry: defaultPantry(),
  favorites: [] as string[],
  history: [] as HistoryEntry[],
  shopping: [] as { id: string; done: boolean }[],
  usage: {} as Record<string, number>,
  bigEater: true,
  bigEaterFactor: 1.5,
  defaultServings: 2,
  diets: [] as DietKey[],
  disliked: [] as string[],
};

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      ...initial,
      toggleFridge: (id) => {
        const adding = !get().fridge.includes(id);
        set((s) => ({
          fridge: toggle(s.fridge, id),
          usage: adding ? { ...s.usage, [id]: (s.usage[id] ?? 0) + 1 } : s.usage,
        }));
      },
      clearFridge: () => set({ fridge: [] }),
      addToFridge: (ids) => set((s) => ({ fridge: [...new Set([...s.fridge, ...ids])] })),
      togglePantry: (id) => set((s) => ({ pantry: toggle(s.pantry, id) })),
      resetPantry: () => set({ pantry: defaultPantry() }),
      toggleFavorite: (id) => set((s) => ({ favorites: toggle(s.favorites, id) })),
      markCooked: (id) => set((s) => ({ history: [{ id, at: Date.now() }, ...s.history].slice(0, 200) })),
      addShopping: (ids) => set((s) => ({
        shopping: [...s.shopping, ...ids.filter((id) => !s.shopping.some((x) => x.id === id)).map((id) => ({ id, done: false }))],
      })),
      toggleShopping: (id) => set((s) => ({ shopping: s.shopping.map((x) => (x.id === id ? { ...x, done: !x.done } : x)) })),
      removeShopping: (id) => set((s) => ({ shopping: s.shopping.filter((x) => x.id !== id) })),
      boughtToFridge: () => set((s) => ({
        fridge: [...new Set([...s.fridge, ...s.shopping.filter((x) => x.done).map((x) => x.id)])],
        shopping: s.shopping.filter((x) => !x.done),
      })),
      set: (p) => set(p),
      toggleDiet: (d) => set((s) => ({ diets: s.diets.includes(d) ? s.diets.filter((x) => x !== d) : [...s.diets, d] })),
      toggleDisliked: (id) => set((s) => ({ disliked: toggle(s.disliked, id) })),
      resetAll: () => set({ ...initial, pantry: defaultPantry() }),
    }),
    { name: 'frigo-festin', version: 1 },
  ),
);
