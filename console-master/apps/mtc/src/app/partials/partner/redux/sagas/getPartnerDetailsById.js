import { call, put } from 'redux-saga/effects'

import { requestFailure, requestFinished, requestStarted, requestSuccess } from '../../../../../redux/request/actions'
import restClientInitializer from '../../../../../redux/request/sagas'

export default function* getPartnerDetailsByIdSaga(partnerId) {
  const requestName = 'get-partner-details-by-id'
  yield put(requestStarted(requestName))
  const client = yield* restClientInitializer()
  let response = {}

  try {
    response = yield call(client.get, `/partners/${partnerId}`)
    yield put(requestSuccess(response, requestName))
    return response.data
  } catch (error) {
    yield put(requestFailure(error, requestName))
    return response
  } finally {
    yield put(requestFinished(requestName))
  }
}
