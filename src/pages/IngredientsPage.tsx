import { useState, useRef } from 'react'
import { useIngredients, type IngredientWithCount } from '../hooks/useIngredients'

export default function IngredientsPage() {
  const { ingredients, rename, merge, remove } = useIngredients()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [mergeTargetId, setMergeTargetId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const startEdit = (ingredient: IngredientWithCount) => {
    setEditingId(ingredient.id)
    setEditValue(ingredient.name)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const commitEdit = async () => {
    if (editingId && editValue.trim()) {
      const original = ingredients.find(i => i.id === editingId)
      if (original && editValue.trim() !== original.name) {
        await rename(editingId, editValue)
      }
    }
    setEditingId(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') commitEdit()
    if (e.key === 'Escape') setEditingId(null)
  }

  const startMerge = () => {
    // Default to the first selected ingredient as the target
    const first = ingredients.find(i => selected.has(i.id))
    if (first) setMergeTargetId(first.id)
  }

  const confirmMerge = async () => {
    if (!mergeTargetId) return
    const mergeIds = [...selected].filter(id => id !== mergeTargetId)
    await merge(mergeTargetId, mergeIds)
    setSelected(new Set())
    setMergeTargetId(null)
  }

  const cancelMerge = () => {
    setMergeTargetId(null)
  }

  const selectedIngredients = ingredients.filter(i => selected.has(i.id))

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Ingredients</h2>

      {/* Merge bar */}
      {selected.size >= 2 && !mergeTargetId && (
        <div className="mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-between">
          <span className="text-sm text-indigo-700">{selected.size} selected</span>
          <button
            onClick={startMerge}
            className="text-sm font-medium text-white bg-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-700"
          >
            Merge
          </button>
        </div>
      )}

      {/* Merge target picker */}
      {mergeTargetId && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm font-medium text-amber-800 mb-2">Keep which name?</p>
          <div className="space-y-1 mb-3">
            {selectedIngredients.map(i => (
              <label key={i.id} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="merge-target"
                  checked={mergeTargetId === i.id}
                  onChange={() => setMergeTargetId(i.id)}
                  className="accent-amber-600"
                />
                <span className={mergeTargetId === i.id ? 'font-medium text-amber-900' : 'text-amber-700'}>
                  {i.name}
                </span>
              </label>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={confirmMerge}
              className="text-sm font-medium text-white bg-amber-600 px-3 py-1.5 rounded-lg hover:bg-amber-700"
            >
              Confirm merge
            </button>
            <button
              onClick={cancelMerge}
              className="text-sm text-amber-700 px-3 py-1.5 hover:text-amber-900"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Ingredient list */}
      {ingredients.length === 0 ? (
        <p className="text-sm text-gray-400 py-8 text-center">No ingredients yet.</p>
      ) : (
        <div className="border border-gray-200 rounded-xl divide-y divide-gray-100">
          {ingredients.map(ingredient => (
            <div
              key={ingredient.id}
              className="flex items-center gap-3 px-3 py-2.5"
            >
              {/* Checkbox for merge selection */}
              <button
                onClick={() => toggleSelect(ingredient.id)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                  selected.has(ingredient.id) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'
                }`}
              >
                {selected.has(ingredient.id) && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              {/* Name (editable) */}
              <div className="flex-1 min-w-0">
                {editingId === ingredient.id ? (
                  <input
                    ref={inputRef}
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    onBlur={commitEdit}
                    onKeyDown={handleKeyDown}
                    className="w-full text-sm border border-indigo-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                ) : (
                  <button
                    onClick={() => startEdit(ingredient)}
                    className="text-sm text-gray-900 hover:text-indigo-600 text-left truncate w-full"
                  >
                    {ingredient.name}
                  </button>
                )}
              </div>

              {/* Usage count */}
              <span className="text-xs text-gray-400 shrink-0">
                {ingredient.usage_count} {ingredient.usage_count === 1 ? 'recipe' : 'recipes'}
              </span>

              {/* Delete button (only if unused) */}
              {ingredient.usage_count === 0 && (
                <button
                  onClick={() => remove(ingredient.id)}
                  className="text-gray-300 hover:text-red-500 shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
