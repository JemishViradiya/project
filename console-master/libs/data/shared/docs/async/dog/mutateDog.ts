import type { AsyncMutation } from '@ues-data/shared'

import type { Dog } from '../../common'
import { timeout } from '../../util'

export const mutateDog: AsyncMutation<Dog, Pick<Dog, 'name'> & Partial<Omit<Dog, 'name'>>> = {
  mutation: async ({ name, ...rest }): Promise<Dog> => {
    logAction(name)
    await timeout(300)
    if (name === 'Buck') {
      logAction(name, 'SUCCESS')
      return { id: '1', name: 'Buck', breed: 'bulldog', ...rest }
    }
    logAction(name, 'FAILUE')
    throw Object.assign(new Error('Not Found'), {
      name,
      statusCode: 404,
    })
  },
  mockMutationFn: ({ name, ...rest }): Dog => {
    if (name === 'Buck') {
      return {
        id: '1',
        name: 'Buck',
        breed: 'mock.bulldog',
        ...rest,
      }
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
