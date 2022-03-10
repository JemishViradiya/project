import type { InMemoryCacheConfig } from '@apollo/client'

export const DASHBOARD_CACHE_CONFIG: InMemoryCacheConfig = {
  typePolicies: {
    Query: {
      fields: {
        getDashboards: {
          keyArgs: false,
        },
      },
    },
  },
}
