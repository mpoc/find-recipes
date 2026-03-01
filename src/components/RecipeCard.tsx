import { Link } from 'react-router-dom'
import type { Recipe } from '../lib/types'

interface Props {
  recipe: Recipe
}

export default function RecipeCard({ recipe }: Props) {
  return (
    <Link
      to={`/recipes/${recipe.id}`}
      className="block border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all"
    >
      <h3 className="font-semibold text-gray-900">{recipe.name}</h3>
      {recipe.description && (
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{recipe.description}</p>
      )}
      <p className="text-xs text-gray-400 mt-2">{recipe.servings} serving{recipe.servings !== 1 ? 's' : ''}</p>
    </Link>
  )
}
