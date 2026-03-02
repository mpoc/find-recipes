export type IngredientUnit =
  | 'units' | 'g' | 'kg' | 'ml' | 'l' | 'cups' | 'tbsp' | 'tsp'

export const INGREDIENT_UNITS: IngredientUnit[] = [
  'units', 'g', 'kg', 'ml', 'l', 'cups', 'tbsp', 'tsp'
]

export type Vibe =
  | 'vegetarian' | 'vegan' | 'comfort' | 'quick' | 'spicy'
  | 'soup' | 'curry' | 'pasta' | 'roast' | 'stir-fry'
  | 'pie' | 'one-pot' | 'classic-combo'

export const VIBES: Vibe[] = [
  'vegetarian', 'vegan', 'comfort', 'quick', 'spicy',
  'soup', 'curry', 'pasta', 'roast', 'stir-fry',
  'pie', 'one-pot', 'classic-combo',
]

export const VIBE_LABELS: Record<Vibe, string> = {
  'vegetarian': 'Vegetarian',
  'vegan': 'Vegan',
  'comfort': 'Comfort',
  'quick': 'Quick',
  'spicy': 'Spicy',
  'soup': 'Soup',
  'curry': 'Curry',
  'pasta': 'Pasta',
  'roast': 'Roast',
  'stir-fry': 'Stir Fry',
  'pie': 'Pie',
  'one-pot': 'One Pot',
  'classic-combo': 'Classic Combo',
}

export interface MasterIngredient {
  id: string
  name: string
}

export interface Ingredient {
  id: string
  recipe_id: string
  ingredient_id: string | null
  name: string
  quantity: number
  unit: IngredientUnit
}

export interface Recipe {
  id: string
  name: string
  description: string | null
  servings: number
  created_at: string
  updated_at: string
  recipe_ingredients?: Ingredient[]
  vibes?: Vibe[]
}

export interface SelectedRecipe {
  recipeId: string
  portions: number
}

export interface ShoppingListItem {
  name: string
  quantity: number
  unit: IngredientUnit
  checked: boolean
}
