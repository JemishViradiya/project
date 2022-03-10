import { call } from 'redux-saga/effects'

import Storage from '../../Storage'
import restClient from '../../utils/restClient'

export default function* restClientInitializer(auth = true) {
  let token = null
  let region
  if (auth) {
    token = Storage.getBearerToken()
  }
  region = yield call(Storage.getRegion)
  return yield call(restClient, token, region === '' ? 'us' : region.toLowerCase())
}
