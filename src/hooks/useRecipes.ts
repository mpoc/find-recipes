import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Recipe } from '../lib/types'

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchRecipes() {
    setLoading(true)
    const { data } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false })
    setRecipes(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchRecipes() }, [])

  return { recipes, loading, refetch: fetchRecipes }
}
