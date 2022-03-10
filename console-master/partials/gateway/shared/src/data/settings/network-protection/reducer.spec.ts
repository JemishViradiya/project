//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import { networkProtectionConfigMock } from '@ues-data/gateway'
import reducer from './reducer'
import { ActionType, ReduxSlice, TaskId } from './types'

describe(`${ReduxSlice} reducer`, () => {
  describe(`${ActionType.FetchNetworkProtectionConfigStart}`, () => {
    it(`should set ${TaskId.FetchNetworkProtectionConfigTask} loading state to true`, () => {
      const action = {
        type: ActionType.FetchNetworkProtectionConfigStart,
      }
      const previousState = {
        tasks: {},
        ui: {
          localNetworkProtectionConfig: {},
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.FetchNetworkProtectionConfigTask]: {
            loading: true,
          },
        },
        ui: {
          localNetworkProtectionConfig: {},
        },
      })
    })
  })

  describe(`${ActionType.FetchNetworkProtectionConfigSuccess}`, () => {
    it(`should set ${TaskId.FetchNetworkProtectionConfigTask} loading state to false and add data`, () => {
      const action: any = {
        payload: { data: networkProtectionConfigMock },
        type: ActionType.FetchNetworkProtectionConfigSuccess,
      }
      const previousState = {
        tasks: {
          [TaskId.FetchNetworkProtectionConfigTask]: {
            loading: true,
          },
        },
        ui: {
          localNetworkProtectionConfig: {},
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.FetchNetworkProtectionConfigTask]: {
            loading: false,
            data: action.payload.data,
          },
        },
        ui: {
          localNetworkProtectionConfig: action.payload.data,
        },
      })
    })
  })

  describe(`${ActionType.FetchNetworkProtectionConfigError}`, () => {
    it(`should set ${TaskId.FetchNetworkProtectionConfigTask} loading state to false and add error`, () => {
      const error = new Error()
      const action: any = {
        payload: { error },
        type: ActionType.FetchNetworkProtectionConfigError,
      }
      const previousState = {
        tasks: {
          [TaskId.FetchNetworkProtectionConfigTask]: {
            loading: true,
          },
        },
        ui: {
          localNetworkProtectionConfig: {},
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.FetchNetworkProtectionConfigTask]: {
            loading: false,
            error: action.payload.error,
          },
        },
        ui: {
          localNetworkProtectionConfig: {},
        },
      })
    })
  })

  describe(`${ActionType.UpdateNetworkProtectionConfigStart}`, () => {
    it(`should set ${TaskId.UpdateNetworkProtectionConfigTask} loading state to true`, () => {
      const action: any = {
        type: ActionType.UpdateNetworkProtectionConfigStart,
      }
      const previousState = {
        tasks: {},
        ui: {
          localNetworkProtectionConfig: {},
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.UpdateNetworkProtectionConfigTask]: {
            loading: true,
          },
        },
        ui: {
          localNetworkProtectionConfig: {},
        },
      })
    })
  })

  describe(`${ActionType.UpdateNetworkProtectionConfigSuccess}`, () => {
    it(`should set ${TaskId.UpdateNetworkProtectionConfigTask} loading state to false and add data`, () => {
      const action: any = {
        payload: { data: { ...networkProtectionConfigMock, intrusionProtectionEnabled: false } },
        type: ActionType.UpdateNetworkProtectionConfigSuccess,
      }
      const previousState = {
        tasks: {
          [TaskId.UpdateNetworkProtectionConfigTask]: {
            loading: true,
          },
          [TaskId.FetchNetworkProtectionConfigTask]: {
            loading: false,
            data: networkProtectionConfigMock,
          },
        },
        ui: {
          localNetworkProtectionConfig: networkProtectionConfigMock,
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.UpdateNetworkProtectionConfigTask]: {
            loading: false,
            data: action.payload.data,
          },
          [TaskId.FetchNetworkProtectionConfigTask]: {
            loading: false,
            data: action.payload.data,
          },
        },
        ui: {
          localNetworkProtectionConfig: action.payload.data,
        },
      })
    })
  })

  describe(`${ActionType.UpdateNetworkProtectionConfigError}`, () => {
    it(`should set ${TaskId.UpdateNetworkProtectionConfigTask} loading state to false and add error`, () => {
      const error = new Error()
      const action: any = {
        payload: { error },
        type: ActionType.UpdateNetworkProtectionConfigError,
      }
      const previousState = {
        tasks: {
          [TaskId.UpdateNetworkProtectionConfigTask]: {
            loading: true,
          },
        },
        ui: {
          localNetworkProtectionConfig: {},
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.UpdateNetworkProtectionConfigTask]: {
            loading: false,
            error: action.payload.error,
          },
        },
        ui: {
          localNetworkProtectionConfig: {},
        },
      })
    })
  })

  describe(`${ActionType.UpdateLocalNetworkProtectionConfig}`, () => {
    it(`should set update localNetworkProtectionConfig data`, () => {
      const action: any = {
        payload: { ...networkProtectionConfigMock, intrusionProtectionEnabled: false },
        type: ActionType.UpdateLocalNetworkProtectionConfig,
      }
      const previousState = {
        tasks: {
          [TaskId.FetchNetworkProtectionConfigTask]: {
            loading: false,
            data: networkProtectionConfigMock,
          },
        },
        ui: {
          localNetworkProtectionConfig: networkProtectionConfigMock,
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.FetchNetworkProtectionConfigTask]: {
            loading: false,
            data: networkProtectionConfigMock,
          },
        },
        ui: {
          localNetworkProtectionConfig: action.payload,
        },
      })
    })
  })
})
