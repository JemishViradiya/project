import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { accountReducer, notificationReducer, partnerReducer } from '@mtc/redux-partials'

import appReducer from './app/reducers'
import authReducer from './auth/reducers'
import dataGridReducer from './dataGrid/reducers'
import featureReducer from './feature/reducers'
import formsReducer from './form/reducers'
import requestsReducer from './request/reducers'
import roleReducer from './role/reducers'
import installationTokenReducer from './tenant/InstallationTokenReducer'
import tenantReducer from './tenant/TenantReducer'

const authPersistConfig = {
  key: 'auth',
  storage: storage,
}

const rootReducer = combineReducers({
  'app-metadata': appReducer,
  'data-grid': dataGridReducer,
  'installation-token': installationTokenReducer,
  auth: persistReducer(authPersistConfig, authReducer),
  features: featureReducer,
  notification: notificationReducer,
  requests: requestsReducer,
  forms: formsReducer,
  role: roleReducer,
  tenants: tenantReducer,
  account: accountReducer,
  partners: partnerReducer,
})

export default rootReducer
