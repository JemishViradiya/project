import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { throwError } from 'redux-saga-test-plan/providers'

import { DevicePoliciesMockApi, MOCK_POLICY_LIST } from './../device-policies-service'
import { fetchDevicePolicyListError, fetchDevicePolicyListStart, fetchDevicePolicyListSuccess } from './actions'
import { DevicePoliciesReduxSlice } from './constants'
import { defaultState } from './reducer'
import { fetchDevicePolicyListSaga } from './sagas'

describe(`${DevicePoliciesReduxSlice} sagas`, () => {
  const mockStateObj = { [DevicePoliciesReduxSlice]: defaultState }

  describe('fetchProductsSaga', () => {
    const action = fetchDevicePolicyListStart(DevicePoliciesMockApi)

    it('should fetch product list', () => {
      return expectSaga(fetchDevicePolicyListSaga, action)
        .withState(mockStateObj)
        .provide([[matchers.call.fn(action.payload.fetchDevicePolicyList), MOCK_POLICY_LIST]])
        .call(DevicePoliciesMockApi.fetchDevicePolicyList)
        .put(fetchDevicePolicyListSuccess(MOCK_POLICY_LIST))
        .run()
    })

    it('should handle error', () => {
      const error = new Error('test error')

      return expectSaga(fetchDevicePolicyListSaga, action)
        .withState(mockStateObj)
        .provide([[matchers.call.fn(action.payload.fetchDevicePolicyList), throwError(error)]])
        .put(fetchDevicePolicyListError(error))
        .run()
    })
  })
})
