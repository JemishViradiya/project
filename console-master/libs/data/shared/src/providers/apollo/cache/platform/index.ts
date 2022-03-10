import type { InMemoryCacheConfig } from '@apollo/client'

import { compareValues } from '../common/comparator'
import { mergeGeneric } from '../common/merge-generic'
import { offsetLimitPartialQueryPagination, offsetLimitSortByQueryPagination } from '../common/merge-offset-limit'
import { mergeUsersInGroup } from '../common/merge-users-in-group'
import { ecsPartialPagingFactory } from './factories'

const enhancedComparator = (sortBy, sortDirection, readField) => (a: Record<string, string>, b: Record<string, string>) =>
  compareValues(readField(sortBy, a), readField(sortBy, b), sortDirection)

const endpointsComparator = (sortBy, sortDirection, readField) => (a: Record<string, string>, b: Record<string, string>) => {
  if (sortBy === 'riskLevelStatus' || sortBy === 'emmType') return 0
  // Let server sort by risk status
  else {
    compareValues(readField(sortBy, a), readField(sortBy, b), sortDirection)
  }
}

export const PLATFORM_CACHE_CONFIG: InMemoryCacheConfig = {
  typePolicies: {
    Query: {
      fields: {
        profiles: {
          keyArgs: ['query'],
          merge: mergeGeneric,
        },
        userGroups: {
          keyArgs: false,
          merge: mergeGeneric,
        },
        usersInGroup: {
          keyArgs: false,
          merge: mergeUsersInGroup,
        },
        platformUsers: offsetLimitSortByQueryPagination(false, 'elements@type({"name":"PlatformUser"})', {
          // TODO: enable when we have add/remove and poll/refresh integrated
          // factory: ecsPartialPagingFactory,
        }),
        aggregatedUsers: offsetLimitPartialQueryPagination(false, 'elements@type({"name":"UserInfoAggregated"})', {
          // TODO: enable when we have add/remove and poll/refresh integrated
          factory: ecsPartialPagingFactory,
          omit: ['isAdminOnly', 'devices', 'expiry'],
          sort: enhancedComparator,
        }),
        platformEndpoints: offsetLimitPartialQueryPagination(false, 'elements@type({"name":"AggregatedEndpoint"})', {
          // TODO: enable when we have add/remove and poll/refresh integrated
          factory: ecsPartialPagingFactory,
          omit: ['osPlatform', 'enrollmentTime', 'appBundleId', 'appVersion', 'riskLevelStatus', 'emmType'],
          sort: endpointsComparator,
        }),
      },
    },
    PlatformUser: {
      keyFields: ['ecoId'],
    },
    PlatformEndpoint: {
      keyFields: ['guid'],
    },
    UserInfoAggregated: {
      keyFields: ['userId'],
    },
    AggregatedEndpoint: {
      keyFields: ['endpointId'],
    },
  },
}
