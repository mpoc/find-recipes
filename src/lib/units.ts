import type { IngredientUnit, ShoppingListItem } from './types'

interface UnitInfo {
  family: string
  factor: number
}

const UNIT_INFO: Record<IngredientUnit, UnitInfo> = {
  g:     { family: 'mass',   factor: 1 },
  kg:    { family: 'mass',   factor: 1000 },
  ml:    { family: 'volume', factor: 1 },
  l:     { family: 'volume', factor: 1000 },
  cups:  { family: 'volume', factor: 236.588 },
  tbsp:  { family: 'volume', factor: 14.787 },
  tsp:   { family: 'volume', factor: 4.929 },
  units: { family: 'count',  factor: 1 },
}

function toBase(quantity: number, unit: IngredientUnit): { family: string; base: number } {
  const info = UNIT_INFO[unit]
  return { family: info.family, base: quantity * info.factor }
}

function fromBase(base: number, family: string): { quantity: number; unit: IngredientUnit } {
  if (family === 'count') {
    return { quantity: +base.toFixed(1), unit: 'units' }
  }
  if (family === 'mass') {
    return base >= 1000
      ? { quantity: +(base / 1000).toFixed(2), unit: 'kg' }
      : { quantity: +base.toFixed(1), unit: 'g' }
  }
  // volume
  if (base >= 1000) return { quantity: +(base / 1000).toFixed(2), unit: 'l' }
  return { quantity: +base.toFixed(1), unit: 'ml' }
}

interface ScaledIngredient {
  name: string
  quantity: number
  unit: IngredientUnit
}

export function mergeIngredients(ingredients: ScaledIngredient[]): ShoppingListItem[] {
  // Group by (lowercase name, unit family)
  const groups = new Map<string, { name: string; family: string; base: number }>()

  for (const ing of ingredients) {
    const { family, base } = toBase(ing.quantity, ing.unit)
    const key = `${ing.name.toLowerCase()}::${family}`

    const existing = groups.get(key)
    if (existing) {
      existing.base += base
    } else {
      groups.set(key, { name: ing.name, family, base })
    }
  }

  const result: ShoppingListItem[] = []
  for (const group of groups.values()) {
    const { quantity, unit } = fromBase(group.base, group.family)
    result.push({
      name: group.name,
      quantity,
      unit,
      checked: false,
    })
  }

  return result.sort((a, b) => a.name.localeCompare(b.name))
}
