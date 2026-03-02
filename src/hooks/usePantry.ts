import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Recipe, Vibe } from '../lib/types'
import { mapVibes } from '../lib/mapVibes'

const STORAGE_KEY = 'pantry-items'

export interface RecipeMatch {
  recipe: Recipe
  missingIngredients: string[]
  totalIngredients: number
}

export function usePantry() {
  const [pantryIds, setPantryIds] = useState<Set<string>>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? new Set(JSON.parse(stored)) : new Set()
  })
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [maxMissing, setMaxMissing] = useState(3)

  // Persist pantry selections
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...pantryIds]))
  }, [pantryIds])

  // Fetch all recipes with ingredients and vibes
  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('recipes')
        .select('*, recipe_ingredients(*), recipe_vibes(vibe)')
        .order('name')
      setRecipes((data ?? []).map(mapVibes))
      setLoading(false)
    }
    fetch()
  }, [])

  const toggle = (ingredientId: string) => {
    setPantryIds(prev => {
      const next = new Set(prev)
      if (next.has(ingredientId)) next.delete(ingredientId)
      else next.add(ingredientId)
      return next
    })
  }

  const has = (ingredientId: string) => pantryIds.has(ingredientId)

  // Compute recipe matches grouped by missing count, optionally filtered by vibes
  const getMatches = useCallback((vibeFilter: Set<Vibe>): Map<number, RecipeMatch[]> => {
    const grouped = new Map<number, RecipeMatch[]>()

    for (const recipe of recipes) {
      if (vibeFilter.size > 0) {
        const recipeVibes = recipe.vibes ?? []
        const hasAll = [...vibeFilter].every(v => recipeVibes.includes(v))
        if (!hasAll) continue
      }

      const ingredients = recipe.recipe_ingredients ?? []
      const missing = ingredients
        .filter(i => !i.ingredient_id || !pantryIds.has(i.ingredient_id))
        .map(i => i.name)
      const missingCount = missing.length

      if (missingCount <= maxMissing) {
        const list = grouped.get(missingCount) ?? []
        list.push({
          recipe,
          missingIngredients: missing,
          totalIngredients: ingredients.length,
        })
        grouped.set(missingCount, list)
      }
    }

    return grouped
  }, [recipes, pantryIds, maxMissing])

  return { pantryIds, toggle, has, getMatches, loading, maxMissing, setMaxMissing }
}
