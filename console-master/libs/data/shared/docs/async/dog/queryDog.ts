import type { AsyncQuery, Permission } from '@ues-data/shared'

import type { Dog } from '../../common'
import { getMockMoreData, timeout } from '../../util'

export type DogVariables = { name: string }
export type ProgressiveVariables = { offset?: number; limit?: number }

export const queryDog: AsyncQuery<Dog, DogVariables> = {
  query: async ({ name }: DogVariables): Promise<Dog> => {
    logAction(name)
    // simulate http request
    await timeout(300)
    if (name === 'Buck') {
      logAction(name, 'SUCCESS')
      return { id: '1', name: 'Buck', breed: 'bulldog' }
    }
    logAction(name, 'FAILUE')
    throw Object.assign(new Error('Not Found'), {
      name,
      statusCode: 404,
    })
  },
  permissions: new Set<Permission>(),
  mockQueryFn: ({ name }): Dog => {
    if (name === 'Buck') {
      return {
        id: '1',
        name: 'Buck',
        breed: 'mock.bulldog',
      }
    }
    throw Object.assign(new Error('Not Found'), {
      name: `${name}.mock`,
      statusCode: 404,
    })
  },
}

export const listDogsProgressively: AsyncQuery<Dog[], ProgressiveVariables> = {
  query: async ({ offset, limit }: ProgressiveVariables): Promise<Dog[]> => {
    if (offset < 0) throw new Error('Invalid Request')
    await timeout(300)
    return getMockMoreData<Dog>(limit, offset)?.data
  },
  permissions: new Set<Permission>(),
  mockQueryFn: ({ offset, limit }): Dog[] => {
    if (offset < 0) throw new Error('Invalid Request')
    return getMockMoreData<Dog>(limit, offset)?.data
  },
}

export const queryDogWithCache: AsyncQuery<Dog, DogVariables> = {
  query: async function* ({ name }: DogVariables): AsyncGenerator<Dog, void> {
    logAction(name)
    // simulate http request
    await timeout(300)
    if (name === 'Buck') {
      logAction(name, 'SUCCESS')
      yield { id: '1', name: 'Buck', breed: 'cached' }

      await timeout(300)
      yield { id: '1', name: 'Buck', breed: 'bulldog' }
      return
    }

    yield { id: '1', name, breed: 'cached' }
    await timeout(300)

    logAction(name, 'FAILUE')
    throw Object.assign(new Error('Not Found'), {
      name,
      statusCode: 404,
    })
  },
  permissions: new Set<Permission>(),
  mockQueryFn: async function* ({ name }: DogVariables): AsyncGenerator<Dog, void> {
    if (name === 'Buck') {
      yield {
        id: '1',
        name: 'Buck',
        breed: 'mock.cached',
      }

      await timeout(300)
      yield {
        id: '1',
        name: 'Buck',
        breed: 'mock.bulldog',
      }

      return
    }
    throw Object.assign(new Error('Not Found'), {
      name: `${name}.mock`,
      statusCode: 404,
    })
  },
}

function logAction(...args: unknown[]) {
  if (process.env.NODE_ENV !== 'test') console.log('async mutateDog', ...args)
}
