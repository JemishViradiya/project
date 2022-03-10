import { call, put } from 'redux-saga/effects'

import { requestFailure, requestFinished, requestStarted, requestSuccess } from '../../../../../redux/request/actions'
import restClientInitializer from '../../../../../redux/request/sagas'
import { createErrorNotification } from '../../../NotificationContainer/redux/actions'
import { setPartnerDetails } from '../actions'

function updatePartnerType(oldPartnerType) {
  switch (oldPartnerType) {
    case 'mssp':
      return 'MSSP'
    case 'oem':
      return 'OEM'
    case 'alliance':
      return 'Technical Alliance'
    case 'mtc':
      return 'Multi-Tenant Enterprise'
    case 'cylance':
      return 'Cylance'
    default:
      return null
  }
}

export default function* getPartnerDetailsSaga({ payload }) {
  const requestName = 'get-partner-details'
  yield put(requestStarted(requestName))
  const client = yield* restClientInitializer()

  try {
    const response = yield call(client.get, `/partners/${payload.partnerId}`)

    // Change the partnerType to the new display names
    const updatedPartner = Object.assign({}, response)
    if (updatedPartner.data.partnerType) {
      updatedPartner.data.partnerType = updatePartnerType(updatedPartner.data.partnerType)
    }

    yield put(setPartnerDetails(updatedPartner.data))
    yield put(requestSuccess(response, requestName))
  } catch (error) {
    yield put(createErrorNotification('Getting partner details failed.', error))
    yield put(requestFailure(error, requestName))
  } finally {
    yield put(requestFinished(requestName))
  }
}
