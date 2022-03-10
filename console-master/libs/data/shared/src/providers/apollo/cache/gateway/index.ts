import type { InMemoryCacheConfig } from '@apollo/client'

import { mergeGeneric } from '../common/merge-generic'

export const GATEWAY_CACHE_CONFIG: InMemoryCacheConfig = {
  typePolicies: {
    Query: {
      fields: {
        profileMembers: {
          keyArgs: false,
          merge: mergeGeneric,
        },
      },
    },
  },
}
