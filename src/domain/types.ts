export type CategoryId =
  | 'viandes' | 'volailles' | 'poissons' | 'oeufs-laitiers' | 'fromages' | 'legumes' | 'fruits'
  | 'feculents' | 'legumineuses' | 'pains' | 'charcuterie' | 'herbes' | 'epices' | 'sauces'
  | 'conserves' | 'surgeles' | 'fruits-secs' | 'sucre';

export interface Nutrition { kcal: number; protein: number; carbs: number; fat: number }

export interface Ingredient {
  id: string;
  name: string;
  synonyms: string[];
  category: CategoryId;
  emoji: string;
  image?: string;
  isPantryDefault: boolean;
  /** Poids moyen d'une pièce en grammes (œuf, oignon…). */
  unitWeight?: number;
  diet: { vegetarian: boolean; vegan: boolean; glutenFree: boolean; lactoseFree: boolean; pork: boolean };
  nutritionPer100g: Nutrition;
  substitutes?: string[];
}

export type MealType = 'petit-dejeuner' | 'entree' | 'plat' | 'accompagnement' | 'dessert' | 'gouter' | 'apero';
export type Difficulty = 'facile' | 'moyen' | 'difficile';
export type Equipment = 'poele' | 'four' | 'casserole' | 'micro-ondes' | 'airfryer' | 'cocotte' | 'barbecue' | 'wok' | 'mixeur' | 'aucun';
export type Unit = 'g' | 'ml' | 'pièce' | 'c.à.s' | 'c.à.c' | 'pincée' | 'tranche' | 'gousse' | 'brin';

export interface RecipeIngredient {
  id: string;
  qty?: number;
  unit?: Unit;
  note?: string;
  optional?: boolean;
}

export interface Recipe {
  id: string;
  title: string;
  cuisine: string;
  mealTypes: MealType[];
  prep: number;
  cook: number;
  difficulty: Difficulty;
  servings: number;
  equipment: Equipment[];
  ingredients: RecipeIngredient[];
  steps: string[];
  tags: string[];
  image?: string;
}

export interface Diet { vegetarian: boolean; vegan: boolean; glutenFree: boolean; lactoseFree: boolean; noPork: boolean }

export interface EnrichedRecipe extends Recipe {
  nutrition: Nutrition; // par portion
  diet: Diet;
  hearty: boolean;
  totalTime: number;
}
