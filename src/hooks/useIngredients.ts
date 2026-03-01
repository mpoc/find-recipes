import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { MasterIngredient } from '../lib/types'

export function useIngredients() {
  const [ingredients, setIngredients] = useState<MasterIngredient[]>([])

  async function fetchIngredients() {
    const { data } = await supabase
      .from('ingredients')
      .select('*')
      .order('name')
    setIngredients(data ?? [])
  }

  useEffect(() => { fetchIngredients() }, [])

  async function findOrCreate(name: string): Promise<MasterIngredient> {
    const trimmed = name.trim()
    // Check if it already exists (case-insensitive)
    const existing = ingredients.find(
      i => i.name.toLowerCase() === trimmed.toLowerCase()
    )
    if (existing) return existing

    // Create new
    const { data } = await supabase
      .from('ingredients')
      .insert({ name: trimmed })
      .select()
      .single()

    if (data) {
      setIngredients(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
      return data
    }

    // If insert failed (e.g. race condition duplicate), try fetching
    const { data: fetched } = await supabase
      .from('ingredients')
      .select('*')
      .ilike('name', trimmed)
      .single()

    return fetched!
  }

  return { ingredients, findOrCreate, refetch: fetchIngredients }
}
