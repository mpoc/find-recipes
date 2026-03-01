import { useState, useRef, useEffect } from 'react'
import type { MasterIngredient } from '../lib/types'

interface Props {
  value: string
  ingredients: MasterIngredient[]
  onChange: (name: string, ingredientId?: string) => void
  placeholder?: string
}

export default function IngredientAutocomplete({ value, ingredients, onChange, placeholder }: Props) {
  const [query, setQuery] = useState(value)
  const [open, setOpen] = useState(false)
  const [focusIndex, setFocusIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setQuery(value) }, [value])

  const filtered = query.trim()
    ? ingredients.filter(i =>
        i.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : []

  const showDropdown = open && filtered.length > 0

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const select = (ing: MasterIngredient) => {
    setQuery(ing.name)
    onChange(ing.name, ing.id)
    setOpen(false)
    setFocusIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusIndex(prev => Math.min(prev + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && focusIndex >= 0) {
      e.preventDefault()
      select(filtered[focusIndex])
    }
  }

  return (
    <div ref={wrapperRef} className="relative flex-1 min-w-0">
      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={e => {
          setQuery(e.target.value)
          onChange(e.target.value)
          setOpen(true)
          setFocusIndex(-1)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
      />
      {showDropdown && (
        <ul className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filtered.map((ing, i) => (
            <li
              key={ing.id}
              onClick={() => select(ing)}
              className={`px-3 py-2 text-sm cursor-pointer ${
                i === focusIndex ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'
              }`}
            >
              {ing.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
