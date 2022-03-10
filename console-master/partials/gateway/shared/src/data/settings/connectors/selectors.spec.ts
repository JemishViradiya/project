//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import { connectorsMock } from '@ues-data/gateway'

import * as selectors from './selectors'
import { ReduxSlice, TaskId } from './types'

const defaultState = {
  [ReduxSlice]: {
    tasks: {},
    ui: {},
  },
}

const defaultTasksState = {
  task1: { loading: false },
  task2: { loading: false },
  task3: { loading: true },
}

describe(`${ReduxSlice} selectors`, () => {
  describe('getState', () => {
    const testCase = {
      [ReduxSlice]: {
        tasks: defaultTasksState,
      },
    }

    expect(selectors.getConnectorsState(testCase)).toStrictEqual({ tasks: defaultTasksState })
  })

  describe('getConnectorsTask', () => {
    it('should return undefined when task is not defined', () => {
      expect(selectors.getConnectorsTask(defaultState)).toBeUndefined()
    })

    it('should return data', () => {
      const testCase = {
        [ReduxSlice]: {
          tasks: {
            [TaskId.FetchConnectorsTask]: {
              loading: false,
              data: connectorsMock,
            },
          },
        },
      }

      expect(selectors.getConnectorsTask(testCase)).toStrictEqual({ data: connectorsMock, loading: false })
    })
  })

  describe('getConnectorTask', () => {
    it('should return undefined when task is not defined', () => {
      expect(selectors.getConnectorTask(defaultState)).toBeUndefined()
    })

    it('should return data', () => {
      const testCase = {
        [ReduxSlice]: {
          tasks: {
            [TaskId.FetchConnectorTask]: {
              loading: false,
              data: connectorsMock[0],
            },
          },
        },
      }

      expect(selectors.getConnectorTask(testCase)).toStrictEqual({ data: connectorsMock[0], loading: false })
    })
  })

  describe('getDeleteConnectorTask', () => {
    it('should return undefined when task is not defined', () => {
      expect(selectors.getDeleteConnectorTask(defaultState)).toBeUndefined()
    })

    it('should return data', () => {
      const testCase = {
        [ReduxSlice]: {
          tasks: {
            [TaskId.DeleteConnectorTask]: {
              loading: false,
              data: {},
            },
          },
        },
      }

      expect(selectors.getDeleteConnectorTask(testCase)).toStrictEqual({ data: {}, loading: false })
    })
  })

  describe('getUpdateConnectorTask', () => {
    it('should return undefined when task is not defined', () => {
      expect(selectors.getUpdateConnectorTask(defaultState)).toBeUndefined()
    })

    it('should return data', () => {
      const testCase = {
        [ReduxSlice]: {
          tasks: {
            [TaskId.UpdateConnectorTask]: {
              loading: false,
              data: connectorsMock[0],
            },
          },
        },
      }

      expect(selectors.getUpdateConnectorTask(testCase)).toStrictEqual({ data: connectorsMock[0], loading: false })
    })
  })

  describe('getCreateConnectorTask', () => {
    it('should return undefined when task is not defined', () => {
      expect(selectors.getCreateConnectorTask(defaultState)).toBeUndefined()
    })

    it('should return data', () => {
      const testCase = {
        [ReduxSlice]: {
          tasks: {
            [TaskId.CreateConnectorTask]: {
              loading: false,
              data: connectorsMock[0],
            },
          },
        },
      }

      expect(selectors.getCreateConnectorTask(testCase)).toStrictEqual({ data: connectorsMock[0], loading: false })
    })
  })
})
