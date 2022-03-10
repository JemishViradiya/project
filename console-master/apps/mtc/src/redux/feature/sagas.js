import { call, put, takeLatest } from 'redux-saga/effects'

import { requestFailure, requestFinished, requestStarted, requestSuccess } from '../request/actions'
import restClientInitializer from '../request/sagas'
import { FEATURE_REQUEST, setFeatures } from './actions'

export function* featureSaga() {
  const requestName = 'features'

  yield put(requestStarted(requestName))

  const client = yield* restClientInitializer()

  try {
    const response = yield call(client.get, '/kv-store/features')
    yield put(setFeatures(response.data))
    yield put(requestSuccess(response, requestName))
  } catch (error) {
    yield put(requestFailure(error, requestName))
  } finally {
    yield put(requestFinished(requestName))
  }
}

export default function* featureWatcher() {
  yield takeLatest(FEATURE_REQUEST, featureSaga)
}
