import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useRecipes } from '../hooks/useRecipes'
import { useVibeFilter } from '../hooks/useVibeFilter'
import RecipeCard from '../components/RecipeCard'
import VibeChips from '../components/VibeChips'

export default function RecipeListPage() {
  const { recipes, loading } = useRecipes()
  const { selectedVibes, toggleVibe, clearVibes } = useVibeFilter()

  const filtered = useMemo(() => {
    if (selectedVibes.size === 0) return recipes
    return recipes.filter(r => {
      const vibes = r.vibes ?? []
      return [...selectedVibes].every(v => vibes.includes(v))
    })
  }, [recipes, selectedVibes])

  if (loading) {
    return <div className="text-center text-gray-400 py-12">Loading...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">My Recipes</h2>
        <Link
          to="/recipes/new"
          className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + New
        </Link>
      </div>

      <VibeChips selectedVibes={selectedVibes} onToggle={toggleVibe} onClear={clearVibes} />

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 mb-4">
            {recipes.length === 0 ? 'No recipes yet' : 'No recipes match those vibes'}
          </p>
          {recipes.length === 0 && (
            <Link
              to="/recipes/new"
              className="text-indigo-600 font-medium hover:text-indigo-800"
            >
              Add your first recipe
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  )
}
