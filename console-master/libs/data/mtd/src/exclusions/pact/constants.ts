import { failureMockData } from '../api/dev-certs/mocks'

export const JSON_CONTENT_TYPE = 'application/json'

export const APPROVED_PARAM = 'type=APPROVED'
export const APPROVED_QUERY_PARAM = `query=${APPROVED_PARAM}`
export const RESTRICTED_PARAM = 'type=RESTRICTED'
export const RESTRICTED_QUERY_PARAM = `query=${RESTRICTED_PARAM}`
export const APPROVED_IP_PARAM = `type=APPROVED,addressType=IP`
export const APPROVED_IP_QUERY_PARAM = `query=${APPROVED_IP_PARAM}`
export const RESTRICTED_IP_PARAM = 'type=RESTRICTED,addressType=IP'
export const RESTRICTED_IP_QUERY_PARAM = `query=${RESTRICTED_IP_PARAM}`
export const APPROVED_HOST_PARAM = 'type=APPROVED,addressType=HOST'
export const APPROVED_HOST_QUERY_PARAM = `query=${APPROVED_HOST_PARAM}`
export const RESTRICTED_HOST_PARAM = 'type=RESTRICTED,addressType=HOST'
export const RESTRICTED_HOST_QUERY_PARAM = `query=${RESTRICTED_HOST_PARAM}`

export const MOCK_DELETE_RESPONSE = { totalRequested: 2, totalProcessed: 2 }

export const MOCK_IMPORT_RESULT = {
  data: {
    successes: 1,
    failures: failureMockData,
  },
}

export const createPageView = (elements: any[]) => {
  return {
    data: {
      totals: {
        pages: 1,
        elements: elements.length,
      },
      navigation: {
        next: 'next',
        previous: 'prev',
      },
      count: elements.length,
      elements: elements,
    },
  }
}
