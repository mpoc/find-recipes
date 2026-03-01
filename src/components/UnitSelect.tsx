import { INGREDIENT_UNITS, type IngredientUnit } from '../lib/types'

interface Props {
  value: IngredientUnit
  onChange: (unit: IngredientUnit) => void
}

export default function UnitSelect({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value as IngredientUnit)}
      className="border border-gray-300 rounded-lg px-2 py-2 text-sm bg-white"
    >
      {INGREDIENT_UNITS.map(u => (
        <option key={u} value={u}>{u}</option>
      ))}
    </select>
  )
}
