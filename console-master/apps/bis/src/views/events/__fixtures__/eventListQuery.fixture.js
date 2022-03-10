import { EventListQuery } from '@ues-data/bis'

const DEFAULT_VARIABLES = Object.freeze({
  offset: 0,
  size: 25,
  sortBy: 'datetime',
  sortDirection: 'ASC',
  range: {},
})
const DEFAULT_COUNT = 0
const DEFAULT_GENERATE_EVENTS = true
const EMPTY_EVENTS = []
const DEFAULT_RESULT_OPTIONS = Object.freeze({
  count: DEFAULT_COUNT,
  generateEvents: DEFAULT_GENERATE_EVENTS,
})

const createEventMock = ordinalNumber => {
  return {
    id: `EVENT_ID_${ordinalNumber}`,
    operatingMode: null,
    fixup: null,
    updated: null,
    assessment: {
      behavioralRiskLevel: 'UNKNOWN',
      datapoint: null,
      datetime: 1588926213291,
      eEcoId: null,
      geozoneRiskLevel: null,
      ipAddress: null,
      userInfo: null,
      mappings: null,
    },
    sisActions: null,
  }
}

const createEventListQueryMock = (
  variables = DEFAULT_VARIABLES,
  { count = DEFAULT_COUNT, generateEvents = DEFAULT_GENERATE_EVENTS, errors } = DEFAULT_RESULT_OPTIONS,
) => {
  return {
    request: {
      query: EventListQuery(true).query,
      variables: {
        ...DEFAULT_VARIABLES,
        ...variables,
      },
    },
    result: () => {
      if (errors) return { errors, loading: false }
      return {
        loading: false,
        data: {
          eventInfiniteScroll: {
            total: count,
            events: generateEvents ? Array.from(Array(count), (_, index) => createEventMock(index + 1)) : EMPTY_EVENTS,
          },
        },
      }
    },
  }
}

export { createEventListQueryMock }
