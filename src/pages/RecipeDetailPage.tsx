import { useParams, useNavigate, Link } from 'react-router-dom'
import { useRecipe } from '../hooks/useRecipe'
import { supabase } from '../lib/supabase'

export default function RecipeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { recipe, loading } = useRecipe(id)

  if (loading) {
    return <div className="text-center text-gray-400 py-12">Loading...</div>
  }

  if (!recipe) {
    return <div className="text-center text-gray-400 py-12">Recipe not found</div>
  }

  const handleDelete = async () => {
    if (!confirm('Delete this recipe?')) return
    await supabase.from('recipes').delete().eq('id', recipe.id)
    navigate('/')
  }

  return (
    <div>
      <button
        onClick={() => navigate('/')}
        className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block"
      >
        &larr; Back
      </button>

      <h2 className="text-2xl font-bold text-gray-900 mb-1">{recipe.name}</h2>
      {recipe.description && (
        <p className="text-gray-500 mb-4">{recipe.description}</p>
      )}
      <p className="text-sm text-gray-400 mb-6">
        {recipe.servings} serving{recipe.servings !== 1 ? 's' : ''}
      </p>

      {recipe.recipe_ingredients && recipe.recipe_ingredients.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Ingredients</h3>
          <ul className="space-y-1">
            {recipe.recipe_ingredients.map(ing => (
              <li key={ing.id} className="text-sm text-gray-800 py-1 border-b border-gray-100 last:border-0">
                {ing.quantity} {ing.unit} &mdash; {ing.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-3">
        <Link
          to={`/recipes/${recipe.id}/edit`}
          className="flex-1 text-center bg-indigo-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Edit
        </Link>
        <button
          onClick={handleDelete}
          className="flex-1 text-center border border-red-300 text-red-600 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-red-50 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
