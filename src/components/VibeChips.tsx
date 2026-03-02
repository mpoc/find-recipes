import { VIBES, VIBE_LABELS, type Vibe } from '../lib/types'

interface Props {
  selectedVibes: Set<Vibe>
  onToggle: (vibe: Vibe) => void
  onClear?: () => void
}

export default function VibeChips({ selectedVibes, onToggle, onClear }: Props) {
  return (
    <div className="flex flex-wrap gap-1.5 mb-4">
      {VIBES.map(vibe => {
        const active = selectedVibes.has(vibe)
        return (
          <button
            key={vibe}
            type="button"
            onClick={() => onToggle(vibe)}
            className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-colors ${
              active
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-300'
            }`}
          >
            {VIBE_LABELS[vibe]}
          </button>
        )
      })}
      {selectedVibes.size > 0 && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="text-xs font-medium px-2.5 py-1 rounded-full text-gray-400 hover:text-gray-600"
        >
          Clear
        </button>
      )}
    </div>
  )
}
