import { Link } from 'react-router-dom'
import { useRecipes } from '../hooks/useRecipes'
import RecipeCard from '../components/RecipeCard'

export default function RecipeListPage() {
  const { recipes, loading } = useRecipes()

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

      {recipes.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 mb-4">No recipes yet</p>
          <Link
            to="/recipes/new"
            className="text-indigo-600 font-medium hover:text-indigo-800"
          >
            Add your first recipe
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  )
}
