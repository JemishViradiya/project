//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { AccessControlType, gatewayAppPolicyMock, networkAccessControlPolicyMock, networkServicesMock } from '@ues-data/gateway'

import * as selectors from './selectors'
import { ReduxSlice, TaskId } from './types'

const defaultState = { [ReduxSlice]: { tasks: {} } }

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

    expect(selectors.getState(testCase)).toStrictEqual({ tasks: defaultTasksState })
  })

  describe('getTasks', () => {
    const testCase = { [ReduxSlice]: { tasks: defaultTasksState } }

    expect(selectors.getTasks(testCase)).toStrictEqual(defaultTasksState)
  })

  describe('getPolicy', () => {
    it('should return undefined when task is not defined', () => {
      expect(selectors.getPolicy(defaultState)).toBeUndefined()
    })

    it('should return data', () => {
      const testCase = {
        [ReduxSlice]: {
          tasks: {
            [TaskId.Policy]: {
              loading: false,
              data: networkAccessControlPolicyMock[0],
            },
          },
        },
      }

      expect(selectors.getPolicy(testCase)).toStrictEqual(networkAccessControlPolicyMock[0])
    })
  })

  describe('getLocalPolicyData', () => {
    it('should return undefined when localPolicyData is not defined', () => {
      expect(selectors.getLocalPolicyData(defaultState)).toBeUndefined()
    })

    it('should return localPolicyData', () => {
      const testCase = {
        [ReduxSlice]: {
          tasks: {
            [TaskId.Policy]: {
              loading: false,
              data: networkAccessControlPolicyMock[0],
            },
          },
          ui: {
            localPolicyData: networkAccessControlPolicyMock[0],
          },
        },
      }

      expect(selectors.getLocalPolicyData(testCase)).toStrictEqual(networkAccessControlPolicyMock[0])
    })
  })

  describe('getAccessControlListItems', () => {
    it('should return empty arrays for allowed and blocked when localPolicyData is not defined', () => {
      expect(selectors.getAccessControlListItems(defaultState)).toEqual({ allowed: [], blocked: [] })
    })

    it('should return valid items', () => {
      const accessControlListItems = {
        allowed: [
          {
            indexInParentArray: 0,
            name: 'Office 365',
            parentType: 'allowed',
            type: 'networkServices',
            value: 's380dea71-e423-47b5-b93c-2934a66f209c',
          },
          {
            indexInParentArray: 1,
            name: 'Saleforce',
            parentType: 'allowed',
            type: 'networkServices',
            value: 's480dea71-g423-47b5-b93c-2934a66h209h',
          },
          {
            indexInParentArray: 0,
            name: '*.blackberry.com',
            parentType: 'allowed',
            type: 'fqdns',
            value: '*.blackberry.com',
          },
          {
            indexInParentArray: 1,
            name: 'www.google.ca',
            parentType: 'allowed',
            type: 'fqdns',
            value: 'www.google.ca',
          },
          {
            indexInParentArray: 0,
            name: '10.0.0.0/24',
            parentType: 'allowed',
            type: 'ipRanges',
            value: '10.0.0.0/24',
          },
          {
            indexInParentArray: 1,
            name: '10.10.0.10',
            parentType: 'allowed',
            type: 'ipRanges',
            value: '10.10.0.10',
          },
          {
            indexInParentArray: 2,
            name: '10.100.0.1-10.100.0.25',
            parentType: 'allowed',
            type: 'ipRanges',
            value: '10.100.0.1-10.100.0.25',
          },
        ],
        blocked: [
          {
            indexInParentArray: 0,
            name: 'WebEx',
            parentType: 'blocked',
            type: 'networkServices',
            value: 's123dea75-g483-47i5-b93u-2914a66u209t',
          },
          {
            indexInParentArray: 0,
            name: 'www.yahoo.com',
            parentType: 'blocked',
            type: 'fqdns',
            value: 'www.yahoo.com',
          },
          {
            indexInParentArray: 1,
            name: 'www.cnn.com',
            parentType: 'blocked',
            type: 'fqdns',
            value: 'www.cnn.com',
          },
          {
            indexInParentArray: 0,
            name: '3.10.0.0/24',
            parentType: 'blocked',
            type: 'ipRanges',
            value: '3.10.0.0/24',
          },
        ],
      }
      const testCase = {
        [ReduxSlice]: {
          tasks: {
            [TaskId.Policy]: {
              loading: false,
              data: networkAccessControlPolicyMock[0],
            },
          },
          ui: {
            localPolicyData: networkAccessControlPolicyMock[0],
          },
        },
      }

      expect(selectors.getAccessControlListItems(testCase)).toStrictEqual(accessControlListItems)
    })
  })

  describe('getAndroidAccessControlListItems', () => {
    it('should return undefined when localPolicyData is not defined', () => {
      expect(selectors.getAndroidAccessControlListItems(defaultState)).toStrictEqual([])
    })

    it('should return valid items', () => {
      const androidAccessControlListItems = [
        {
          indexInParentArray: 0,
          name: '10.0.0.0/20',
          value: '10.0.0.0/20',
        },
      ]
      const testCase = {
        [ReduxSlice]: {
          tasks: {
            [TaskId.Policy]: {
              loading: false,
              data: gatewayAppPolicyMock[0],
            },
          },
          ui: {
            localPolicyData: {
              ...gatewayAppPolicyMock[0],
              platforms: {
                Android: {
                  perAppVpn: {
                    appIds: ['10.0.0.0/20'],
                  },
                },
              },
            },
          },
        },
      }

      expect(selectors.getAndroidAccessControlListItems(testCase)).toStrictEqual(androidAccessControlListItems)
    })
  })

  describe('getSplitTunnelingListItems', () => {
    it('should return undefined when localPolicyData is not defined', () => {
      expect(selectors.getSplitTunnelingListItems(defaultState)).toBeUndefined()
    })

    it('should return valid items', () => {
      const splitTunnelingListItems = [
        {
          indexInParentArray: 0,
          name: '10.0.0.0/20',
          value: '10.0.0.0/20',
        },
        {
          indexInParentArray: 1,
          name: '1.0.0.0/10',
          value: '1.0.0.0/10',
        },
      ]
      const testCase = {
        [ReduxSlice]: {
          tasks: {
            [TaskId.Policy]: {
              loading: false,
              data: gatewayAppPolicyMock,
            },
          },
          ui: {
            localPolicyData: {
              ...gatewayAppPolicyMock[0],
              splitIpRanges: ['10.0.0.0/20', '1.0.0.0/10'],
            },
          },
        },
      }

      expect(selectors.getSplitTunnelingListItems(testCase)).toStrictEqual(splitTunnelingListItems)
    })
  })

  describe('getPolicyTask', () => {
    it('should return undefined when task is not defined', () => {
      expect(selectors.getPolicyTask(defaultState)).toBeUndefined()
    })

    it('should return data', () => {
      const testCase = {
        [ReduxSlice]: {
          tasks: {
            [TaskId.Policy]: {
              loading: false,
              data: networkAccessControlPolicyMock[0],
            },
          },
          ui: {
            localPolicyData: networkAccessControlPolicyMock[0],
          },
        },
      }

      expect(selectors.getPolicyTask(testCase)).toStrictEqual({ data: networkAccessControlPolicyMock[0], loading: false })
    })
  })

  describe('getAddPolicyTask', () => {
    it('should return undefined when task is not defined', () => {
      expect(selectors.getAddPolicyTask(defaultState)).toBeUndefined()
    })

    it('should return data', () => {
      const testCase = {
        [ReduxSlice]: {
          tasks: {
            [TaskId.AddPolicy]: {
              loading: false,
              data: networkServicesMock,
            },
          },
          ui: {},
        },
      }

      expect(selectors.getAddPolicyTask(testCase)).toStrictEqual({ data: networkServicesMock, loading: false })
    })
  })

  describe('getUpdatePolicyTask', () => {
    it('should return undefined when task is not defined', () => {
      expect(selectors.getUpdatePolicyTask(defaultState)).toBeUndefined()
    })

    it('should return data', () => {
      const testCase = {
        [ReduxSlice]: {
          tasks: {
            [TaskId.UpdatePolicy]: {
              loading: false,
              data: networkServicesMock,
            },
          },
          ui: {},
        },
      }

      expect(selectors.getUpdatePolicyTask(testCase)).toStrictEqual({ data: networkServicesMock, loading: false })
    })
  })

  describe('getDeletePolicyTask', () => {
    it('should return undefined when task is not defined', () => {
      expect(selectors.getDeletePolicyTask(defaultState)).toBeUndefined()
    })

    it('should return data', () => {
      const testCase = {
        [ReduxSlice]: {
          tasks: {
            [TaskId.DeletePolicy]: {
              loading: false,
              data: undefined,
            },
          },
          ui: {},
        },
      }

      expect(selectors.getDeletePolicyTask(testCase)).toStrictEqual({ data: undefined, loading: false })
    })
  })

  describe('getDeletePoliciesTask', () => {
    it('should return undefined when task is not defined', () => {
      expect(selectors.getDeletePoliciesTask(defaultState)).toBeUndefined()
    })

    it('should return data', () => {
      const testCase = {
        [ReduxSlice]: {
          tasks: {
            [TaskId.DeletePolicies]: {
              loading: false,
              data: undefined,
            },
          },
          ui: {},
        },
      }

      expect(selectors.getDeletePoliciesTask(testCase)).toStrictEqual({ data: undefined, loading: false })
    })
  })

  describe('getHasUnsavedPolicyChanges', () => {
    it('should return `true` when there is new changes in local data', () => {
      const testCase = {
        [ReduxSlice]: {
          tasks: {
            [TaskId.Policy]: {
              loading: false,
              data: networkServicesMock,
            },
          },
          ui: {
            localPolicyData: {
              ...networkServicesMock,
              name: 'New Policy Name',
            },
          },
        },
      }

      expect(selectors.getHasUnsavedPolicyChanges(testCase)).toBe(true)
    })

    it('should return `false` when there is no new changes in local data', () => {
      const testCase = {
        [ReduxSlice]: {
          tasks: {
            [TaskId.Policy]: {
              loading: false,
              data: networkServicesMock,
            },
          },
          ui: {
            localPolicyData: networkServicesMock,
          },
        },
      }

      expect(selectors.getHasUnsavedPolicyChanges(testCase)).toBe(false)
    })
  })
})
