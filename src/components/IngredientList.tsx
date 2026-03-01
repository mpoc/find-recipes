import type { MasterIngredient } from '../lib/types'
import IngredientRow, { type IngredientData } from './IngredientRow'

export type IngredientFormData = IngredientData

interface Props {
  ingredients: IngredientFormData[]
  masterIngredients: MasterIngredient[]
  onChange: (ingredients: IngredientFormData[]) => void
}

export default function IngredientList({ ingredients, masterIngredients, onChange }: Props) {
  const update = (index: number, updated: IngredientFormData) => {
    const next = [...ingredients]
    next[index] = updated
    onChange(next)
  }

  const remove = (index: number) => {
    onChange(ingredients.filter((_, i) => i !== index))
  }

  const add = () => {
    onChange([...ingredients, { name: '', quantity: 0, unit: 'units' }])
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Ingredients</label>
      {ingredients.map((ing, i) => (
        <IngredientRow
          key={i}
          ingredient={ing}
          masterIngredients={masterIngredients}
          onChange={updated => update(i, updated)}
          onRemove={() => remove(i)}
        />
      ))}
      <button
        type="button"
        onClick={add}
        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
      >
        + Add ingredient
      </button>
    </div>
  )
}
