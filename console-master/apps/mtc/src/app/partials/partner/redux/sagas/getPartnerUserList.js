import { call, put } from 'redux-saga/effects'

import { requestFailure, requestFinished, requestStarted, requestSuccess } from '../../../../../redux/request/actions'
import restClientInitializer from '../../../../../redux/request/sagas'
import { createErrorNotification } from '../../../NotificationContainer/redux/actions'
import { setPartnerUserList } from '../actions'

export default function* getPartnerUserListSaga({ payload }) {
  const requestName = 'get-partner-user-list'
  yield put(requestStarted(requestName))
  const client = yield* restClientInitializer()

  try {
    const response = yield call(client.get, `/auth/partners/${payload.partnerId}/users`)
    yield put(requestSuccess(response, requestName))

    const partnerUserData = response.data.listData.map(value => {
      return {
        name: `${value.firstName} ${value.lastName}`,
        role: value.roles[0],
      }
    })

    yield put(setPartnerUserList(partnerUserData))
    yield put(requestSuccess(response, requestName))
  } catch (error) {
    yield put(createErrorNotification('Getting list of partner users failed.', error))
    yield put(requestFailure(error, requestName))
  } finally {
    yield put(requestFinished(requestName))
  }
}
