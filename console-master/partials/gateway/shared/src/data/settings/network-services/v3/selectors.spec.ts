//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { omit } from 'lodash-es'

import type { NetworkServicesV3 } from '@ues-data/gateway'

import * as selectors from './selectors'
import { ReduxSlice, TaskId } from './types'

const emptyTasksTestCase = { [ReduxSlice]: { tasks: {} } }

const networkServicesMock: NetworkServicesV3.NetworkServiceEntity[] = [
  {
    id: '123dea75-g123-47i5-b93u-8524a66u209z',
    name: 'Google',
    tenantId: 'L75473134',
  },
  {
    id: '667dea75-g123-47i5-b34u-2125a66u989c',
    name: 'Atlassian',
    metadata: {
      description: 'Atlassian Network Service',
    },
    tenantId: 'L75473134',
    networkServices: [
      { id: '123dea75-g123-47i5-b93u-8524a66u209z', name: 'Google' },
      { id: '667dea75-g123-47i5-b34u-2978a66u989d', name: 'blackberrysquare' },
    ],
  },
]

const tasks = {
  task1: { loading: false },
  task2: { loading: false },
  task3: { loading: true },
}

describe(`${ReduxSlice} selectors`, () => {
  describe('getNetworkServicesState', () => {
    const testCase = { [ReduxSlice]: { tasks } }

    expect(selectors.getNetworkServicesState(testCase)).toStrictEqual({ tasks })
  })

  describe('getNetworkServicesTasks', () => {
    const testCase = { [ReduxSlice]: { tasks } }

    expect(selectors.getNetworkServicesTasks(testCase)).toStrictEqual(tasks)
  })

  describe('getNetworkServiceTask', () => {
    it('should return undefined when task is not defined', () => {
      expect(selectors.getNetworkServiceTask(emptyTasksTestCase)).toBeUndefined()
    })

    it('should return data', () => {
      const testCase = {
        [ReduxSlice]: {
          tasks: {
            [TaskId.FetchNetworkService]: {
              loading: false,
              data: networkServicesMock[0],
            },
            ui: {
              localNetworkServiceData: networkServicesMock[0],
            },
          },
        },
      }

      expect(selectors.getNetworkServiceTask(testCase)).toStrictEqual({ data: networkServicesMock[0], loading: false })
    })
  })

  describe('getCreateNetworkServiceTask', () => {
    it('should return undefined when task is not defined', () => {
      expect(selectors.getCreateNetworkServiceTask(emptyTasksTestCase)).toBeUndefined()
    })

    it('should return data', () => {
      const data = {
        id: 'test-id',
        networkServiceConfig: omit(networkServicesMock, 'id'),
      }
      const testCase = {
        [ReduxSlice]: {
          tasks: {
            [TaskId.CreateNetworkService]: {
              loading: false,
              data,
            },
          },
        },
      }

      expect(selectors.getCreateNetworkServiceTask(testCase)).toStrictEqual({ data, loading: false })
    })
  })

  describe('getUpdateNetworkServiceTask', () => {
    it('should return undefined when task is not defined', () => {
      expect(selectors.getUpdateNetworkServiceTask(emptyTasksTestCase)).toBeUndefined()
    })

    it('should return data', () => {
      const data = {
        id: 'test-id',
        networkServiceConfig: omit(networkServicesMock, 'id'),
      }

      const testCase = {
        [ReduxSlice]: {
          tasks: {
            [TaskId.UpdateNetworkService]: {
              loading: false,
              data,
            },
          },
        },
      }

      expect(selectors.getUpdateNetworkServiceTask(testCase)).toStrictEqual({ data, loading: false })
    })
  })

  describe('getDeleteNetworkServiceTask', () => {
    it('should return undefined when task is not defined', () => {
      expect(selectors.getDeleteNetworkServiceTask(emptyTasksTestCase)).toBeUndefined()
    })

    it('should return data', () => {
      const data = { id: 'test-id' }

      const testCase = {
        [ReduxSlice]: {
          tasks: {
            [TaskId.DeleteNetworkService]: {
              loading: false,
              data,
            },
          },
        },
      }

      expect(selectors.getDeleteNetworkServiceTask(testCase)).toStrictEqual({ data, loading: false })
    })
  })
})

describe('getHasUnsavedNetworkServiceChanges', () => {
  it('should return `true` when there is new changes in local data', () => {
    const testCase = {
      [ReduxSlice]: {
        tasks: {
          [TaskId.FetchNetworkService]: {
            loading: false,
            data: networkServicesMock[0],
          },
        },
        ui: {
          localNetworkServiceData: {
            ...networkServicesMock[0],
            name: 'New Network Service Name',
          },
        },
      },
    }

    expect(selectors.getHasUnsavedNetworkServiceChanges(testCase)).toBe(true)
  })

  it('should return `false` when there is no new changes in local data', () => {
    const testCase = {
      [ReduxSlice]: {
        tasks: {
          [TaskId.FetchNetworkService]: {
            loading: false,
            data: networkServicesMock[0],
          },
        },
        ui: {
          localNetworkServiceData: networkServicesMock[0],
        },
      },
    }

    expect(selectors.getHasUnsavedNetworkServiceChanges(testCase)).toBe(false)
  })
})
