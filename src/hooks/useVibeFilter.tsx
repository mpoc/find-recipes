import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Vibe } from '../lib/types'

interface VibeFilterState {
  selectedVibes: Set<Vibe>
  toggleVibe: (vibe: Vibe) => void
  clearVibes: () => void
}

const VibeFilterContext = createContext<VibeFilterState | null>(null)

export function VibeFilterProvider({ children }: { children: ReactNode }) {
  const [selectedVibes, setSelectedVibes] = useState<Set<Vibe>>(new Set())

  const toggleVibe = useCallback((vibe: Vibe) => {
    setSelectedVibes(prev => {
      const next = new Set(prev)
      if (next.has(vibe)) next.delete(vibe)
      else next.add(vibe)
      return next
    })
  }, [])

  const clearVibes = useCallback(() => {
    setSelectedVibes(new Set())
  }, [])

  return (
    <VibeFilterContext value={{ selectedVibes, toggleVibe, clearVibes }}>
      {children}
    </VibeFilterContext>
  )
}

export function useVibeFilter() {
  const ctx = useContext(VibeFilterContext)
  if (!ctx) throw new Error('useVibeFilter must be used within VibeFilterProvider')
  return ctx
}
