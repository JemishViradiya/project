import type { FieldMergeFunction, InMemoryCacheConfig } from '@apollo/client'

import { mergeGeneric } from '../common/merge-generic'

const mergeMobileAlertResults: FieldMergeFunction = (existing, incoming, { args }) => {
  if (args.cursor === undefined || !existing) {
    return incoming
  } else if (existing) {
    const newResult = [...existing.elements, ...incoming.elements]
    return { ...incoming, elements: newResult, totals: existing.totals }
  }
}

export const MTD_CACHE_CONFIG: InMemoryCacheConfig = {
  typePolicies: {
    Query: {
      fields: {
        mobileAlerts: {
          keyArgs: false,
          merge: mergeMobileAlertResults,
        },
        mobileAlertSummaries: {
          keyArgs: false,
          merge: mergeGeneric,
        },
        mobileDevicesWithAlerts: {
          keyArgs: false,
          merge: mergeGeneric,
        },
      },
    },
  },
}
