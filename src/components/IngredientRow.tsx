import type { IngredientUnit, MasterIngredient } from '../lib/types'
import UnitSelect from './UnitSelect'
import IngredientAutocomplete from './IngredientAutocomplete'

export interface IngredientData {
  id?: string
  ingredientId?: string
  name: string
  quantity: number
  unit: IngredientUnit
}

interface Props {
  ingredient: IngredientData
  masterIngredients: MasterIngredient[]
  onChange: (updated: IngredientData) => void
  onRemove: () => void
}

export default function IngredientRow({ ingredient, masterIngredients, onChange, onRemove }: Props) {
  return (
    <div className="flex gap-2 items-center">
      <IngredientAutocomplete
        value={ingredient.name}
        ingredients={masterIngredients}
        onChange={(name, ingredientId) =>
          onChange({ ...ingredient, name, ingredientId: ingredientId ?? ingredient.ingredientId })
        }
        placeholder="Ingredient name"
      />
      <input
        type="number"
        placeholder="Qty"
        value={ingredient.quantity || ''}
        onChange={e => onChange({ ...ingredient, quantity: parseFloat(e.target.value) || 0 })}
        className="w-16 border border-gray-300 rounded-lg px-2 py-2 text-sm"
        min="0"
        step="any"
      />
      <UnitSelect
        value={ingredient.unit}
        onChange={unit => onChange({ ...ingredient, unit })}
      />
      <button
        type="button"
        onClick={onRemove}
        className="text-red-500 hover:text-red-700 p-1 shrink-0"
        aria-label="Remove ingredient"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  )
}
