import { useCallback, useRef } from 'react'

const DEFAULT_BATCH_SIZE = 50

export default ({ variables, data, total, fetchMore }, options) => {
  const fetch = useRef()
  const ref = useRef({})
  ref.current = { variables, total, length: data ? data.length : 0 }
  return useCallback(
    async ({ startIndex, stopIndex }) => {
      if (ref.current.length === ref.current.total) return
      let current
      while (current !== fetch.current) {
        current = fetch.current
        await current
      }
      current = current || { stopIndex: ref.current.length }

      if (startIndex !== current.stopIndex) {
        if (stopIndex < current.stopIndex) {
          return
        }
        startIndex = current.stopIndex
      }
      const { batchSize = DEFAULT_BATCH_SIZE } = options
      const size = Math.max(1, Math.ceil((stopIndex - startIndex + 1) / batchSize) * batchSize)
      const nextVariables = {
        ...ref.current.variables,
        offset: startIndex,
        size,
      }
      fetch.current = fetchMore({
        variables: nextVariables,
      })
      fetch.current.stopIndex = size + startIndex

      try {
        await fetch.current
      } finally {
        fetch.current = undefined
      }
    },
    [fetchMore, ref, options],
  )
}
