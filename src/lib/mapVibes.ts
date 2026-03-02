import type { Recipe, Vibe } from './types'

/** Maps Supabase joined recipe_vibes rows into a flat vibes array on the recipe */
export function mapVibes(row: any): Recipe {
  const { recipe_vibes, ...rest } = row
  return {
    ...rest,
    vibes: (recipe_vibes ?? []).map((rv: { vibe: Vibe }) => rv.vibe),
  }
}
