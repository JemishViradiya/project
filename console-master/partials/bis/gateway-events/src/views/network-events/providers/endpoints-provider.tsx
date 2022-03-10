import { noop } from 'lodash'
import React, { createContext, useCallback, useMemo, useRef, useState } from 'react'

import type { AggregatedEndpoint } from '@ues-data/platform'
import { queryEndpointById } from '@ues-data/platform'
import { Permission, usePermissions, useStatefulAsyncQuery } from '@ues-data/shared'

interface EndpointsContextValue {
  registerEndpoints: (...ids: string[]) => void
  endpoints: Record<string, AggregatedEndpoint | null>
}

export const EndpointsContext = createContext<EndpointsContextValue>({
  registerEndpoints: noop,
  endpoints: {},
})

export const EndpointsProvider: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const { hasPermission } = usePermissions()

  const { fetchMore } = useStatefulAsyncQuery(queryEndpointById, { skip: true })
  const [endpoints, setEndpoints] = useState<Record<string, AggregatedEndpoint | null>>({})

  const registeredEndpointsRef = useRef<Set<string>>(new Set())

  const registerEndpoints = useCallback(
    (...ids: string[]) => {
      if (!hasPermission(Permission.ECS_DEVICES_READ)) {
        return
      }

      ids.forEach(async id => {
        if (!registeredEndpointsRef.current.has(id)) {
          registeredEndpointsRef.current.add(id)

          const asyncGenerator: any = await fetchMore({
            fetchPolicy: 'cache-first',
            id: id.toLowerCase(),
          })
          const endpoint = await asyncGenerator.next()

          setEndpoints(current => ({ ...current, [id]: endpoint }))
        }
      })
    },
    [fetchMore, hasPermission],
  )

  const value = useMemo(() => ({ registerEndpoints, endpoints }), [endpoints, registerEndpoints])

  return <EndpointsContext.Provider value={value}>{children}</EndpointsContext.Provider>
}
