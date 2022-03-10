//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import { connectorsMock, tenantConfigurationMock } from '@ues-data/gateway'

import reducer from './reducer'
import { ActionType, ReduxSlice, TaskId } from './types'

describe(`${ReduxSlice} reducer`, () => {
  describe(`${ActionType.FetchConnectorsStart}`, () => {
    it(`should set ${TaskId.FetchConnectorsTask} loading state to true`, () => {
      const action = {
        type: ActionType.FetchConnectorsStart,
      }
      const previousState = {
        tasks: {},
        ui: {
          localConnectorData: {},
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.FetchConnectorsTask]: {
            loading: true,
          },
        },
        ui: {
          localConnectorData: {},
        },
      })
    })
  })

  describe(`${ActionType.FetchConnectorsSuccess}`, () => {
    it(`should set ${TaskId.FetchConnectorsTask} loading state to false and add data`, () => {
      const action: any = {
        payload: { data: connectorsMock },
        type: ActionType.FetchConnectorsSuccess,
      }
      const previousState = {
        tasks: {
          [TaskId.FetchConnectorsTask]: {
            loading: true,
          },
        },
        ui: {
          localConnectorData: {},
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.FetchConnectorsTask]: {
            loading: false,
            data: action.payload.data,
          },
        },
        ui: {
          localConnectorData: {},
        },
      })
    })
  })

  describe(`${ActionType.FetchConnectorsError}`, () => {
    it(`should set ${TaskId.FetchConnectorsTask} loading state to false and add error`, () => {
      const error = new Error()
      const action: any = {
        payload: { error },
        type: ActionType.FetchConnectorsError,
      }
      const previousState = {
        tasks: {
          [TaskId.FetchConnectorsTask]: {
            loading: true,
          },
        },
        ui: {
          localConnectorData: {},
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.FetchConnectorsTask]: {
            loading: false,
            error: action.payload.error,
          },
        },
        ui: {
          localConnectorData: {},
        },
      })
    })
  })

  describe(`${ActionType.FetchConnectorStart}`, () => {
    it(`should set ${TaskId.FetchConnectorTask} loading state to true`, () => {
      const action = {
        type: ActionType.FetchConnectorStart,
      }
      const previousState = {
        tasks: {},
        ui: {
          localConnectorData: {},
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.FetchConnectorTask]: {
            loading: true,
          },
        },
        ui: {
          localConnectorData: {},
        },
      })
    })
  })

  describe(`${ActionType.FetchConnectorSuccess}`, () => {
    it(`should set ${TaskId.FetchConnectorTask} loading state to false and add data`, () => {
      const action: any = {
        payload: { data: connectorsMock[0] },
        type: ActionType.FetchConnectorSuccess,
      }
      const previousState = {
        tasks: {
          [TaskId.FetchConnectorTask]: {
            loading: true,
          },
        },
        ui: {
          localConnectorData: {},
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.FetchConnectorTask]: {
            loading: false,
            data: action.payload.data,
          },
        },
        ui: {
          localConnectorData: action.payload.data,
        },
      })
    })
  })

  describe(`${ActionType.FetchConnectorError}`, () => {
    it(`should set ${TaskId.FetchConnectorTask} loading state to false and add error`, () => {
      const error = new Error()
      const action: any = {
        payload: { error },
        type: ActionType.FetchConnectorError,
      }
      const previousState = {
        tasks: {
          [TaskId.FetchConnectorTask]: {
            loading: true,
          },
        },
        ui: {
          localConnectorData: {},
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.FetchConnectorTask]: {
            loading: false,
            error: action.payload.error,
          },
        },
        ui: {
          localConnectorData: {},
        },
      })
    })
  })

  describe(`${ActionType.DeleteConnectorStart}`, () => {
    it(`should set ${TaskId.DeleteConnectorTask} loading state to true`, () => {
      const action: any = {
        payload: '52087fa844b04b79b8113aa7b3a9f37a',
        type: ActionType.DeleteConnectorStart,
      }
      const previousState = {
        tasks: {
          [TaskId.DeleteConnectorTask]: {
            loading: false,
          },
        },
        ui: {
          localConnectorData: {},
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.DeleteConnectorTask]: {
            loading: true,
          },
        },
        ui: {
          localConnectorData: {},
        },
      })
    })
  })

  describe(`${ActionType.DeleteConnectorSuccess}`, () => {
    it(`should set ${TaskId.DeleteConnectorTask} loading state to false and add data`, () => {
      const action: any = {
        payload: '52087fa844b04b79b8113aa7b3a9f37a',
        type: ActionType.DeleteConnectorSuccess,
      }
      const previousState = {
        tasks: {
          [TaskId.FetchConnectorTask]: {
            loading: false,
            data: connectorsMock[0],
          },
          [TaskId.DeleteConnectorTask]: {
            loading: true,
          },
        },
        ui: {
          localConnectorData: connectorsMock[0],
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.FetchConnectorTask]: {
            loading: false,
            data: {},
          },
          [TaskId.DeleteConnectorTask]: {
            loading: false,
            data: action.payload,
          },
        },
        ui: {
          localConnectorData: {},
        },
      })
    })
  })

  describe(`${ActionType.DeleteConnectorError}`, () => {
    it(`should set ${TaskId.DeleteConnectorTask} loading state to false and add error`, () => {
      const error = new Error()
      const action: any = {
        payload: { error },
        type: ActionType.DeleteConnectorError,
      }
      const previousState = {
        tasks: {
          [TaskId.DeleteConnectorTask]: {
            loading: true,
          },
        },
        ui: {
          localConnectorData: {},
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.DeleteConnectorTask]: {
            loading: false,
            error: action.payload.error,
          },
        },
        ui: {
          localConnectorData: {},
        },
      })
    })
  })

  describe(`${ActionType.UpdateConnectorStart}`, () => {
    it(`should set ${TaskId.UpdateConnectorTask} loading state to true`, () => {
      const action = {
        type: ActionType.UpdateConnectorStart,
      }
      const previousState = {
        tasks: {},
        ui: {
          localConnectorData: {},
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.UpdateConnectorTask]: {
            loading: true,
          },
        },
        ui: {
          localConnectorData: {},
        },
      })
    })
  })

  describe(`${ActionType.UpdateConnectorSuccess}`, () => {
    it(`should set ${TaskId.UpdateConnectorTask} loading state to false and add data`, () => {
      const action: any = {
        payload: { data: { ...connectorsMock[0], name: 'NA - Berlin' } },
        type: ActionType.UpdateConnectorSuccess,
      }
      const previousState = {
        tasks: {
          [TaskId.FetchConnectorTask]: {
            loading: false,
            data: connectorsMock[0],
          },
          [TaskId.UpdateConnectorTask]: {
            loading: true,
          },
        },
        ui: {
          localConnectorData: action.payload.data,
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.FetchConnectorTask]: {
            loading: false,
            data: action.payload.data,
          },
          [TaskId.UpdateConnectorTask]: {
            loading: false,
            data: action.payload.data,
          },
        },
        ui: {
          localConnectorData: action.payload.data,
        },
      })
    })
  })

  describe(`${ActionType.CreateConnectorStart}`, () => {
    it(`should set ${TaskId.CreateConnectorTask} loading state to true`, () => {
      const action = {
        type: ActionType.CreateConnectorStart,
      }
      const previousState = {
        tasks: {},
        ui: {
          localConnectorData: {},
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.CreateConnectorTask]: {
            loading: true,
          },
        },
        ui: {
          localConnectorData: {},
        },
      })
    })
  })

  describe(`${ActionType.CreateConnectorSuccess}`, () => {
    it(`should set ${TaskId.CreateConnectorTask} loading state to false and add data`, () => {
      const action: any = {
        payload: connectorsMock[0],
        type: ActionType.CreateConnectorSuccess,
      }
      const previousState = {
        tasks: {
          [TaskId.CreateConnectorTask]: {
            loading: true,
          },
        },
        ui: {
          localConnectorData: {},
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.CreateConnectorTask]: {
            loading: false,
            data: connectorsMock[0],
          },
        },
        ui: {
          localConnectorData: {},
        },
      })
    })
  })
})
