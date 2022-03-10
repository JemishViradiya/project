import type { DefinitionNode } from 'graphql'
import { isArray, isPlainObject } from 'lodash-es'

import type { ApolloCache, Cache } from '@apollo/client'
import { gql } from '@apollo/client'

export const getApolloCachedValue = <TSerialized, QueryType, TVariables>(
  cache: ApolloCache<TSerialized>,
  options: Cache.ReadQueryOptions<QueryType, TVariables>,
): QueryType | Record<string, never> => {
  try {
    return cache.readQuery(options)
  } catch (e) {
    return {}
  }
}

export const createApolloEntitiesQuery = typeName => gql`
  query ${typeName} {
    ${typeName} @type(name: "${typeName}")
  }
  `

export const cloneWithoutTypename = <T>(obj: T): Omit<T, '__typename'> => {
  if (!isPlainObject(obj)) {
    return obj
  }
  const result: unknown = {}
  for (const key in obj) {
    if (key === '__typename') {
      continue
    }
    const value = (obj as unknown)[key]
    if (isPlainObject(value)) {
      result[key] = cloneWithoutTypename(value)
    } else if (isArray(value)) {
      result[key] = value.map(cloneWithoutTypename)
    } else {
      result[key] = value
    }
  }
  return result as Omit<T, '__typename'>
}

export const definitionIsMutation = (d: DefinitionNode) => d.kind === 'OperationDefinition' && d.operation === 'mutation'
