import isEmpty from 'lodash/isEmpty'
import { all, call, put } from 'redux-saga/effects'

import { requestFailure, requestFinished, requestStarted, requestSuccess } from '../../../../../redux/request/actions'
import restClientInitializer from '../../../../../redux/request/sagas'
import { getTenantCountSaga } from '../../../../../redux/tenant/sagas'
import { createErrorNotification } from '../../../NotificationContainer/redux/actions'
import { setPartnerList } from '../actions'

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

export default function* getPartnerListSaga({ payload }) {
  const requestName = 'get-partner-list'

  yield put(requestStarted(requestName))

  const client = yield* restClientInitializer()

  try {
    const response = yield call(client.get, '/partners', payload.params)
    yield put(requestSuccess(response, requestName))

    // Go through all the Partners and make tenant API calls to get the tenant count:
    // Also change the partnerType to the new display names
    let updatedPartnerData = []
    if (!isEmpty(response.data) && response.data.listData.length > 0) {
      updatedPartnerData = yield all(
        response.data.listData.map(function* updatePartner(partner) {
          const newPartner = Object.assign({}, partner)
          const model = {
            partnerId: partner.id,
          }
          const tenantCount = yield call(getTenantCountSaga, model)
          newPartner.tenantCount = tenantCount
          newPartner.partnerType = updatePartnerType(newPartner.partnerType)
          return newPartner
        }),
      )
    }

    // Update the store with the new partner data
    const updatedResponse = { data: { listData: updatedPartnerData, totalCount: response.data.totalCount || 0 } }
    yield put(setPartnerList(updatedResponse))

    yield put(requestSuccess(response, requestName))
  } catch (error) {
    yield put(createErrorNotification('Getting list of partners failed.', error))
    yield put(requestFailure(error, requestName))
  } finally {
    yield put(requestFinished(requestName))
  }
}
