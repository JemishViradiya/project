import { useEffect, useRef, useState } from 'react'

import type { idbCacheFactory } from '../../cache/idb'
import { createApolloEntitiesQuery } from '../../utils/apollo'
import { customizedCache } from './cache'

export const usePreloadApolloCacheFromIdb = (
  _cache: any,
  {
    sortBy,
    sortDirection = 'asc',
    limit,
  }: {
    sortBy: string
    sortDirection?: 'asc' | 'desc'
    limit?: number
  },
): boolean => {
  const cache = _cache as ReturnType<typeof idbCacheFactory>
  const [, setState] = useState(1)
  const data = useRef(false)
  const vars = useRef({ sortBy, sortDirection, limit })

  useEffect(() => {
    ;(async () => {
      const { sortBy, limit } = vars.current
      const results = await cache.indexMany(`by-${sortBy}`, undefined, limit)

      const typeName = cache.meta.name
      const query = createApolloEntitiesQuery(typeName)
      customizedCache.writeQuery({ query, data: { [typeName]: results } })

      data.current = true
      setState(s => s + 1)
    })()
  }, [cache])

  return data.current
}
