//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import { tenantConfigurationMock, TenantHealth } from '@ues-data/gateway'

import reducer from './reducer'
import { ActionType, ReduxSlice, TaskId } from './types'

describe(`${ReduxSlice} reducer`, () => {
  describe(`${ActionType.FetchTenantConfigStart}`, () => {
    it(`should set ${TaskId.FetchTenantConfigTask} loading state to true`, () => {
      const action = {
        type: ActionType.FetchTenantConfigStart,
      }
      const previousState = {
        tasks: {},
        ui: {
          localTenantConfig: {},
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.FetchTenantConfigTask]: {
            loading: true,
          },
        },
        ui: {
          localTenantConfig: {},
        },
      })
    })
  })

  describe(`${ActionType.FetchTenantConfigSuccess}`, () => {
    it(`should set ${TaskId.FetchTenantConfigTask} loading state to false and add data`, () => {
      const action: any = {
        payload: { data: tenantConfigurationMock },
        type: ActionType.FetchTenantConfigSuccess,
      }
      const previousState = {
        tasks: {
          [TaskId.FetchTenantConfigTask]: {
            loading: true,
          },
        },
        ui: {
          localTenantConfig: {},
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.FetchTenantConfigTask]: {
            loading: false,
            data: action.payload.data,
          },
        },
        ui: {
          localTenantConfig: action.payload.data,
        },
      })
    })
  })

  describe(`${ActionType.FetchTenantConfigError}`, () => {
    it(`should set ${TaskId.FetchTenantConfigTask} loading state to false and add error`, () => {
      const error = new Error()
      const action: any = {
        payload: { error },
        type: ActionType.FetchTenantConfigError,
      }
      const previousState = {
        tasks: {
          [TaskId.FetchTenantConfigTask]: {
            loading: true,
          },
        },
        ui: {
          localTenantConfig: {},
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.FetchTenantConfigTask]: {
            loading: false,
            error: action.payload.error,
          },
        },
        ui: {
          localTenantConfig: {},
        },
      })
    })
  })

  describe(`${ActionType.FetchTenantHealthStart}`, () => {
    it(`should set ${TaskId.FetchTenantHealthTask} loading state to true`, () => {
      const action = {
        type: ActionType.FetchTenantHealthStart,
      }
      const previousState = {
        tasks: {},
        ui: {
          localTenantConfig: {},
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.FetchTenantHealthTask]: {
            loading: true,
          },
        },
        ui: {
          localTenantConfig: {},
        },
      })
    })
  })

  describe(`${ActionType.FetchTenantHealthSuccess}`, () => {
    it(`should set ${TaskId.FetchTenantHealthTask} loading state to false and add data`, () => {
      const action: any = {
        payload: { data: { health: TenantHealth.Red } },
        type: ActionType.FetchTenantHealthSuccess,
      }
      const previousState = {
        tasks: {
          [TaskId.FetchTenantHealthTask]: {
            loading: true,
          },
        },
        ui: {
          localTenantConfig: {},
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.FetchTenantHealthTask]: {
            loading: false,
            data: action.payload.data,
          },
        },
        ui: {
          localTenantConfig: {},
        },
      })
    })
  })

  describe(`${ActionType.FetchTenantHealthError}`, () => {
    it(`should set ${TaskId.FetchTenantHealthTask} loading state to false and add error`, () => {
      const error = new Error()
      const action: any = {
        payload: { error },
        type: ActionType.FetchTenantHealthError,
      }
      const previousState = {
        tasks: {
          [TaskId.FetchTenantHealthTask]: {
            loading: true,
          },
        },
        ui: {
          localTenantConfig: {},
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.FetchTenantHealthTask]: {
            loading: false,
            error: action.payload.error,
          },
        },
        ui: {
          localTenantConfig: {},
        },
      })
    })
  })

  describe(`${ActionType.UpdateTenantConfigStart}`, () => {
    it(`should set ${TaskId.UpdateTenantConfigTask} loading state to true`, () => {
      const action = {
        type: ActionType.UpdateTenantConfigStart,
      }
      const previousState = {
        tasks: {},
        ui: {
          localTenantConfig: {},
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.UpdateTenantConfigTask]: {
            loading: true,
          },
        },
        ui: {
          localTenantConfig: {},
        },
      })
    })
  })

  describe(`${ActionType.UpdateTenantConfigSuccess}`, () => {
    it(`should set ${TaskId.UpdateTenantConfigTask} loading state to false and add data`, () => {
      const action: any = {
        payload: { data: { ...tenantConfigurationMock, sourceIPAnchoredEnabled: false } },
        type: ActionType.UpdateTenantConfigSuccess,
      }
      const previousState = {
        tasks: {
          [TaskId.UpdateTenantConfigTask]: {
            loading: true,
          },
          [TaskId.FetchTenantConfigTask]: {
            loading: false,
            data: tenantConfigurationMock,
          },
        },
        ui: {
          localTenantConfig: tenantConfigurationMock,
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.UpdateTenantConfigTask]: {
            loading: false,
            data: action.payload.data,
          },
          [TaskId.FetchTenantConfigTask]: {
            loading: false,
            data: action.payload.data,
          },
        },
        ui: {
          localTenantConfig: action.payload.data,
        },
      })
    })
  })

  describe(`${ActionType.UpdateTenantConfigError}`, () => {
    it(`should set ${TaskId.UpdateTenantConfigTask} loading state to false and add error`, () => {
      const error = new Error()
      const action: any = {
        payload: { error },
        type: ActionType.UpdateTenantConfigError,
      }
      const previousState = {
        tasks: {
          [TaskId.UpdateTenantConfigTask]: {
            loading: true,
          },
        },
        ui: {
          localTenantConfig: {},
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.UpdateTenantConfigTask]: {
            loading: false,
            error: action.payload.error,
          },
        },
        ui: {
          localTenantConfig: {},
        },
      })
    })
  })

  describe(`${ActionType.UpdateLocalTenantConfig}`, () => {
    it(`should set update localTenantConfig data`, () => {
      const action: any = {
        payload: { ...tenantConfigurationMock, sourceIPAnchoredEnabled: false },
        type: ActionType.UpdateLocalTenantConfig,
      }
      const previousState = {
        tasks: {
          [TaskId.FetchTenantConfigTask]: {
            loading: false,
            data: tenantConfigurationMock,
          },
        },
        ui: {
          localTenantConfig: tenantConfigurationMock,
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.FetchTenantConfigTask]: {
            loading: false,
            data: tenantConfigurationMock,
          },
        },
        ui: {
          localTenantConfig: action.payload,
        },
      })
    })
  })
})
