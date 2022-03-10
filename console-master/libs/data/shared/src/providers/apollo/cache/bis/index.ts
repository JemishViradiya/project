import { isEqual } from 'lodash-es'

import type { FieldPolicy, InMemoryCacheConfig } from '@apollo/client'

const createMergePagesPolicy = (dataKey: string): FieldPolicy => ({
  read(existing) {
    return existing
  },
  merge(existing, incoming, options) {
    const { [dataKey]: data, total = 0 } = incoming
    const {
      args: { offset, size, ...restArgs },
      storage,
    } = options
    const previousData = isEqual(restArgs, storage.args) ? existing?.[dataKey] ?? [] : []

    let nextData
    if (previousData.length !== offset) {
      console.log(`${dataKey} FetchMore race-condition guard failure`, offset, size, previousData.length)
      nextData = previousData.slice()
      nextData.splice(offset, size, ...data)
    } else {
      nextData = previousData.concat(data)
    }
    storage.args = restArgs
    return {
      [dataKey]: nextData,
      total,
    }
  },
})

export const BIS_CACHE_CONFIG: InMemoryCacheConfig = {
  typePolicies: {
    Query: {
      fields: {
        BIS_eventGatewayInfiniteScroll: createMergePagesPolicy('events'),
      },
    },
  },
}
