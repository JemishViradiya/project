import { all, takeLatest } from 'redux-saga/effects'

import {
  DELETE_INSTALLATION_TOKEN,
  GET_INSTALLATION_TOKEN,
  GET_TENANT_DEVICE_LIST,
  GET_TENANT_LICENSE_INFO,
  GET_TENANT_LIST,
  REGENERATE_INSTALLATION_TOKEN,
} from '../actions'
import deleteInstallationTokenSaga from './deleteInstallationToken'
import getTenantDeviceListSaga from './getDeviceList'
import getInstallationTokenSaga from './getInstallationToken'
import getTenantLicenseInfoSaga from './getLicenseInfo'
import getTenantCountSaga from './getTenantCount'
import getTenantListSaga from './getTenantList'
import regenerateInstallationTokenSaga from './regenerateInstallationToken'

export {
  deleteInstallationTokenSaga,
  regenerateInstallationTokenSaga,
  getInstallationTokenSaga,
  getTenantListSaga,
  getTenantCountSaga,
  getTenantDeviceListSaga,
  getTenantLicenseInfoSaga,
}

export default function* watchers() {
  yield all([
    takeLatest(DELETE_INSTALLATION_TOKEN, deleteInstallationTokenSaga),
    takeLatest(REGENERATE_INSTALLATION_TOKEN, regenerateInstallationTokenSaga),
    takeLatest(GET_INSTALLATION_TOKEN, getInstallationTokenSaga),
    takeLatest(GET_TENANT_LIST, getTenantListSaga),
    takeLatest(GET_TENANT_DEVICE_LIST, getTenantDeviceListSaga),
    takeLatest(GET_TENANT_LICENSE_INFO, getTenantLicenseInfoSaga),
  ])
}
