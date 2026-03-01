import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { mergeIngredients } from '../lib/units'
import type { ShoppingListItem } from '../lib/types'

const STORAGE_KEY = 'shopping-list-items'

export function useShoppingList() {
  const [items, setItems] = useState<ShoppingListItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const generate = useCallback(async (selections: Map<string, number>) => {
    const selectedIds = Array.from(selections.keys())
    if (selectedIds.length === 0) return

    setLoading(true)

    // Fetch all ingredients for selected recipes, along with recipe servings
    const { data: ingredients } = await supabase
      .from('recipe_ingredients')
      .select('*, recipes!inner(servings)')
      .in('recipe_id', selectedIds)

    if (!ingredients) {
      setLoading(false)
      return
    }

    // Scale each ingredient by the desired portions
    const scaled = ingredients.map((ing: any) => {
      const baseServings = ing.recipes.servings
      const desiredPortions = selections.get(ing.recipe_id) ?? baseServings
      const scaleFactor = desiredPortions / baseServings
      return {
        name: ing.name,
        quantity: ing.quantity * scaleFactor,
        unit: ing.unit,
      }
    })

    setItems(mergeIngredients(scaled))
    setLoading(false)
  }, [])

  const toggle = useCallback((name: string, unit: string) => {
    setItems(prev => prev.map(item =>
      item.name === name && item.unit === unit
        ? { ...item, checked: !item.checked }
        : item
    ))
  }, [])

  const clear = useCallback(() => {
    setItems([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  // Sort: unchecked first, then checked
  const sortedItems = [
    ...items.filter(i => !i.checked),
    ...items.filter(i => i.checked),
  ]

  return { items: sortedItems, loading, generate, toggle, clear, hasItems: items.length > 0 }
}
