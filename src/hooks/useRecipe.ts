import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Recipe } from '../lib/types'
import { mapVibes } from '../lib/mapVibes'

export function useRecipe(id: string | undefined) {
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    async function fetch() {
      setLoading(true)
      const { data } = await supabase
        .from('recipes')
        .select('*, recipe_ingredients(*), recipe_vibes(vibe)')
        .eq('id', id)
        .single()
      setRecipe(data ? mapVibes(data) : null)
      setLoading(false)
    }

    fetch()
  }, [id])

  return { recipe, loading }
}
