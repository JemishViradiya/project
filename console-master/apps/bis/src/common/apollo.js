import isEqual from 'lodash-es/isEqual'

import { InMemoryCache } from '@apollo/client/cache'

export const loadMoreFieldPolicy = dataKey => ({
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

/**
 * In theory we should provide "merge: false" for all possible fields which apps queries the server.
 * But by default Apollo client treats all fields as "merge: false" as can be checked here:
 * https://github.com/apollographql/apollo-client/blob/b55f6a5d7fd7f5b85c916b654295a6fdb90f1261/src/cache/inmemory/policies.ts#L579
 * So to ignore the warning (which is disabled for production: https://github.com/apollographql/apollo-client/blob/v3.1.4/src/cache/inmemory/writeToStore.ts#L262)
 * we can set "merge: false" for the fields which are mostly used during development to not spam the console.
 * Apollo client v3.3 introduces ability to add "merge: false" on higher level which would significantly
 * reduce number of required "merge: false", thus it can be done once we update Apollo client to v3.3 or later.
 */
const typePolicies = {
  Query: {
    fields: {
      BIS_policy(existingData, { args, toReference }) {
        return (
          existingData ||
          toReference({
            __typename: 'BIS_policy',
            id: args.id,
          })
        )
      },
      BIS_eventInfiniteScroll: loadMoreFieldPolicy('events'),
      BIS_users: loadMoreFieldPolicy('users'),
      BIS_policies: {
        merge: false,
      },
      BIS_geozones: {
        merge: false,
      },
      BIS_ipAddressSettings: {
        merge: false,
      },
      BIS_clientParams: {
        merge: false,
      },
    },
  },
  BIS_DirectoryUser: {
    fields: {
      info: {
        merge: false,
      },
    },
  },
}

export const createCache = () =>
  new InMemoryCache({
    addTypename: false,
    typePolicies,
  })
