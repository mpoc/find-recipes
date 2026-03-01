import { useState } from 'react'
import { useRecipes } from '../hooks/useRecipes'
import { useShoppingList } from '../hooks/useShoppingList'
import ShoppingListItemComponent from '../components/ShoppingListItem'

export default function ShoppingListPage() {
  const { recipes, loading: loadingRecipes } = useRecipes()
  const { items, loading: generating, generate, toggle, clear, hasItems } = useShoppingList()
  const [selections, setSelections] = useState<Map<string, number>>(new Map())

  const toggleRecipe = (recipeId: string, baseServings: number) => {
    setSelections(prev => {
      const next = new Map(prev)
      if (next.has(recipeId)) {
        next.delete(recipeId)
      } else {
        next.set(recipeId, baseServings)
      }
      return next
    })
  }

  const setPortions = (recipeId: string, portions: number) => {
    setSelections(prev => {
      const next = new Map(prev)
      next.set(recipeId, Math.max(1, portions))
      return next
    })
  }

  const handleGenerate = () => {
    generate(selections)
  }

  if (loadingRecipes) {
    return <div className="text-center text-gray-400 py-12">Loading...</div>
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Shopping List</h2>

      {/* Recipe selection */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
          Select recipes
        </h3>
        {recipes.length === 0 ? (
          <p className="text-sm text-gray-400">No recipes yet. Add some first!</p>
        ) : (
          <div className="space-y-2">
            {recipes.map(recipe => {
              const isSelected = selections.has(recipe.id)
              return (
                <div
                  key={recipe.id}
                  className={`border rounded-lg p-3 transition-colors ${
                    isSelected ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleRecipe(recipe.id, recipe.servings)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'
                      }`}
                    >
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <span className="flex-1 text-sm font-medium text-gray-900">{recipe.name}</span>
                    {isSelected && (
                      <div className="flex items-center gap-1">
                        <label className="text-xs text-gray-500">Portions:</label>
                        <input
                          type="number"
                          value={selections.get(recipe.id) ?? recipe.servings}
                          onChange={e => setPortions(recipe.id, parseInt(e.target.value) || 1)}
                          className="w-14 border border-gray-300 rounded px-2 py-1 text-sm text-center"
                          min="1"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {selections.size > 0 && (
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="mt-4 w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {generating ? 'Generating...' : 'Generate Shopping List'}
          </button>
        )}
      </div>

      {/* Shopping list results */}
      {hasItems && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Your list
            </h3>
            <button
              onClick={clear}
              className="text-xs text-red-500 hover:text-red-700"
            >
              Clear list
            </button>
          </div>
          <div className="border border-gray-200 rounded-xl divide-y divide-gray-100">
            {items.map((item) => (
              <ShoppingListItemComponent
                key={`${item.name}-${item.unit}`}
                item={item}
                onToggle={() => toggle(item.name, item.unit)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
