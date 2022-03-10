import { all, call, put } from 'redux-saga/effects'

import { createErrorNotification, getPartnerDetailsByIdSaga } from '@mtc/redux-partials'

import Storage from '../../../Storage'
import { safeGet } from '../../../utils/safe'
import { requestFailure, requestFinished, requestStarted, requestSuccess } from '../../request/actions'
import restClientInitializer from '../../request/sagas'
import { setTenantList } from '../actions'
import getTenantLicenseInfoSaga from './getLicenseInfo'

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function* getTenantListSaga({ payload }) {
  const initialRequestName = 'get-tenant-list'
  const secondRequestName = 'get-tenant-partner-data'
  yield put(requestStarted(initialRequestName))
  const client = yield* restClientInitializer()
  const { gridParams, noResolve } = payload
  try {
    const response = yield call(client.get, '/tenants', gridParams)
    yield put(requestSuccess(response, initialRequestName))

    // Filter out all pending tenants without a venueTenantId from the response
    // Iterate backwards since splicing reindexes subsequent entries in the array
    for (let i = response.data.listData.length - 1; i >= 0; i--) {
      if (response.data.listData[i].venueTenantId == null && response.data.listData[i].status === 'Pending') {
        response.data.listData.splice(i, 1)
      }
    }

    // Set the list with the initial data
    yield put(setTenantList(response))
    yield put(requestSuccess(response, initialRequestName))
    yield put(requestFinished(initialRequestName))
    if (!noResolve) {
      // Make a new request for updating the tenant data with the partner data
      yield put(requestStarted(secondRequestName))

      let partnerData = null
      if (Storage.checkPermission('partner:list')) {
        partnerData = yield all(
          response.data.listData.map(tenant => {
            const partnerId = safeGet(null)('partner.id', tenant)
            return call(getPartnerDetailsByIdSaga, partnerId)
          }),
        )
      }
      const updatedListData = yield all(
        response.data.listData.map(function* updateTenant(tenant) {
          const newTenant = Object.assign({}, tenant)
          const licenseInfo = yield call(getTenantLicenseInfoSaga, { payload: { tenantId: tenant.id } })
          if (licenseInfo.tenantEntitlementModel !== null) {
            const {
              totalProtectLicenses,
              totalOpticsLicenses,
              totalPersonaLicenses,
              totalGatewayLicenses,
              totalDlpLicenses,
            } = licenseInfo.tenantEntitlementModel
            newTenant.protectLicenseCount = totalProtectLicenses
            if (totalProtectLicenses > 0) {
              newTenant.protectLicenseUsage = 0
              newTenant.mtdLicenseUsage = 0
            }
            newTenant.opticsLicenseCount = totalOpticsLicenses
            if (totalOpticsLicenses >= 0) {
              newTenant.opticsLicenseUsage = 0
            }
            newTenant.personaLicenseCount = totalPersonaLicenses
            if (totalPersonaLicenses >= 0) {
              newTenant.personaLicenseUsage = 0
              newTenant.personaMobileLicenseUsage = 0
            }
            newTenant.gatewayLicenseCount = totalGatewayLicenses
            if (totalGatewayLicenses >= 0) {
              newTenant.gatewayLicenseUsage = 0
            }
            newTenant.dlpLicenseCount = totalDlpLicenses
            if (totalDlpLicenses >= 0) {
              newTenant.dlpLicenseUsage = 0
            }
            if (licenseInfo.licenseUsageModel !== null) {
              const { protectDeviceCount, opticsDeviceCount, personaCount } = licenseInfo.licenseUsageModel
              const {
                protectMobileCount,
                personaMobileCount,
                gatewayCount,
                dlpCount,
              } = licenseInfo.licenseUsageModel.ecsPillarCounts
              newTenant.protectLicenseUsage = totalProtectLicenses <= 0 ? 0 : protectDeviceCount
              newTenant.mtdLicenseUsage = totalProtectLicenses <= 0 ? 0 : protectMobileCount
              newTenant.opticsLicenseUsage = totalOpticsLicenses <= 0 ? 0 : opticsDeviceCount
              newTenant.gatewayLicenseUsage = totalGatewayLicenses <= 0 ? 0 : gatewayCount
              newTenant.dlpLicenseUsage = totalDlpLicenses <= 0 ? 0 : dlpCount
              newTenant.personaLicenseUsage = totalPersonaLicenses <= 0 ? 0 : personaCount
              newTenant.personaMobileLicenseUsage = totalPersonaLicenses <= 0 ? 0 : personaMobileCount
            }
          }
          if (partnerData !== null && newTenant.partner && newTenant.partner.id) {
            const partnerMatch = partnerData.find(partner => partner !== null && partner.id === newTenant.partner.id)
            newTenant.partner = partnerMatch ? partnerMatch.name : null
          }
          return newTenant
        }),
      )
      const updatedResponse = { data: { listData: updatedListData, totalCount: response.data.totalCount } }
      yield put(setTenantList(updatedResponse))
      yield put(requestSuccess(response, secondRequestName))
    }
  } catch (error) {
    yield put(createErrorNotification('Getting list of tenants failed.', error))
    yield put(requestFailure(error, initialRequestName))
    yield put(requestFailure(error, secondRequestName))
  } finally {
    yield put(requestFinished(secondRequestName))
  }
}
