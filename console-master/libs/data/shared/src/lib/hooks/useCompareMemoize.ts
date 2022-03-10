import { useRef } from 'react'
import shallowEqual from 'shallowequal'

export function useCompareMemoize<T>(value: T, comparator: (a: T, b: T) => boolean | number = shallowEqual): T {
  const ref = useRef<T>()

  if (!comparator(value, ref.current)) {
    ref.current = value
  }

  return ref.current
}
