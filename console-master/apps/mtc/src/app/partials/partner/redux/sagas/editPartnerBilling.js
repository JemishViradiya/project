import { call, put } from 'redux-saga/effects'

import { requestFailure, requestFinished, requestStarted, requestSuccess } from '../../../../../redux/request/actions'
import restClientInitializer from '../../../../../redux/request/sagas'
import { createErrorNotification, createSuccessNotification } from '../../../NotificationContainer/redux/actions'

export default function* editPartnerBillingSaga({ payload }) {
  const { partnerId, billingValues } = payload
  const requestName = 'edit-partner-billing-info'
  yield put(requestStarted(requestName))
  const client = yield* restClientInitializer()

  try {
    const response = yield call(client.put, `/billing/partners/${partnerId}`, billingValues)
    yield put(requestSuccess(response, requestName))
    yield put(createSuccessNotification('Partner billing info successfully edited.', response))
  } catch (error) {
    yield put(createErrorNotification('Editing partner billing info failed.', error))
    yield put(requestFailure(error, requestName))
  } finally {
    yield put(requestFinished(requestName))
  }
}
