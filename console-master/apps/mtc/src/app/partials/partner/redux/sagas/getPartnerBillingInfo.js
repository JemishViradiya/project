import { call, put } from 'redux-saga/effects'

import { requestFailure, requestFinished, requestStarted, requestSuccess } from '../../../../../redux/request/actions'
import restClientInitializer from '../../../../../redux/request/sagas'
import { createErrorNotification } from '../../../NotificationContainer/redux/actions'
import { setPartnerBillingInfo } from '../actions'

export default function* getPartnerBillingInfoSaga({ payload }) {
  const requestName = 'get-partner-billing-info'
  yield put(requestStarted(requestName))
  const client = yield* restClientInitializer()

  try {
    const response = yield call(client.get, `/billing/partners/${payload.partnerId}`)
    yield put(requestSuccess(response, requestName))
    yield put(setPartnerBillingInfo(response.data))
    yield put(requestSuccess(response, requestName))
  } catch (error) {
    if (error.response.status !== 404) {
      yield put(createErrorNotification('Getting partner billing info failed.', error))
      yield put(requestFailure(error, requestName))
    }
  } finally {
    yield put(requestFinished(requestName))
  }
}
