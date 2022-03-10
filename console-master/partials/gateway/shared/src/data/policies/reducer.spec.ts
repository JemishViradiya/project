//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { networkAccessControlPolicyMock } from '@ues-data/gateway'

import reducer from './reducer'
import { ActionType, ReduxSlice, TaskId } from './types'

describe(`${ReduxSlice} reducer`, () => {
  describe(`${ActionType.FetchPolicyStart}`, () => {
    it(`should set ${TaskId.Policy} loading state to true`, () => {
      const action: any = {
        type: ActionType.FetchPolicyStart,
      }
      const previousState = {
        tasks: {},
        ui: {},
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.Policy]: {
            loading: true,
          },
        },
        ui: {},
      })
    })
  })

  describe(`${ActionType.FetchPolicySuccess}`, () => {
    it(`should set ${TaskId.Policy} loading state to false and add data`, () => {
      const action: any = {
        payload: { data: networkAccessControlPolicyMock[0] },
        type: ActionType.FetchPolicySuccess,
      }
      const previousState = {
        tasks: {
          [TaskId.Policy]: {
            loading: true,
          },
        },
        ui: {},
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.Policy]: {
            loading: false,
            data: networkAccessControlPolicyMock[0],
          },
        },
        ui: {
          localPolicyData: networkAccessControlPolicyMock[0],
        },
      })
    })
  })

  describe(`${ActionType.FetchPolicyError}`, () => {
    it(`should set ${TaskId.Policy} loading state to false and add error`, () => {
      const error = new Error()
      const action: any = {
        payload: { error },
        type: ActionType.FetchPolicyError,
      }

      const previousState = {
        tasks: {
          [TaskId.Policy]: {
            loading: true,
          },
        },
        ui: {},
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.Policy]: {
            error,
            loading: false,
          },
        },
        ui: {},
      })
    })
  })

  describe(`${ActionType.AddPolicyStart}`, () => {
    it(`should set ${TaskId.AddPolicy} loading state to true`, () => {
      const action: any = {
        type: ActionType.AddPolicyStart,
      }
      const previousState = {
        tasks: {},
        ui: {},
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.AddPolicy]: {
            loading: true,
          },
        },
        ui: {},
      })
    })
  })

  describe(`${ActionType.AddPolicySuccess}`, () => {
    it(`should set ${TaskId.AddPolicy} loading state to false and add data`, () => {
      const action: any = {
        payload: { data: '1234-abcd-3456-xyz1-98765' },
        type: ActionType.AddPolicySuccess,
      }
      const previousState = {
        tasks: {
          [TaskId.Policy]: {
            loading: false,
          },
          [TaskId.AddPolicy]: {
            loading: true,
          },
        },
        ui: {
          localPolicyData: networkAccessControlPolicyMock[0],
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.Policy]: {
            loading: false,
            data: networkAccessControlPolicyMock[0],
          },
          [TaskId.AddPolicy]: {
            loading: false,
            data: action.payload.data,
          },
        },
        ui: {
          localPolicyData: networkAccessControlPolicyMock[0],
        },
      })
    })
  })

  describe(`${ActionType.AddPolicyError}`, () => {
    it(`should set ${TaskId.AddPolicy} loading state to false and add error`, () => {
      const error = new Error()
      const action: any = {
        payload: { error },
        type: ActionType.AddPolicyError,
      }
      const previousState = {
        tasks: {
          [TaskId.AddPolicy]: {
            loading: true,
          },
        },
        ui: {},
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.AddPolicy]: {
            error,
            loading: false,
          },
        },
        ui: {},
      })
    })
  })

  describe(`${ActionType.UpdatePolicyStart}`, () => {
    it(`should set ${TaskId.UpdatePolicy} loading state to true`, () => {
      const action: any = {
        type: ActionType.UpdatePolicyStart,
      }
      const previousState = {
        tasks: {
          [TaskId.UpdatePolicy]: {
            loading: false,
          },
        },
        ui: {
          localPolicyData: networkAccessControlPolicyMock[0],
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.UpdatePolicy]: {
            loading: true,
          },
        },
        ui: {
          localPolicyData: networkAccessControlPolicyMock[0],
        },
      })
    })
  })

  describe(`${ActionType.UpdatePolicySuccess}`, () => {
    it(`should set ${TaskId.UpdatePolicy} loading state to false and add data`, () => {
      const data = { ...networkAccessControlPolicyMock[0], name: 'Test 123' }
      const action: any = {
        type: ActionType.UpdatePolicySuccess,
      }
      const previousState = {
        tasks: {
          [TaskId.Policy]: {
            loading: false,
            data: networkAccessControlPolicyMock[0],
          },
          [TaskId.UpdatePolicy]: {
            loading: true,
          },
        },
        ui: {
          localPolicyData: data,
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.Policy]: {
            loading: false,
            data,
          },
          [TaskId.UpdatePolicy]: {
            loading: false,
            data: undefined,
          },
        },
        ui: {
          localPolicyData: data,
        },
      })
    })
  })

  describe(`${ActionType.UpdatePolicyError}`, () => {
    it(`should set ${TaskId.UpdatePolicy} loading state to false and add error`, () => {
      const error = new Error()
      const action: any = {
        payload: { error },
        type: ActionType.UpdatePolicyError,
      }
      const previousState = {
        tasks: {
          [TaskId.UpdatePolicy]: {
            loading: true,
          },
        },
        ui: {},
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.UpdatePolicy]: {
            error,
            loading: false,
          },
        },
        ui: {},
      })
    })
  })

  describe(`${ActionType.DeletePolicyStart}`, () => {
    it(`should set ${TaskId.DeletePolicy} loading state to true`, () => {
      const action: any = {
        type: ActionType.DeletePolicyStart,
        payload: { id: 'e9a2b066-d37c-4890-94c0-7953e717e635' },
      }
      const previousState = {
        tasks: {
          [TaskId.DeletePolicy]: {
            loading: false,
          },
        },
        ui: {
          localPolicyData: networkAccessControlPolicyMock[0],
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.DeletePolicy]: {
            loading: true,
          },
        },
        ui: {
          localPolicyData: networkAccessControlPolicyMock[0],
        },
      })
    })
  })

  describe(`${ActionType.DeletePolicySuccess}`, () => {
    it(`should set ${TaskId.DeletePolicy} loading state to false and add data`, () => {
      const action: any = {
        type: ActionType.DeletePolicySuccess,
      }
      const previousState = {
        tasks: {
          [TaskId.Policy]: {
            loading: false,
            data: networkAccessControlPolicyMock[0],
          },
          [TaskId.DeletePolicy]: {
            loading: true,
          },
        },
        ui: {
          localPolicyData: networkAccessControlPolicyMock[0],
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.Policy]: {
            loading: false,
            data: {},
          },
          [TaskId.DeletePolicy]: {
            loading: false,
            data: undefined,
          },
        },
        ui: {
          localPolicyData: {},
        },
      })
    })
  })

  describe(`${ActionType.DeletePolicyError}`, () => {
    it(`should set ${TaskId.DeletePolicy} loading state to false and add error`, () => {
      const error = new Error()
      const action: any = {
        payload: { error },
        type: ActionType.DeletePolicyError,
      }
      const previousState = {
        tasks: {
          [TaskId.DeletePolicy]: {
            loading: true,
          },
        },
        ui: {},
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.DeletePolicy]: {
            error,
            loading: false,
          },
        },
        ui: {},
      })
    })
  })

  describe(`${ActionType.DeletePoliciesStart}`, () => {
    it(`should set ${TaskId.DeletePolicies} loading state to true`, () => {
      const action: any = {
        type: ActionType.DeletePoliciesStart,
        payload: { ids: ['e9a2b066-d37c-4890-94c0-7953e717e635', 'e9a2b066-d37c-4890-94c0-7953e717e636'] },
      }
      const previousState = {
        tasks: {
          [TaskId.DeletePolicies]: {
            loading: false,
          },
        },
        ui: {
          localPolicyData: networkAccessControlPolicyMock[0],
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.DeletePolicies]: {
            loading: true,
          },
        },
        ui: {
          localPolicyData: networkAccessControlPolicyMock[0],
        },
      })
    })
  })

  describe(`${ActionType.DeletePoliciesSuccess}`, () => {
    it(`should set ${TaskId.DeletePolicies} loading state to false and add data`, () => {
      const action: any = {
        type: ActionType.DeletePoliciesSuccess,
      }
      const previousState = {
        tasks: {
          [TaskId.DeletePolicies]: {
            loading: true,
          },
        },
        ui: {
          localPolicyData: networkAccessControlPolicyMock[0],
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.DeletePolicies]: {
            loading: false,
            data: undefined,
          },
        },
        ui: {
          localPolicyData: networkAccessControlPolicyMock[0],
        },
      })
    })
  })

  describe(`${ActionType.DeletePoliciesError}`, () => {
    it(`should set ${TaskId.DeletePolicies} loading state to false and add error`, () => {
      const error = new Error()
      const action: any = {
        payload: { error },
        type: ActionType.DeletePoliciesError,
      }
      const previousState = {
        tasks: {
          [TaskId.DeletePolicies]: {
            loading: true,
          },
        },
        ui: {},
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.DeletePolicies]: {
            error,
            loading: false,
          },
        },
        ui: {},
      })
    })
  })

  describe(`${ActionType.UpdateLocalPolicyData}`, () => {
    it(`should update localPolicyData data`, () => {
      const data = { ...networkAccessControlPolicyMock[0], name: 'Test 123' }
      const action: any = {
        type: ActionType.UpdateLocalPolicyData,
        payload: data,
      }
      const previousState = {
        tasks: {
          [TaskId.Policy]: {
            loading: false,
            data: networkAccessControlPolicyMock[0],
          },
        },
        ui: {},
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.Policy]: {
            loading: false,
            data: networkAccessControlPolicyMock[0],
          },
        },
        ui: {
          localPolicyData: data,
        },
      })
    })
  })

  describe(`${ActionType.ClearPolicy}`, () => {
    it(`should clear ${TaskId.Policy} and localPolicyData`, () => {
      const action: any = {
        type: ActionType.ClearPolicy,
      }
      const previousState = {
        tasks: {
          [TaskId.Policy]: {
            loading: false,
            data: networkAccessControlPolicyMock[0],
          },
        },
        ui: {
          localPolicyData: networkAccessControlPolicyMock[0],
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.Policy]: {
            loading: false,
            data: {},
          },
        },
        ui: {
          localPolicyData: {},
        },
      })
    })
  })
})
