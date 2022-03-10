//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { omit } from 'lodash-es'

import type { NetworkServicesV2 } from '@ues-data/gateway'

import * as selectors from './selectors'
import { ReduxSlice, TaskId } from './types'

const emptyTasksTestCase = { [ReduxSlice]: { tasks: {} } }

const networkServicesMock: NetworkServicesV2.NetworkServiceEntity[] = [
  {
    id: '123dea75-g123-47i5-b93u-8524a66u209z',
    name: 'Google',
    tenantId: 'system',
    fqdns: ['*.google.com', '*.google.ca'],
    ipRanges: ['10.0.0.1/15'],
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

  describe('getNetworkServices', () => {
    it('should return undefined when task is not defined', () => {
      expect(selectors.getNetworkServices(emptyTasksTestCase)).toBeUndefined()
    })

    it('should return data', () => {
      const testCase = {
        [ReduxSlice]: {
          tasks: {
            [TaskId.NetworkServices]: {
              loading: false,
              data: networkServicesMock,
            },
          },
        },
      }

      expect(selectors.getNetworkServices(testCase)).toStrictEqual(networkServicesMock)
    })
  })

  describe('getNetworkServicesTask', () => {
    it('should return undefined when task is not defined', () => {
      expect(selectors.getNetworkServicesTask(emptyTasksTestCase)).toBeUndefined()
    })

    it('should return data', () => {
      const testCase = {
        [ReduxSlice]: {
          tasks: {
            [TaskId.NetworkServices]: {
              loading: false,
              data: networkServicesMock,
            },
          },
        },
      }

      expect(selectors.getNetworkServicesTask(testCase)).toStrictEqual({ data: networkServicesMock, loading: false })
    })
  })

  describe('getCreateNetworkServiceTask', () => {
    it('should return undefined when task is not defined', () => {
      expect(selectors.getCreateNetworkServiceTask(emptyTasksTestCase)).toBeUndefined()
    })

    it('should return data', () => {
      const data = {
        networkServiceId: 'test-id',
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
        networkServiceId: 'test-id',
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
      const data = { networkServiceId: 'test-id' }

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
