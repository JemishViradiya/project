import { MapUnknownLocationQuery } from '@ues-data/bis'

const DEFAULT_VARIABLES = Object.freeze({
  selectMode: true,
  ids: [],
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
      query: MapUnknownLocationQuery(false).query,
      variables: {
        ...DEFAULT_VARIABLES,
        ...variables,
      },
    },
    result: () => {
      if (errors) return { errors, loading: false }
      return {
        data: {
          usersUnknownLocation: {
            total: 0,
          },
        },
        loading: false,
      }
    },
  }
}

export { createUnknownLocationQueryMock }
