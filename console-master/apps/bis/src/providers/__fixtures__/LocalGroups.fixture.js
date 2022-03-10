import { LocalGroupsQuery, LocalGroupsQueryMock } from '@ues-data/bis'

const DEFAULT_VARIABLES = Object.freeze({ isDirectoryLinked: false })

export const createLocalGroupsQueryMock = (variables = DEFAULT_VARIABLES) => ({
  request: { query: LocalGroupsQuery.query, variables },
  result: {
    loading: false,
    data: { ...LocalGroupsQueryMock },
  },
})
