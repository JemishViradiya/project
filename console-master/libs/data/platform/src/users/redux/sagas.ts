/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { all, call, put, takeLatest } from 'redux-saga/effects'

import type { fetchUsersStart } from './actions'
import { fetchUsersError, fetchUsersSuccess } from './actions'
import { ActionType } from './types'

export const getUsersSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof fetchUsersStart>>(
    ActionType.FetchUsersStart,
    function* ({ payload: { query, sortBy, max, offset, apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.getUsers, query, sortBy, offset, max)
        yield put(fetchUsersSuccess({ ...data, offset }))
      } catch (error) {
        yield put(fetchUsersError(error as Error))
      }
    },
  )
}

export const rootSaga = function* (): Generator {
  yield all([call(getUsersSaga)])
}
