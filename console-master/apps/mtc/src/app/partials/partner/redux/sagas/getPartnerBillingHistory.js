import { call, put } from 'redux-saga/effects'

import { requestFailure, requestFinished, requestStarted, requestSuccess } from '../../../../../redux/request/actions'
import restClientInitializer from '../../../../../redux/request/sagas'
import { createErrorNotification } from '../../../NotificationContainer/redux/actions'
import { setPartnerBillingHistory } from '../actions'

export default function* getPartnerBillingHistorySaga({ payload }) {
  const requestName = 'get-partner-billing-history'
  yield put(requestStarted(requestName))
  const client = yield* restClientInitializer()

  try {
    const response = yield call(client.get, `/billing/partners/${payload.partnerId}/history`)
    yield put(requestSuccess(response, requestName))
    yield put(setPartnerBillingHistory(response.data))
    yield put(requestSuccess(response, requestName))
  } catch (error) {
    yield put(createErrorNotification('Getting partner billing history failed.', error))
    yield put(requestFailure(error, requestName))
  } finally {
    yield put(requestFinished(requestName))
  }
}
