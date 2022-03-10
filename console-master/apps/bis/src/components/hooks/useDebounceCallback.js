import { useMemo } from 'react'

export default (fn, duration, deps) =>
  useMemo(() => {
    let timeoutId
    let nextArgs
    return (...args) => {
      nextArgs = args
      if (!timeoutId) {
        timeoutId = setTimeout(
          () =>
            window.requestAnimationFrame(() => {
              timeoutId = undefined
              fn(...nextArgs)
            }),
          duration,
        )
      }
    }
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
