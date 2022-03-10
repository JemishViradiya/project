import { EventUnknownLocationQuery } from '@ues-data/bis'

const DEFAULT_VARIABLES = Object.freeze({
  selectMode: true,
  offset: 0,
  size: 25,
  sortBy: 'datetime',
  sortDirection: 'ASC',
  range: {},
  location: ['unknown'],
})
const DEFAULT_RESULT_OPTIONS = Object.freeze({})

const createUnknownLocationQueryMock = (variables = DEFAULT_VARIABLES, { errors } = DEFAULT_RESULT_OPTIONS) => {
  return {
    request: {
      query: EventUnknownLocationQuery(false).query,
      variables: {
        ...DEFAULT_VARIABLES,
        ...variables,
      },
    },
    result: () => {
      if (errors) return { errors, loading: false }
      return {
        data: {
          eventUnknownLocation: {
            total: 0,
          },
        },
        loading: false,
      }
    },
  }
}

export { createUnknownLocationQueryMock }
