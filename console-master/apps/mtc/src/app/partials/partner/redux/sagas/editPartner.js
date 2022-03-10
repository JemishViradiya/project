import { call, put } from 'redux-saga/effects'

import { requestFailure, requestFinished, requestStarted, requestSuccess } from '../../../../../redux/request/actions'
import restClientInitializer from '../../../../../redux/request/sagas'
import { createErrorNotification, createSuccessNotification } from '../../../NotificationContainer/redux/actions'

function updatePartnerType(oldPartnerType) {
  switch (oldPartnerType) {
    case 'MSSP':
      return 'mssp'
    case 'OEM':
      return 'oem'
    case 'Technical Alliance':
      return 'alliance'
    case 'Multi-Tenant Enterprise':
      return 'mtc'
    case 'Cylance':
      return 'cylance'
    default:
      return null
  }
}

export default function* editPartnerSaga({ payload }) {
  const { partnerId, partnerModel } = payload
  const requestName = 'edit-partner'
  yield put(requestStarted(requestName))
  const client = yield* restClientInitializer()

  try {
    // Change the partnerType from the new display names to the values the backend expects
    const updatedPartnerModel = Object.assign({}, partnerModel)
    if (updatedPartnerModel.partnerType) {
      updatedPartnerModel.partnerType = updatePartnerType(updatedPartnerModel.partnerType)
    }
    // if bbCustomerId did not change do not send it to backend
    if (updatedPartnerModel.oldBbCustomerId === updatedPartnerModel.bbCustomerId) {
      updatedPartnerModel.oldBbCustomerId = null
      updatedPartnerModel.bbCustomerId = null
    }

    Object.keys(updatedPartnerModel).forEach(key => {
      if (updatedPartnerModel[key] === '') {
        updatedPartnerModel[key] = null
      }
    })
    const response = yield call(client.put, `/partners/${partnerId}`, updatedPartnerModel)
    yield put(requestSuccess(response, requestName))
    yield put(createSuccessNotification('Partner successfully edited.', response))
  } catch (error) {
    let errorMessage = 'Editing partner info failed.'
    if (error.response && (error.response.status === 409 || error.response.status === 400)) {
      errorMessage = ''
      const { modelState } = error.response.data
      if (modelState) {
        Object.keys(modelState).forEach(key => {
          errorMessage += `Partner ${modelState[key][0].toLowerCase()}. `
        })
      } else {
        errorMessage = error.response.data
      }
    }
    yield put(createErrorNotification(errorMessage, error))
    yield put(requestFailure(error, requestName))
  } finally {
    yield put(requestFinished(requestName))
  }
}
