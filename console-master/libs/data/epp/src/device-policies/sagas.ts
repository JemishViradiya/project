import { all, call, put, takeLatest } from 'redux-saga/effects'

import type { fetchDevicePolicyListStart } from './actions'
import { fetchDevicePolicyListError, fetchDevicePolicyListSuccess } from './actions'
import { DevicePoliciesActions } from './constants'

const fetchDevicePolicyListSaga = function* ({ payload: api }: ReturnType<typeof fetchDevicePolicyListStart>) {
  try {
    const data = yield call(api.fetchDevicePolicyList)

    yield put(fetchDevicePolicyListSuccess(data))
  } catch (error) {
    yield put(fetchDevicePolicyListError(error))
  }
}

const rootSaga = function* () {
  yield all([takeLatest(DevicePoliciesActions.FetchDevicePolicyListStart, fetchDevicePolicyListSaga)])
}

export { rootSaga as default, fetchDevicePolicyListSaga }
