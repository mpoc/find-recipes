export type IngredientUnit =
  | 'units' | 'g' | 'kg' | 'ml' | 'l' | 'cups' | 'tbsp' | 'tsp'

export const INGREDIENT_UNITS: IngredientUnit[] = [
  'units', 'g', 'kg', 'ml', 'l', 'cups', 'tbsp', 'tsp'
]

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
