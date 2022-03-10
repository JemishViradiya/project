import { EventGeozoneQuery } from '@ues-data/bis'

const DEFAULT_SELECT_MODE = true
const DEFAULT_IDS = []
const DEFAULT_VARIABLES = Object.freeze({
  selectMode: DEFAULT_SELECT_MODE,
  ids: DEFAULT_IDS,
  offset: 0,
  size: 25,
  sortBy: 'datetime',
  sortDirection: 'ASC',
  range: {},
  zoomLevel: 2,
  geoBounds: undefined,
  riskTypes: ['behavioral', 'geozone'],
})
const DEFAULT_RESULT_OPTIONS = Object.freeze({})

const createGeoQueryMock = (
  { selectMode = DEFAULT_SELECT_MODE, ids = DEFAULT_IDS } = DEFAULT_VARIABLES,
  { errors } = DEFAULT_RESULT_OPTIONS,
) => {
  return {
    request: {
      query: EventGeozoneQuery(false).query,
      variables: {
        ...DEFAULT_VARIABLES,
        selectMode,
        ids,
      },
    },
    result: () => {
      if (errors) return { errors, loading: false }
      return {
        loading: false,
        data: {
          eventGeoClusters: [],
        },
      }
    },
  }
}

export { createGeoQueryMock }
