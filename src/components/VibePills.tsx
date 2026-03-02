import { VIBE_LABELS, type Vibe } from '../lib/types'

interface Props {
  vibes: Vibe[]
}

export default function VibePills({ vibes }: Props) {
  if (vibes.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1">
      {vibes.map(vibe => (
        <span
          key={vibe}
          className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500"
        >
          {VIBE_LABELS[vibe]}
        </span>
      ))}
    </div>
  )
}
