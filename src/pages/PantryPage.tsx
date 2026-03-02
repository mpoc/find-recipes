import { useState, useMemo } from 'react'
import { useIngredients } from '../hooks/useIngredients'
import { usePantry } from '../hooks/usePantry'
import { useVibeFilter } from '../hooks/useVibeFilter'
import VibeChips from '../components/VibeChips'

export default function PantryPage() {
  const { ingredients } = useIngredients()
  const { toggle, has, getMatches, loading, maxMissing, setMaxMissing } = usePantry()
  const { selectedVibes, toggleVibe, clearVibes } = useVibeFilter()
  const [search, setSearch] = useState('')

  const matches = useMemo(() => getMatches(selectedVibes), [getMatches, selectedVibes])

  const filteredIngredients = search
    ? ingredients.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
    : ingredients

  const sortedMissingCounts = [...matches.keys()].sort((a, b) => a - b)

  if (loading) {
    return <div className="text-center text-gray-400 py-12">Loading...</div>
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Pantry</h2>

      {/* Ingredient selection */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
          What do you have?
        </h3>

        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search ingredients..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
        />

        <div className="border border-gray-200 rounded-xl divide-y divide-gray-100 max-h-64 overflow-y-auto">
          {filteredIngredients.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">
              {search ? 'No matching ingredients' : 'No ingredients yet'}
            </p>
          ) : (
            filteredIngredients.map(ingredient => {
              const checked = has(ingredient.id)
              return (
                <button
                  key={ingredient.id}
                  onClick={() => toggle(ingredient.id)}
                  className="flex items-center gap-3 px-3 py-2.5 w-full text-left hover:bg-gray-50"
                >
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                      checked ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'
                    }`}
                  >
                    {checked && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-gray-900">{ingredient.name}</span>
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* Threshold control */}
      <div className="mb-4 flex items-center gap-3">
        <label className="text-sm text-gray-600">Show recipes missing up to</label>
        <input
          type="number"
          value={maxMissing}
          onChange={e => setMaxMissing(Math.max(0, parseInt(e.target.value) || 0))}
          className="w-14 border border-gray-300 rounded px-2 py-1 text-sm text-center"
          min="0"
        />
        <span className="text-sm text-gray-600">ingredients</span>
      </div>

      {/* Recipe suggestions */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
          Recipes you can make
        </h3>

        <VibeChips selectedVibes={selectedVibes} onToggle={toggleVibe} onClear={clearVibes} />

        {sortedMissingCounts.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">
            Select ingredients above to see recipe suggestions
          </p>
        ) : (
          <div className="space-y-4">
            {sortedMissingCounts.map(count => (
              <div key={count}>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  {count === 0
                    ? 'Ready to make'
                    : `${count} ingredient${count > 1 ? 's' : ''} away`}
                </h4>
                <div className="space-y-2">
                  {matches.get(count)!.map(({ recipe, missingIngredients, totalIngredients }) => (
                    <div
                      key={recipe.id}
                      className={`border rounded-lg p-3 ${
                        count === 0 ? 'border-green-200 bg-green-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{recipe.name}</span>
                        <span className="text-xs text-gray-400">
                          {totalIngredients - missingIngredients.length}/{totalIngredients}
                        </span>
                      </div>
                      {missingIngredients.length > 0 && (
                        <p className="text-xs text-red-500">
                          Missing: {missingIngredients.join(', ')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
