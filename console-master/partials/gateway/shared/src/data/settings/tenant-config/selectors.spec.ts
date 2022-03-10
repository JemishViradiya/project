//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import { connectorsMock, tenantConfigurationMock, TenantHealth, TenantPrivateDnsZonesType } from '@ues-data/gateway'

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

    expect(selectors.getTenantConfigState(testCase)).toStrictEqual({ tasks: defaultTasksState })
  })

  describe('getTenantConfigTasks', () => {
    const testCase = { [ReduxSlice]: { tasks: defaultTasksState } }

    expect(selectors.getTenantConfigTasks(testCase)).toStrictEqual(defaultTasksState)
  })

  describe('getTenantConfigurationTask', () => {
    it('should return undefined when task is not defined', () => {
      expect(selectors.getTenantConfigurationTask(defaultState)).toBeUndefined()
    })

    it('should return data', () => {
      const testCase = {
        [ReduxSlice]: {
          tasks: {
            [TaskId.FetchTenantConfigTask]: {
              loading: false,
              data: tenantConfigurationMock,
            },
          },
        },
      }

      expect(selectors.getTenantConfigurationTask(testCase)).toStrictEqual({ data: tenantConfigurationMock, loading: false })
    })
  })

  describe('getTenantHealthTask', () => {
    it('should return undefined when task is not defined', () => {
      expect(selectors.getTenantHealthTask(defaultState)).toBeUndefined()
    })

    it('should return data', () => {
      const data = { health: TenantHealth.Red }
      const testCase = {
        [ReduxSlice]: {
          tasks: {
            [TaskId.FetchTenantHealthTask]: {
              loading: false,
              data,
            },
          },
        },
      }

      expect(selectors.getTenantHealthTask(testCase)).toStrictEqual({ data, loading: false })
    })
  })

  describe('getUpdateTenantConfigurationTask', () => {
    it('should return undefined when task is not defined', () => {
      expect(selectors.getUpdateTenantConfigurationTask(defaultState)).toBeUndefined()
    })

    it('should return data', () => {
      const testCase = {
        [ReduxSlice]: {
          tasks: {
            [TaskId.UpdateTenantConfigTask]: {
              loading: false,
              data: tenantConfigurationMock,
            },
          },
        },
      }

      expect(selectors.getUpdateTenantConfigurationTask(testCase)).toStrictEqual({ data: tenantConfigurationMock, loading: false })
    })
  })

  describe('getLocalTenantConfig', () => {
    it('should return undefined when localTenantConfig is not defined', () => {
      expect(selectors.getLocalTenantConfig(defaultState)).toBeUndefined()
    })

    it('should return data', () => {
      const testCase = {
        [ReduxSlice]: {
          tasks: {
            [TaskId.FetchTenantConfigTask]: {
              loading: false,
              data: tenantConfigurationMock,
            },
          },
          ui: {
            localTenantConfig: tenantConfigurationMock,
          },
        },
      }

      expect(selectors.getLocalTenantConfig(testCase)).toStrictEqual(tenantConfigurationMock)
    })
  })

  describe('getPrivateDnsZones', () => {
    it('should return undefined when localTenantConfig is not defined', () => {
      expect(selectors.getPrivateDnsZones(defaultState)).toBeUndefined()
    })

    it('should return data', () => {
      const testCase = {
        [ReduxSlice]: {
          tasks: {
            [TaskId.FetchTenantConfigTask]: {
              loading: false,
              data: tenantConfigurationMock,
            },
          },
          ui: {
            localTenantConfig: tenantConfigurationMock,
          },
        },
      }

      expect(selectors.getPrivateDnsZones(testCase)).toStrictEqual(tenantConfigurationMock.privateDnsZones)
    })
  })

  describe('getPrivateDnsZonesByType', () => {
    it('should return [] when localTenantConfig is not defined', () => {
      expect(selectors.getPrivateDnsZonesByType(defaultState)(TenantPrivateDnsZonesType.ForwardZones)).toEqual([])
    })

    it('should return data', () => {
      const testCase = {
        [ReduxSlice]: {
          tasks: {
            [TaskId.FetchTenantConfigTask]: {
              loading: false,
              data: tenantConfigurationMock,
            },
          },
          ui: {
            localTenantConfig: tenantConfigurationMock,
          },
        },
      }

      expect(selectors.getPrivateDnsZonesByType(testCase)(TenantPrivateDnsZonesType.ForwardZones)).toStrictEqual(
        tenantConfigurationMock?.privateDnsZones?.forwardZones[0],
      )
    })
  })

  describe('getHasUnsavedTenantChanges', () => {
    it('should return `true` when there changes in the local data', () => {
      const testCase = {
        [ReduxSlice]: {
          tasks: {
            [TaskId.FetchTenantConfigTask]: {
              loading: false,
              data: tenantConfigurationMock,
            },
          },
          ui: {
            localTenantConfig: {
              ...tenantConfigurationMock,
              sourceIPAnchoredEnabled: false,
            },
          },
        },
      }

      expect(selectors.getHasUnsavedTenantChanges(testCase)(['sourceIPAnchoredEnabled'])).toBe(true)
    })

    it('should return `false` when there is no changes in the local data', () => {
      const testCase = {
        [ReduxSlice]: {
          tasks: {
            [TaskId.FetchTenantConfigTask]: {
              loading: false,
              data: tenantConfigurationMock,
            },
          },
          ui: {
            localTenantConfig: tenantConfigurationMock,
          },
        },
      }

      expect(selectors.getHasUnsavedTenantChanges(testCase)(['sourceIPAnchoredEnabled'])).toBe(false)
    })
  })
})
