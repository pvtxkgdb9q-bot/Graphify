import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import FridgePage from './pages/FridgePage';
import MealsPage from './pages/MealsPage';
import RecipePage from './pages/RecipePage';
import FavoritesPage from './pages/FavoritesPage';
import ShoppingPage from './pages/ShoppingPage';
import SettingsPage from './pages/SettingsPage';
import { useStore } from './store/store';

const tabs = [
  { to: '/', label: 'Frigo', icon: '🧊' },
  { to: '/repas', label: 'Repas', icon: '🍽️' },
  { to: '/favoris', label: 'Favoris', icon: '❤️' },
  { to: '/courses', label: 'Courses', icon: '🛒' },
  { to: '/reglages', label: 'Réglages', icon: '⚙️' },
];

export default function App() {
  const shopping = useStore((s) => s.shopping.filter((x) => !x.done).length);
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (
    <div className="mx-auto min-h-screen max-w-5xl pb-24">
      <Routes>
        <Route path="/" element={<FridgePage />} />
        <Route path="/repas" element={<MealsPage />} />
        <Route path="/recette/:id" element={<RecipePage />} />
        <Route path="/favoris" element={<FavoritesPage />} />
        <Route path="/courses" element={<ShoppingPage />} />
        <Route path="/reglages" element={<SettingsPage />} />
        <Route path="*" element={<FridgePage />} />
      </Routes>
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur dark:border-stone-800 dark:bg-stone-950/95">
        <ul className="mx-auto grid max-w-5xl grid-cols-5">
          {tabs.map((t) => (
            <li key={t.to}>
              <NavLink
                to={t.to}
                end={t.to === '/'}
                className={({ isActive }) =>
                  `relative flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-xs font-medium ${isActive ? 'text-orange-600' : 'text-stone-500 dark:text-stone-400'}`}
              >
                <span className="text-xl" aria-hidden>{t.icon}</span>
                {t.label}
                {t.to === '/courses' && shopping > 0 && (
                  <span className="absolute right-[22%] top-1.5 rounded-full bg-orange-600 px-1.5 text-[10px] font-bold text-white">{shopping}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
