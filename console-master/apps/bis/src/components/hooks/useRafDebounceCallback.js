import { useMemo } from 'react'

export default (fn, deps) =>
  useMemo(() => {
    let rafId
    let nextArgs
    return (...args) => {
      nextArgs = args
      if (!rafId) {
        rafId = window.requestAnimationFrame(() => {
          rafId = undefined
          fn(...nextArgs)
        })
      }
    }
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
