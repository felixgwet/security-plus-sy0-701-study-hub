import { useCallback, useState } from 'react'

export function usePersistentState<T>(key: string, initial: () => T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw != null) return { ...initial(), ...JSON.parse(raw) } as T
    } catch {
      // corrupted storage — fall through to defaults
    }
    return initial()
  })

  const set = useCallback(
    (updater: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const next = typeof updater === 'function' ? (updater as (p: T) => T)(prev) : updater
        try {
          localStorage.setItem(key, JSON.stringify(next))
        } catch {
          // storage full or unavailable — keep in-memory state
        }
        return next
      })
    },
    [key],
  )

  return [value, set] as const
}
