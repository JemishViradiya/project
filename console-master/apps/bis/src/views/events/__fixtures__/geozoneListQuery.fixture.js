import { GeozoneListQuery } from '@ues-data/bis'

const DEFAULT_RESULT_OPTIONS = Object.freeze({})

const createGeozoneListQueryMock = ({ errors } = DEFAULT_RESULT_OPTIONS) => ({
  request: { query: GeozoneListQuery.query },
  result: () => {
    if (errors) return { errors, loading: false }
    return {
      data: {
        geozones: null,
      },
      loading: false,
    }
  },
})

export { createGeozoneListQueryMock }
