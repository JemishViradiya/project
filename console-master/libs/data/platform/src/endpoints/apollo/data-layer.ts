/* eslint-disable sonarjs/no-duplicate-string */
import { gql } from '@apollo/client'

import type { ApolloQuery, AsyncQuery, IdbFetchPolicy } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, UesFetch } from '@ues-data/shared'

import { devicesMock } from '../../mocks'
import { DeviceReadPermissions } from '../../shared/permissions'
import type { UserDevice } from '../../users'
import { EndpointsCache } from './cache'
import { mockAggregatedEndpoint, mockEndpoint } from './mock'
import type { AggregatedEndpoint, PlatformEndpoint } from './types'

export const EXPORT_BATCH_SIZE = 500

const convertEndpoint = (aggregatedEndpoint: AggregatedEndpoint): PlatformEndpoint => {
  return {
    guid: aggregatedEndpoint.endpointId,
    tenantId: aggregatedEndpoint.tenantId,
    userId: aggregatedEndpoint.userId,
    appBundleId: aggregatedEndpoint.appBundleId,
    appVersion: aggregatedEndpoint.appVersion,
    deviceInfo: {
      deviceId: aggregatedEndpoint.deviceId,
      deviceModelName: aggregatedEndpoint.device,
      osVersion: aggregatedEndpoint.osVersion,
      platform: aggregatedEndpoint.osPlatform,
    },
  }
}

interface QueryEndpointById {
  id: string
  fetchPolicy?: IdbFetchPolicy | 'cache-and-network'
}

const checkCachePolicies = new Set(['cache-first', 'cache-only', 'cache-and-network'])

export const queryEndpointById: AsyncQuery<PlatformEndpoint, QueryEndpointById> = {
  query: async function* ({ id, fetchPolicy = 'cache-first' }): AsyncGenerator<PlatformEndpoint, void> {
    let endpoint: PlatformEndpoint
    if (checkCachePolicies.has(fetchPolicy)) {
      try {
        const cachedEndpoint = await EndpointsCache.read(id)
        endpoint = cachedEndpoint ? convertEndpoint(cachedEndpoint) : undefined
      } catch (error) {
        console.warn(error)
      }
      if (endpoint) Object.assign(endpoint, { __typename: 'PlatformEndpoint' })
      if (endpoint) {
        yield endpoint
      }
      if (fetchPolicy === 'cache-only') {
        return
      }
    }
    if (!endpoint || fetchPolicy === 'cache-and-network') {
      endpoint = await UesFetch<'json', PlatformEndpoint>(`/platform/v1/entities/endpoints/${id}`)
      // if (fetchPolicy !== 'no-cache') {
      //   Object.assign(endpoint, { __typename: 'PlatformEndpoint' })
      //   EndpointsCache.write(endpoint).catch(error => console.warn(error))
      // }
      yield endpoint
    }
  },
  mockQueryFn: async function* ({ id }): AsyncGenerator<PlatformEndpoint, void> {
    const guid = id

    // try to find an existing entry in devicesMock
    const deviceMockEntry = devicesMock.elements.find(entry => entry.guid === guid)
    let result = null
    if (deviceMockEntry) {
      result = mapDeviceMockToEndpointMock(deviceMockEntry)
    } else {
      result = mockEndpoint({ id })
    }

    yield new Promise(resolve => {
      setTimeout(() => resolve(result), 1000)
    }) as Promise<PlatformEndpoint>
  },
  permissions: DeviceReadPermissions,
}

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace queryEndpoints {
  interface QueryEndpointsResult {
    platformEndpoints: {
      totals: {
        pages: number
        elements: number
      }
      navigation: {
        next?: string
        previous?: string
      }
      count: number
      elements: AggregatedEndpoint[]
    }
  }
  interface QueryEndpoints {
    queryBy?: 'id' | 'endpointId'
    query?: string
    offset?: number
    limit?: number
    sortBy: string
    sortDirection: 'asc' | 'desc'
  }
  type QueryEdpointsQueryFields = 'guid' | 'endpointId'
}

const mapDeviceMockToEndpointMock = (deviceMockEntry: UserDevice): PlatformEndpoint => {
  return {
    ...deviceMockEntry,
    created: new Date(Date.parse(deviceMockEntry.created)),
    modified: new Date(Date.parse(deviceMockEntry.modified)),
    expires: new Date(Date.parse(deviceMockEntry.expires)),
  }
}

// eslint-disable-next-line no-redeclare
const queryEndpoints: ApolloQuery<queryEndpoints.QueryEndpointsResult, queryEndpoints.QueryEndpoints> = {
  id: 'platform.endpoints.queryEndpoints',
  query: gql`
    query platformEndpoints(
      $offset: number = 0
      $limit: number = 30
      $sortBy: string = "guid"
      $sortDirection: string = "desc"
      $query: string = ""
    ) {
      platformEndpoints(offset: $offset, max: $limit, sortBy: $sortBy, sortDirection: $sortDirection, query: $query)
        @rest(
          type: "PlatformEndpoints"
          path: "/platform/v1/bffgrid/endpoints?query={args.query}&offset={args.offset}&max={args.max}&sortBy={args.sortBy} {args.sortDirection},created asc"
          method: "GET"
        ) {
        navigation {
          next
          previous
        }
        totals {
          elements
          pages
        }
        count
        elements @type(name: "AggregatedEndpoint") {
          endpointId
          tenantId
          userId
          userDisplayName
          userEmailAddress
          deviceId
          osPlatform
          osVersion
          appBundleId
          appVersion
          device
          agent
          enrollmentStatus
          status
          alerts
          mobile
          lastOnline
          enrollmentTime
          osSecurityPatch
          riskLevelStatus
          emmType
          emmRegistrationStatus
        }
      }
    }
  `,
  onCompleted: data => {
    // add the endpoints to the cache when we list them
    EndpointsCache.write(...data.platformEndpoints.elements).catch(console.warn.bind(console))
  },
  mockQueryFn: ({ offset = 1, limit = 101, query }) => {
    const count = 60
    const result: queryEndpoints.QueryEndpointsResult = {
      platformEndpoints: {
        totals: { pages: count / limit, elements: count },
        navigation: {
          next:
            offset + limit >= count
              ? null
              : `/api/platform/v1/bffgrid/endpoints?query=mobile=true&offset=${Math.min(offset + limit, count)}&max=${limit}`,
          previous: `/api/platform/v1/bffgrid/endpoints?query=mobile=true&offset=${Math.max(offset - limit, count)}&max=${limit}`,
        },
        count,
        elements: [],
      },
    }
    const end = Math.min(count, offset + limit)
    for (let id = offset; id < end; id++) {
      result.platformEndpoints.elements.push(mockAggregatedEndpoint({ id }))
    }
    return result
  },
  iterator: (
    previousVariables = { offset: 0, limit: EXPORT_BATCH_SIZE, sortBy: 'created', sortDirection: 'desc' },
    previousResult = undefined,
  ) => {
    let nextOffset = 0
    if (previousResult) {
      const navigation = previousResult.platformEndpoints.navigation
      if (navigation === null || navigation.next === null) return null
      try {
        nextOffset = parseInt(new URLSearchParams(navigation.next).get('offset'))
        // eslint-disable-next-line no-empty
      } catch (err) {
        nextOffset = 0
      }
    }
    return {
      ...previousVariables,
      offset: nextOffset,
    }
  },
  context: {
    idbCache: EndpointsCache,
    ...getApolloQueryContext(APOLLO_DESTINATION.REST_API),
  },
  permissions: DeviceReadPermissions,
}

export { queryEndpoints }
