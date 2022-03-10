import { useEffect, useRef } from 'react'

// Update key once dependencies are changed
export const useErrorBoundaryRecovery = dependencies => {
  const ref = useRef<any[]>(dependencies)
  const key = useRef(0)

  const changed = ref.current !== dependencies

  useEffect(() => {
    if (changed) {
      ref.current = dependencies
      key.current += 1
    }
  }, [changed, dependencies])

  return changed ? key.current : key.current + 1
}
