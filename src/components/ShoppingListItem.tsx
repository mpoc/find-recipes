import type { ShoppingListItem as Item } from '../lib/types'

interface Props {
  item: Item
  onToggle: () => void
}

export default function ShoppingListItem({ item, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-3 w-full text-left py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
        item.checked ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'
      }`}>
        {item.checked && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className={`flex-1 text-sm ${item.checked ? 'line-through text-gray-400' : 'text-gray-900'}`}>
        {item.name}
      </span>
      <span className={`text-sm ${item.checked ? 'text-gray-300' : 'text-gray-500'}`}>
        {item.quantity} {item.unit}
      </span>
    </button>
  )
}
