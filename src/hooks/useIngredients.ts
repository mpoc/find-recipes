import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { MasterIngredient } from '../lib/types'

export interface IngredientWithCount extends MasterIngredient {
  usage_count: number
}

export function useIngredients() {
  const [ingredients, setIngredients] = useState<IngredientWithCount[]>([])

  async function fetchIngredients() {
    const { data: allIngredients } = await supabase
      .from('ingredients')
      .select('*')
      .order('name')

    if (!allIngredients) {
      setIngredients([])
      return
    }

    // Get usage counts
    const { data: usages } = await supabase
      .from('recipe_ingredients')
      .select('ingredient_id')

    const counts = new Map<string, number>()
    for (const row of usages ?? []) {
      if (row.ingredient_id) {
        counts.set(row.ingredient_id, (counts.get(row.ingredient_id) ?? 0) + 1)
      }
    }

    setIngredients(
      allIngredients.map(i => ({
        ...i,
        usage_count: counts.get(i.id) ?? 0,
      }))
    )
  }

  useEffect(() => { fetchIngredients() }, [])

  async function findOrCreate(name: string): Promise<MasterIngredient> {
    const trimmed = name.trim()
    const existing = ingredients.find(
      i => i.name.toLowerCase() === trimmed.toLowerCase()
    )
    if (existing) return existing

    const { data } = await supabase
      .from('ingredients')
      .insert({ name: trimmed })
      .select()
      .single()

    if (data) {
      setIngredients(prev => [...prev, { ...data, usage_count: 0 }].sort((a, b) => a.name.localeCompare(b.name)))
      return data
    }

    const { data: fetched } = await supabase
      .from('ingredients')
      .select('*')
      .ilike('name', trimmed)
      .single()

    return fetched!
  }

  async function rename(id: string, newName: string): Promise<boolean> {
    const trimmed = newName.trim()
    if (!trimmed) return false

    // Check for name collision
    const existing = ingredients.find(
      i => i.id !== id && i.name.toLowerCase() === trimmed.toLowerCase()
    )
    if (existing) return false

    // Update master ingredient
    const { error } = await supabase
      .from('ingredients')
      .update({ name: trimmed })
      .eq('id', id)
    if (error) return false

    // Update all recipe_ingredients that reference this ingredient
    await supabase
      .from('recipe_ingredients')
      .update({ name: trimmed })
      .eq('ingredient_id', id)

    await fetchIngredients()
    return true
  }

  async function merge(keepId: string, mergeIds: string[]): Promise<void> {
    const kept = ingredients.find(i => i.id === keepId)
    if (!kept) return

    // Point all recipe_ingredients from merged ingredients to the kept one
    for (const mergeId of mergeIds) {
      await supabase
        .from('recipe_ingredients')
        .update({ ingredient_id: keepId, name: kept.name })
        .eq('ingredient_id', mergeId)

      // Delete the merged ingredient
      await supabase
        .from('ingredients')
        .delete()
        .eq('id', mergeId)
    }

    await fetchIngredients()
  }

  async function remove(id: string): Promise<boolean> {
    const ingredient = ingredients.find(i => i.id === id)
    if (!ingredient || ingredient.usage_count > 0) return false

    const { error } = await supabase
      .from('ingredients')
      .delete()
      .eq('id', id)

    if (error) return false
    await fetchIngredients()
    return true
  }

  return { ingredients, findOrCreate, rename, merge, remove, refetch: fetchIngredients }
}
