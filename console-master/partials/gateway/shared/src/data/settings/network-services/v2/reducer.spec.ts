//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { omit } from 'lodash-es'

import type { NetworkServicesV2 } from '@ues-data/gateway'

import reducer from './reducer'
import { ActionType, ReduxSlice, TaskId } from './types'

const networkServicesMock: NetworkServicesV2.NetworkServiceEntity[] = [
  {
    id: '123dea75-g123-47i5-b93u-8524a66u209z',
    name: 'Google',
    tenantId: 'system',
    fqdns: ['*.google.com', '*.google.ca'],
    ipRanges: ['10.0.0.1/15'],
  },
]
const networkServiceId = '123dea75-g123-47i5-b93u-8524a66u209z'

describe(`${ReduxSlice} reducer`, () => {
  describe(`${ActionType.FetchNetworkServicesStart}`, () => {
    it(`should set ${TaskId.NetworkServices} loading state to true`, () => {
      const action = {
        type: ActionType.FetchNetworkServicesStart,
      }

      const previousState = {
        tasks: {},
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.NetworkServices]: {
            loading: true,
          },
        },
      })
    })
  })

  describe(`${ActionType.FetchNetworkServicesSuccess}`, () => {
    it(`should set ${TaskId.NetworkServices} loading state to false and add data`, () => {
      const action: any = {
        payload: { data: networkServicesMock },
        type: ActionType.FetchNetworkServicesSuccess,
      }

      const previousState = {
        tasks: {
          [TaskId.NetworkServices]: {
            loading: true,
            data: networkServicesMock,
          },
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.NetworkServices]: {
            loading: false,
            data: action.payload.data,
          },
        },
      })
    })
  })

  describe(`${ActionType.FetchNetworkServicesError}`, () => {
    it(`should set ${TaskId.NetworkServices} loading state to false and add error`, () => {
      const error = new Error()
      const action: any = {
        payload: { error },
        type: ActionType.FetchNetworkServicesError,
      }
      const previousState = {
        tasks: {
          [TaskId.NetworkServices]: {
            loading: true,
          },
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.NetworkServices]: {
            loading: false,
            error: action.payload.error,
          },
        },
      })
    })
  })

  describe(`${ActionType.CreateNetworkServiceStart}`, () => {
    it(`should set ${TaskId.CreateNetworkService} loading state to true`, () => {
      const action: any = {
        type: ActionType.CreateNetworkServiceStart,
      }

      const previousState = {
        tasks: {},
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.CreateNetworkService]: {
            loading: true,
          },
        },
      })
    })
  })

  describe(`${ActionType.CreateNetworkServiceSuccess}`, () => {
    it(`should set ${TaskId.CreateNetworkService} loading state to false and add data`, () => {
      const action: any = {
        payload: {
          networkServiceId,
          networkServiceConfig: omit(networkServicesMock[0], 'id'),
        },
        type: ActionType.CreateNetworkServiceSuccess,
      }

      const previousState = {
        tasks: {
          [TaskId.NetworkServices]: {
            loading: false,
          },
          [TaskId.CreateNetworkService]: {
            loading: true,
          },
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.CreateNetworkService]: {
            loading: false,
            data: {
              networkServiceId: action.payload.networkServiceId,
              networkServiceConfig: action.payload.networkServiceConfig,
            },
          },
          [TaskId.NetworkServices]: {
            loading: false,
            data: [
              {
                ...action.payload.networkServiceConfig,
                id: action.payload.networkServiceId,
              },
            ],
          },
        },
      })
    })
  })

  describe(`${ActionType.CreateNetworkServiceError}`, () => {
    it(`should set ${TaskId.CreateNetworkService} loading state to false and add error`, () => {
      const error = new Error()
      const action: any = {
        payload: { error },
        type: ActionType.CreateNetworkServiceError,
      }
      const previousState = {
        tasks: {
          [TaskId.CreateNetworkService]: {
            loading: true,
          },
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.CreateNetworkService]: {
            loading: false,
            error,
          },
        },
      })
    })
  })

  describe(`${ActionType.UpdateNetworkServiceStart}`, () => {
    it(`should set ${TaskId.UpdateNetworkService} loading state to true`, () => {
      const action: any = {
        type: ActionType.UpdateNetworkServiceStart,
      }

      const previousState = {
        tasks: {},
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.UpdateNetworkService]: {
            loading: true,
          },
        },
      })
    })
  })

  describe(`${ActionType.UpdateNetworkServiceSuccess}`, () => {
    it(`should set ${TaskId.UpdateNetworkService} loading state to false and add data`, () => {
      const updatedNetworkServiceConfig = {
        name: 'Vimeo',
        tenantId: 'system',
        fqdns: ['*.google.com', '*.google.ca'],
        ipRanges: ['10.0.0.1/15'],
      }

      const action: any = {
        payload: {
          networkServiceId,
          networkServiceConfig: updatedNetworkServiceConfig,
        },
        type: ActionType.UpdateNetworkServiceSuccess,
      }

      const previousState = {
        tasks: {
          [TaskId.NetworkServices]: {
            loading: false,
            data: networkServicesMock,
          },
          [TaskId.UpdateNetworkService]: {
            loading: true,
          },
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.UpdateNetworkService]: {
            loading: false,
            data: {
              networkServiceId: action.payload.networkServiceId,
              networkServiceConfig: action.payload.networkServiceConfig,
            },
          },
          [TaskId.NetworkServices]: {
            loading: false,
            data: [
              {
                ...action.payload.networkServiceConfig,
                id: action.payload.networkServiceId,
              },
            ],
          },
        },
      })
    })
  })

  describe(`${ActionType.UpdateNetworkServiceError}`, () => {
    it(`should set ${TaskId.CreateNetworkService} loading state to false and add error`, () => {
      const error = new Error()
      const action: any = {
        payload: { error },
        type: ActionType.UpdateNetworkServiceError,
      }
      const previousState = {
        tasks: {
          [TaskId.UpdateNetworkService]: {
            loading: true,
          },
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.UpdateNetworkService]: {
            loading: false,
            error,
          },
        },
      })
    })
  })

  describe(`${ActionType.DeleteNetworkServiceStart}`, () => {
    it(`should set ${TaskId.DeleteNetworkService} loading state to true`, () => {
      const action: any = {
        type: ActionType.DeleteNetworkServiceStart,
      }

      const previousState = {
        tasks: {},
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.DeleteNetworkService]: {
            loading: true,
          },
        },
      })
    })
  })

  describe(`${ActionType.DeleteNetworkServiceSuccess}`, () => {
    it(`should set ${TaskId.DeleteNetworkService} loading state to false and add data`, () => {
      const action: any = {
        payload: {
          networkServiceId,
        },
        type: ActionType.DeleteNetworkServiceSuccess,
      }

      const previousState = {
        tasks: {
          [TaskId.NetworkServices]: {
            loading: false,
            data: networkServicesMock,
          },
          [TaskId.DeleteNetworkService]: {
            loading: true,
          },
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.DeleteNetworkService]: {
            loading: false,
            data: {
              networkServiceId: action.payload.networkServiceId,
            },
          },
          [TaskId.NetworkServices]: {
            loading: false,
            data: [],
          },
        },
      })
    })
  })

  describe(`${ActionType.DeleteNetworkServiceError}`, () => {
    it(`should set ${TaskId.DeleteNetworkService} loading state to false and add error`, () => {
      const error = new Error()
      const action: any = {
        payload: { error },
        type: ActionType.DeleteNetworkServiceError,
      }
      const previousState = {
        tasks: {
          [TaskId.DeleteNetworkService]: {
            loading: true,
          },
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.DeleteNetworkService]: {
            loading: false,
            error: action.payload.error,
          },
        },
      })
    })
  })
})
