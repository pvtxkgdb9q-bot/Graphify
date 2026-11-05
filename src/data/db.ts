import { enrich } from '../domain/nutrition';
import { Matcher } from '../domain/matcher';
import { categories, ingredientById, ingredients } from './ingredients';
import { recipes } from './recipes';

export const enrichedRecipes = recipes.map((r) => enrich(r, ingredientById));
export const recipeById = new Map(enrichedRecipes.map((r) => [r.id, r]));
export const matcher = new Matcher(enrichedRecipes, ingredientById);
export { categories, ingredientById, ingredients };
