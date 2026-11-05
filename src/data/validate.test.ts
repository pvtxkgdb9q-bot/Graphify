import { describe, expect, it } from 'vitest';
import { ingredientById, ingredients, categories } from './ingredients';
import { recipes } from './recipes';
import { enrichedRecipes, matcher } from './db';

describe('base de données', () => {
  it('contient au moins 600 ingrédients et 1500 recettes', () => {
    expect(ingredients.length).toBeGreaterThanOrEqual(600);
    expect(recipes.length).toBeGreaterThanOrEqual(1500);
  });

  it('ids d’ingrédients uniques, catégorie valide, visuel présent', () => {
    expect(new Set(ingredients.map((i) => i.id)).size).toBe(ingredients.length);
    const cats = new Set(categories.map((c) => c.id));
    for (const i of ingredients) {
      expect(cats.has(i.category), i.id).toBe(true);
      expect(i.emoji || i.image, i.id).toBeTruthy();
    }
  });

  it('substitutions pointant vers des ingrédients existants', () => {
    for (const i of ingredients) for (const s of i.substitutes ?? []) expect(ingredientById.has(s), `${i.id} -> ${s}`).toBe(true);
  });

  it('chaque recette référence des ingrédients existants, a ≥ 2 ingrédients obligatoires et ≥ 1 étape', () => {
    const errors: string[] = [];
    for (const r of recipes) {
      for (const ri of r.ingredients) if (!ingredientById.has(ri.id)) errors.push(`${r.title}: ${ri.id}`);
      if (r.ingredients.filter((x) => !x.optional).length < 2) errors.push(`${r.title}: trop peu d'ingrédients`);
      if (r.steps.length < 1) errors.push(`${r.title}: aucune étape`);
      if (/undefined|\s{2}/.test(r.title + r.steps.join(' '))) errors.push(`${r.title}: texte invalide`);
    }
    expect([...new Set(errors)]).toEqual([]);
  });

  it('ids de recettes uniques', () => {
    expect(new Set(recipes.map((r) => r.id)).size).toBe(recipes.length);
  });
});

describe('moteur de suggestion', () => {
  const pantry = new Set(ingredients.filter((i) => i.isPantryDefault).map((i) => i.id));

  it('propose ≥ 5 recettes réalisables avec œufs, pommes de terre, oignon, fromage', () => {
    const fridge = new Set(['oeufs', 'pomme-de-terre', 'oignon', 'emmental-rape']);
    const m = matcher.match({ fridge, pantry });
    expect(m.filter((x) => x.group === 'ready').length).toBeGreaterThanOrEqual(5);
  });

  it('propose ≥ 20 suggestions avec 8 ingrédients courants', () => {
    const fridge = new Set(['oeufs', 'pomme-de-terre', 'oignon', 'emmental-rape', 'blanc-de-poulet', 'creme-liquide', 'tomate', 'spaghetti']);
    expect(matcher.match({ fridge, pantry }).length).toBeGreaterThanOrEqual(20);
  });

  it('reconnaît une substitution (gruyère pour emmental)', () => {
    const fridge = new Set(['gruyere', 'jambon-blanc', 'pain-de-mie']);
    const m = matcher.match({ fridge, pantry });
    const croque = m.find((x) => x.recipe.id === 'croque-monsieur-jambon-emmental');
    expect(croque?.subs.some((s) => s.via === 'gruyere')).toBe(true);
  });

  it('le filtre végétarien exclut viande et poisson', () => {
    const fridge = new Set(['oeufs', 'pomme-de-terre', 'tomate', 'riz-blanc', 'courgette']);
    for (const x of matcher.match({ fridge, pantry, diets: ['vegetarian'] })) {
      for (const ri of x.recipe.ingredients.filter((r) => !r.optional)) {
        expect(ingredientById.get(ri.id)!.diet.vegetarian, `${x.recipe.title}: ${ri.id}`).toBe(true);
      }
    }
  });

  it('calcule les suggestions en moins de 100 ms', () => {
    const fridge = new Set(ingredients.slice(0, 60).map((i) => i.id));
    const t = performance.now();
    matcher.match({ fridge, pantry });
    expect(performance.now() - t).toBeLessThan(100);
  });

  it('a une majorité de plats copieux', () => {
    const plats = enrichedRecipes.filter((r) => r.mealTypes.includes('plat'));
    expect(plats.filter((r) => r.hearty).length / plats.length).toBeGreaterThan(0.5);
  });
});
