import type { Diet, EnrichedRecipe, Ingredient, Nutrition, Recipe, RecipeIngredient } from './types';

const UNIT_GRAMS: Record<string, number> = {
  g: 1, ml: 1, 'c.à.s': 15, 'c.à.c': 5, pincée: 0.5, tranche: 30, gousse: 5, brin: 2,
};
/** Poids par défaut d'une « pièce » quand l'ingrédient ne le précise pas. */
const DEFAULT_PIECE = 150;

export function grams(ri: RecipeIngredient, ing?: Ingredient): number {
  if (ri.qty == null) return 0;
  if (ri.unit === 'pièce') return ri.qty * (ing?.unitWeight ?? DEFAULT_PIECE);
  return ri.qty * (UNIT_GRAMS[ri.unit ?? 'g'] ?? 1);
}

export function enrich(r: Recipe, byId: Map<string, Ingredient>): EnrichedRecipe {
  const total: Nutrition = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
  const diet: Diet = { vegetarian: true, vegan: true, glutenFree: true, lactoseFree: true, noPork: true };
  for (const ri of r.ingredients) {
    const ing = byId.get(ri.id);
    if (!ing) continue;
    if (!ri.optional) {
      const g = grams(ri, ing) / 100;
      total.kcal += ing.nutritionPer100g.kcal * g;
      total.protein += ing.nutritionPer100g.protein * g;
      total.carbs += ing.nutritionPer100g.carbs * g;
      total.fat += ing.nutritionPer100g.fat * g;
      diet.vegetarian &&= ing.diet.vegetarian;
      diet.vegan &&= ing.diet.vegan;
      diet.glutenFree &&= ing.diet.glutenFree;
      diet.lactoseFree &&= ing.diet.lactoseFree;
      diet.noPork &&= !ing.diet.pork;
    }
  }
  const n = Math.max(1, r.servings);
  const nutrition = {
    kcal: Math.round(total.kcal / n),
    protein: Math.round(total.protein / n),
    carbs: Math.round(total.carbs / n),
    fat: Math.round(total.fat / n),
  };
  const isMain = r.mealTypes.includes('plat');
  return {
    ...r,
    nutrition,
    diet,
    hearty: isMain && (nutrition.kcal >= 700 || nutrition.protein >= 35),
    totalTime: r.prep + r.cook,
  };
}
