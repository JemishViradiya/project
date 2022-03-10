const DEFAULT_RESULT_OPTIONS = Object.freeze({})

const MOCK_QUERY_DATA = Object.freeze({
  userListColumns: {
    columns: [],
  },
})

const createUpdateUserListColumnsQueryMock = (
  // { selectMode = DEFAULT_SELECT_MODE, ids = DEFAULT_IDS } = DEFAULT_VARIABLES,
  { errors } = DEFAULT_RESULT_OPTIONS,
) => {
  let updateUserListColumnsMutation
  jest.isolateModules(
    () => (updateUserListColumnsMutation = require('../../../localState/UserListColumns').updateUserListColumnsMutation.mutation),
  )

  return {
    request: {
      query: updateUserListColumnsMutation,
      variables: {
        columns: [],
      },
    },
    result: () => {
      if (errors) return { errors, loading: false }
      return {
        loading: false,
        data: MOCK_QUERY_DATA,
      }
    },
  }
}

export { createUpdateUserListColumnsQueryMock }
