import { UserListQuery } from '@ues-data/bis'

const query = UserListQuery(true).query

const DEFAULT_VARIABLES = Object.freeze({
  offset: 0,
  size: 25,
  sortBy: 'assessment.datetime',
  sortDirection: 'DESC',
})
const DEFAULT_COUNT = 0
const DEFAULT_GENERATE_USERS = true
const EMPTY_USERS = []
const DEFAULT_RESULT_OPTIONS = Object.freeze({
  count: DEFAULT_COUNT,
  generateUsers: DEFAULT_GENERATE_USERS,
})

const createUserMock = ordinalNumber => {
  return {
    id: `USER_ID_${ordinalNumber}`,
    info: {
      displayName: null,
      department: null,
      primaryEmail: null,
      title: null,
    },
    operatingMode: null,
    fixup: null,
    updated: null,
    assessment: {
      eEcoId: `USER_ECO_ID_${ordinalNumber}`,
      datetime: 1588926213291,
      behavioralRiskLevel: 'UNKNOWN',
      geozoneRiskLevel: null,
      ipAddress: null,
      mappings: null,
      datapoint: null,
    },
    sisActions: null,
  }
}

const createUserListQueryMock = (
  variables = DEFAULT_VARIABLES,
  { count = DEFAULT_COUNT, generateUsers = DEFAULT_GENERATE_USERS, errors } = DEFAULT_RESULT_OPTIONS,
) => {
  return {
    request: {
      query,
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
          users: {
            total: count,
            users: generateUsers ? Array.from(Array(count), (_, index) => createUserMock(index + 1)) : EMPTY_USERS,
          },
        },
      }
    },
  }
}

export { createUserListQueryMock }
