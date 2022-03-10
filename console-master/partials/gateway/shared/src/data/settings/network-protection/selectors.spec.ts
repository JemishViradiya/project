//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import { networkProtectionConfigMock } from '@ues-data/gateway'

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

    expect(selectors.getNetworkProtectionConfigState(testCase)).toStrictEqual({ tasks: defaultTasksState })
  })

  describe('getNetworkProtectionConfigTasks', () => {
    const testCase = { [ReduxSlice]: { tasks: defaultTasksState } }

    expect(selectors.getNetworkProtectionConfigTasks(testCase)).toStrictEqual(defaultTasksState)
  })

  describe('getNetworkProtectionConfigTask', () => {
    it('should return undefined when task is not defined', () => {
      expect(selectors.getNetworkProtectionConfigTask(defaultState)).toBeUndefined()
    })

    it('should return data', () => {
      const testCase = {
        [ReduxSlice]: {
          tasks: {
            [TaskId.FetchNetworkProtectionConfigTask]: {
              loading: false,
              data: networkProtectionConfigMock,
            },
          },
        },
      }

      expect(selectors.getNetworkProtectionConfigTask(testCase)).toStrictEqual({
        data: networkProtectionConfigMock,
        loading: false,
      })
    })
  })

  describe('getUpdateNetworkProtectionConfigTask', () => {
    it('should return undefined when task is not defined', () => {
      expect(selectors.getUpdateNetworkProtectionConfigTask(defaultState)).toBeUndefined()
    })

    it('should return data', () => {
      const testCase = {
        [ReduxSlice]: {
          tasks: {
            [TaskId.UpdateNetworkProtectionConfigTask]: {
              loading: false,
              data: networkProtectionConfigMock,
            },
          },
        },
      }

      expect(selectors.getUpdateNetworkProtectionConfigTask(testCase)).toStrictEqual({
        data: networkProtectionConfigMock,
        loading: false,
      })
    })
  })

  describe('getLocalNetworkProtectionConfig', () => {
    it('should return undefined when localNetworkProtectionConfig is not defined', () => {
      expect(selectors.getLocalNetworkProtectionConfig(defaultState)).toBeUndefined()
    })

    it('should return data', () => {
      const testCase = {
        [ReduxSlice]: {
          tasks: {
            [TaskId.FetchNetworkProtectionConfigTask]: {
              loading: false,
              data: networkProtectionConfigMock,
            },
          },
          ui: {
            localNetworkProtectionConfig: networkProtectionConfigMock,
          },
        },
      }

      expect(selectors.getLocalNetworkProtectionConfig(testCase)).toStrictEqual(networkProtectionConfigMock)
    })
  })

  describe('getHasUnsavedNetworkProtectionChanges', () => {
    it('should return `true` when there changes in the local data', () => {
      const testCase = {
        [ReduxSlice]: {
          tasks: {
            [TaskId.FetchNetworkProtectionConfigTask]: {
              loading: false,
              data: networkProtectionConfigMock,
            },
          },
          ui: {
            localNetworkProtectionConfig: {
              ...networkProtectionConfigMock,
              intrusionProtectionEnabled: false,
            },
          },
        },
      }

      expect(selectors.getHasUnsavedNetworkProtectionChanges(testCase)(['intrusionProtectionEnabled'])).toBe(true)
    })

    it('should return `false` when there is no changes in the local data', () => {
      const testCase = {
        [ReduxSlice]: {
          tasks: {
            [TaskId.FetchNetworkProtectionConfigTask]: {
              loading: false,
              data: networkProtectionConfigMock,
            },
          },
          ui: {
            localNetworkProtectionConfig: networkProtectionConfigMock,
          },
        },
      }

      expect(selectors.getHasUnsavedNetworkProtectionChanges(testCase)(['intrusionProtectionEnabled'])).toBe(false)
    })
  })
})
