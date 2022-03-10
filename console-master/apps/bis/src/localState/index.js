// Load all modules from this directory. Each module is expected
// to have the following keys:
//   - dataKey: string value corresponding to query name
//   - updateKey: string value corresponding to mutation name
//   - typename corresponding to __typename in GraphQL
//   - either a load method to load the default values, or
//     defaultValue to act like a column list
//   - either an update method to run the mutation, or a

import { ApolloDataUtils } from '@ues-data/shared'

import * as AppliedListColums from './AppliedListColumns'
import * as EventListColumns from './EventListColumns'
import * as GeozoneListColumns from './GeozoneListColumns'
import * as PolicyListColumns from './PolicyListColumns'
import * as TimePeriod from './TimePeriod'
import * as UserInfoListColumns from './UserInfoListColumns'
import * as UserListColumns from './UserListColumns'

//     query object with the getter query in it
const modules = {
  [AppliedListColums.dataKey]: AppliedListColums,
  [EventListColumns.dataKey]: EventListColumns,
  [GeozoneListColumns.dataKey]: GeozoneListColumns,
  [PolicyListColumns.dataKey]: PolicyListColumns,
  [TimePeriod.dataKey]: TimePeriod,
  [UserInfoListColumns.dataKey]: UserInfoListColumns,
  [UserListColumns.dataKey]: UserListColumns,
}

const load = dataKey => {
  const { typename: __typename, defaultValue: columns, query } = modules[dataKey]
  if (modules[dataKey].load) {
    return { query, data: { [dataKey]: modules[dataKey].load() } }
  }

  const rawValue = localStorage.getItem(dataKey)
  let savedValue
  try {
    savedValue = JSON.parse(rawValue)
    // eslint-disable-next-line no-empty
  } catch (e) {}
  if (!savedValue || typeof savedValue !== 'object') {
    return { query, data: { [dataKey]: { __typename, columns } } }
  }
  savedValue.__typename = __typename
  return { query, data: { [dataKey]: savedValue } }
}

// eslint-disable-next-line prettier/prettier
const getMutation = dataKey =>
  // mutation
  (name, value, { cache }) => {
    if (modules[dataKey].update) {
      return modules[dataKey].update(name, value, { cache })
    }

    // Default is to update columns
    const columns = value.columns
    if (columns) {
      const definition = modules[dataKey]
      const query = definition.query
      const previous = ApolloDataUtils.getApolloCachedValue(cache, { query })
      const data = {
        [dataKey]: {
          __typename: definition.typename,
          ...previous[dataKey],
          columns,
        },
      }
      cache.writeQuery({ query, data })
      localStorage.setItem(dataKey, JSON.stringify({ columns }))
    }
    return null
  }

export default {
  initialize: cache => {
    Object.keys(modules).forEach(dataKey => {
      cache.writeQuery(load(dataKey))
    })
  },
  getMutations: () => {
    const result = {}
    Object.keys(modules).forEach(dataKey => {
      result[modules[dataKey].updateKey] = getMutation(dataKey)
    })
    return result
  },
}
