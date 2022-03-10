import { DevicePoliciesMockApi, MOCK_POLICY_LIST } from './../device-policies-service'
import { fetchDevicePolicyListError, fetchDevicePolicyListStart, fetchDevicePolicyListSuccess } from './actions'
import { DevicePoliciesActions, DevicePoliciesReduxSlice, DevicePoliciesTaskId } from './constants'
import reducer, { defaultState } from './reducer'

describe(`${DevicePoliciesReduxSlice} reducer`, () => {
  describe(`${DevicePoliciesTaskId.FetchDevicePolicyList}`, () => {
    describe(`${DevicePoliciesActions.FetchDevicePolicyListStart}`, () => {
      it(`should set ${DevicePoliciesTaskId.FetchDevicePolicyList} loading state to true`, () => {
        const action = fetchDevicePolicyListStart(DevicePoliciesMockApi)

        expect(reducer(defaultState, action).tasks).toEqual(
          expect.objectContaining({
            [DevicePoliciesTaskId.FetchDevicePolicyList]: {
              loading: true,
              result: [],
            },
          }),
        )
      })
    })
    describe(`${DevicePoliciesActions.FetchDevicePolicyListSuccess}`, () => {
      it(`should set ${DevicePoliciesTaskId.FetchDevicePolicyList} loading state to false and add data`, () => {
        const action = fetchDevicePolicyListSuccess(MOCK_POLICY_LIST)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [DevicePoliciesTaskId.FetchDevicePolicyList]: {
              loading: true,
              result: [],
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [DevicePoliciesTaskId.FetchDevicePolicyList]: {
              loading: false,
              result: MOCK_POLICY_LIST,
            },
          }),
        )
      })
    })

    describe(`${DevicePoliciesActions.FetchDevicePolicyListError}`, () => {
      it(`should set ${DevicePoliciesTaskId.FetchDevicePolicyList} loading state to false and add error`, () => {
        const error = new Error('test error')
        const action = fetchDevicePolicyListError(error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [DevicePoliciesTaskId.FetchDevicePolicyList]: {
              loading: true,
              result: MOCK_POLICY_LIST,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [DevicePoliciesTaskId.FetchDevicePolicyList]: {
              error,
              loading: false,
              result: MOCK_POLICY_LIST,
            },
          }),
        )
      })
    })
  })
})
