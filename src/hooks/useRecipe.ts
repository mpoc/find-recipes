import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Recipe } from '../lib/types'

export function useRecipe(id: string | undefined) {
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    async function fetch() {
      setLoading(true)
      const { data } = await supabase
        .from('recipes')
        .select('*, recipe_ingredients(*)')
        .eq('id', id)
        .single()
      setRecipe(data)
      setLoading(false)
    }

    fetch()
  }, [id])

  return { recipe, loading }
}
