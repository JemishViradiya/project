/* eslint-disable sonarjs/no-duplicate-string */
import { gql } from '@apollo/client'

import type { ApolloMutation, ApolloQuery, AsyncQuery, IdbFetchPolicy } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, UesApolloClient, UesFetch } from '@ues-data/shared'

import { UserDeletePermissions, UserReadPermissions } from '../../shared/permissions'
import type { PlatformUser, PlatformUsers, UserInfoAggregated } from '../../shared/types'
import type { User } from '../common'
import { usersMock } from '../common/users-mock'
import { UsersAggregatedCache, UsersCache } from './cache'
import { mockAggregatedUser, mockUser } from './mock'

interface QueryUserById {
  id: string
  fetchPolicy?: IdbFetchPolicy | 'cache-and-network'
}

const checkCachePolicies = new Set(['cache-first', 'cache-only', 'cache-and-network'])

export const queryUserByEcoId: AsyncQuery<PlatformUser, QueryUserById> = {
  query: async ({ id, fetchPolicy = 'cache-first' }) => {
    let user: PlatformUser
    if (checkCachePolicies.has(fetchPolicy)) {
      try {
        user = await UsersCache.read(id)
      } catch (error) {
        console.warn(error)
      }
      if (user) Object.assign(user, { __typename: 'PlatformUser' })
      if (user || fetchPolicy === 'cache-only') return user
    }

    // Inquire about proper query api that is not POST
    ;({
      elements: [user],
    } = await UesFetch<'json', PlatformUsers>('/platform/v1/users/query', {
      method: 'POST',
      body: JSON.stringify([id]),
    }))
    if (fetchPolicy !== 'no-cache') {
      Object.assign(user, { __typename: 'PlatformUser' })
      UsersCache.write(user).catch(error => console.warn(error))
    }

    return user
  },
  mockQueryFn: mockUser,
  permissions: UserReadPermissions,
}

export const queryUserById: AsyncQuery<PlatformUser, QueryUserById> = {
  id: 'platform.users.queryUserById',
  query: async function* ({ id, fetchPolicy = 'cache-first' }): AsyncGenerator<PlatformUser, void> {
    let user: PlatformUser
    if (checkCachePolicies.has(fetchPolicy)) {
      try {
        user = await UsersCache.index('by-id', id)
      } catch (error) {
        console.warn(error)
      }
      if (user) Object.assign(user, { __typename: 'PlatformUser' })
      if (user) {
        yield user
      }
      if (fetchPolicy === 'cache-only') return
    }
    if (!user || fetchPolicy === 'cache-and-network') {
      user = await UesFetch<'json', PlatformUser>(`/platform/v1/users/${id}`)
      if (fetchPolicy !== 'no-cache') {
        Object.assign(user, { __typename: 'PlatformUser' })
        UsersCache.write(user).catch(error => console.warn(error))
      }
      yield user
    }
  },
  mockQueryFn: async function* ({ id }): AsyncGenerator<PlatformUser, void> {
    yield new Promise(resolve => {
      setTimeout(() => resolve(mockUser({ id })), 1000)
    }) as Promise<PlatformUser>
  },
  permissions: UserReadPermissions,
}

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace queryUsers {
  interface QueryUsersResult {
    platformUsers: {
      totals: {
        pages: number
        elements: number
      }
      navigation: {
        next?: string
        previous?: string
      }
      count: number
      elements: PlatformUser[]
    }
  }
  interface QueryUsers {
    queryBy?: 'displayName' | 'emailAddress' | 'ecoId'
    query?: string
    offset?: number
    limit?: number
    sortBy: 'displayName' | 'emailAddress' | 'ecoId'
    sortDirection: 'asc' | 'desc'
  }
}

const queryUsers: ApolloQuery<queryUsers.QueryUsersResult, queryUsers.QueryUsers> = {
  id: 'queryUsers',
  query: gql`
    query platformUsers(
      $offset: number = 0
      $limit: number = 20
      $sortBy: string = "displayName"
      $sortDirection: string = "desc"
      $query: string = ""
    ) {
      platformUsers(offset: $offset, max: $limit, sortBy: $sortBy, sortDirection: $sortDirection, query: $query)
        @rest(
          type: "PlatformUsers"
          path: "/platform/v1/users?query=isAdminOnly=false,{args.query}&offset={args.offset}&max={args.max}&sortBy={args.sortBy} {args.sortDirection}"
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
        elements @type(name: "PlatformUser") {
          id
          ecoId
          username
          displayName
          emailAddress
          dataSource
          title
        }
      }
    }
  `,
  onCompleted: data => {
    // add the users to the cache when we list them
    UsersCache.write(...data.platformUsers.elements).catch(console.warn.bind(console))
  },
  mockQueryFn: ({ offset = 0, limit = 100 }) => {
    const count = 500
    const result: queryUsers.QueryUsersResult = {
      platformUsers: {
        totals: { pages: count / limit, elements: count },
        navigation: { next: Math.min(count, offset + 2 * limit).toString(), previous: Math.max(0, offset - limit).toString() },
        count,
        elements: [],
      },
    }
    const end = offset + limit
    for (let id = offset; id < end; id++) {
      result.platformUsers.elements.push(mockUser({ id }))
    }
    return result
  },
  context: {
    idbCache: UsersCache,
    ...getApolloQueryContext(APOLLO_DESTINATION.REST_API),
  },
  permissions: UserReadPermissions,
}

const deleteUsersGql = gql`
  mutation deleteUsers($userIds: [String]!) {
    deleteUsers(userIds: $userIds)
  }
`

interface QueryVariables {
  userIds: Array<string>
}

const deleteUsersMutation: ApolloMutation<unknown, QueryVariables> = {
  mutation: deleteUsersGql,
  mockMutationFn: () => null,
  context: getApolloQueryContext(APOLLO_DESTINATION.PLATFORM_BFF),
  permissions: UserDeletePermissions,
}

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace queryAggregatedUsers {
  interface QueryUsersResult {
    aggregatedUsers: {
      totals: {
        pages: number
        elements: number
      }
      navigation: {
        next?: string
        previous?: string
      }
      count: number
      elements: UserInfoAggregated[]
    }
  }
  interface QueryUsers {
    query?: string
    offset?: number
    max?: number
    sortBy: 'displayName' | 'emailAddress' | 'dataSource' | 'devices' | 'expiry'
    sortDirection: 'asc' | 'desc'
  }
}

const queryAggregatedUsers: ApolloQuery<queryAggregatedUsers.QueryUsersResult, queryAggregatedUsers.QueryUsers> = {
  query: gql`
    query aggregatedUsers(
      $offset: number = 0
      $max: number = 50
      $sortBy: string = "displayName"
      $sortDirection: string = "asc"
      $query: string = "isAdminOnly=false"
    ) {
      aggregatedUsers(offset: $offset, max: $max, sortBy: $sortBy, sortDirection: $sortDirection, query: $query)
        @rest(
          type: "UserGridAggregated"
          path: "/platform/v1/bffgrid/users?query={args.query}&offset={args.offset}&max={args.max}&sortBy={args.sortBy} {args.sortDirection}"
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
        elements @type(name: "UserInfoAggregated") {
          tenantId
          userId
          username
          displayName
          emailAddress
          dataSource
          expiry
          status
          devices
        }
      }
    }
  `,
  onCompleted: data => {
    // add the users to the cache when we list them
    UsersAggregatedCache.write(...data.aggregatedUsers.elements).catch(console.warn.bind(console))
  },
  mockQueryFn: ({ offset = 0, max = 100 }) => {
    const count = usersMock.elements.length
    const result: queryAggregatedUsers.QueryUsersResult = {
      aggregatedUsers: {
        totals: { pages: count / max, elements: count },
        navigation: { next: Math.min(count, offset + 2 * max).toString(), previous: Math.max(0, offset - max).toString() },
        count,
        elements: [],
      },
    }
    const end = offset + max
    for (let index = offset; index < end && index < count; index++) {
      result.aggregatedUsers.elements.push(mockAggregatedUser({ id: usersMock.elements[index].id }))
    }
    return result
  },
  context: {
    idbCache: UsersAggregatedCache,
    ...getApolloQueryContext(APOLLO_DESTINATION.REST_API),
  },
  permissions: UserReadPermissions,
}

const deleteUsersFromCache = (deletedIds: string[]) => {
  UesApolloClient.cache.modify({
    fields: {
      aggregatedUsers(cachedUsers, { readField }) {
        return {
          ...cachedUsers,
          'elements@type({"name":"UserInfoAggregated"})': cachedUsers['elements@type({"name":"UserInfoAggregated"})'].filter(
            user => !deletedIds.includes(readField('userId', user)),
          ),
          totals: { ...cachedUsers.totals, elements: cachedUsers.totals.elements - deletedIds.length },
        }
      },
    },
  })
}

const userToAggregatedUser = (user: User): UserInfoAggregated => {
  return {
    tenantId: user.tenantId,
    userId: user.id,
    username: user.username,
    displayName: user.displayName,
    emailAddress: user.emailAddress,
    dataSource: user.dataSource,
    expiry: null,
    status: null,
    devices: 0,
  }
}

const userFragment = gql`
  fragment UserInfoAggregatedFragment on UserInfoAggregated {
    tenantId
    userId
    username
    displayName
    emailAddress
    dataSource
    expiry
    status
    devices
  }
`

const addUserToCache = (userInfo: UserInfoAggregated) => {
  Object.assign(userInfo, { __typename: 'UserInfoAggregated' })
  UesApolloClient.cache.modify({
    broadcast: false,
    fields: {
      aggregatedUsers(cachedUsers) {
        const newUserRef = UesApolloClient.cache.writeFragment({
          data: userInfo,
          fragment: userFragment,
        })

        const elements = [...cachedUsers['elements@type({"name":"UserInfoAggregated"})'], newUserRef]
        return {
          ...cachedUsers,
          'elements@type({"name":"UserInfoAggregated"})': elements,
          totals: { ...cachedUsers.totals, elements: cachedUsers.totals.elements + 1 },
        }
      },
    },
  })
}

const updateUserInCache = (userInfo: UserInfoAggregated) => {
  Object.assign(userInfo, { __typename: 'UserInfoAggregated' })
  UesApolloClient.cache.writeFragment({
    data: userInfo,
    fragment: userFragment,
  })
}

const evictAggregatedUsersCache = () => {
  UesApolloClient.query({ ...queryAggregatedUsers, fetchPolicy: 'network-only' })
}

export {
  queryUsers,
  deleteUsersMutation,
  deleteUsersFromCache,
  queryAggregatedUsers,
  addUserToCache,
  userToAggregatedUser,
  updateUserInCache,
  evictAggregatedUsersCache,
}
