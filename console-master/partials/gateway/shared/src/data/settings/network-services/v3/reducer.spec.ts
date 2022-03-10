//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { omit } from 'lodash-es'

import type { NetworkServicesV3 } from '@ues-data/gateway'

import reducer from './reducer'
import { ActionType, ReduxSlice, TaskId } from './types'

const networkServiceMock: NetworkServicesV3.NetworkServiceEntity = {
  id: '123dea75-g123-47i5-b93u-8524a66u209z',
  name: 'Google',
  tenantId: 'L75473134',
  targetSet: [
    {
      addressSet: ['*.google.com', '*.google.ca', '10.0.0.1/15'],
      portSet: [],
    },
  ],
}

const networkServiceId = '123dea75-g123-47i5-b93u-8524a66u209z'

describe(`${ReduxSlice} reducer`, () => {
  describe(`${ActionType.FetchNetworkServiceStart}`, () => {
    it(`should set ${TaskId.FetchNetworkService} loading state to true`, () => {
      const action = {
        type: ActionType.FetchNetworkServiceStart,
      }

      const previousState = {
        tasks: {},
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.FetchNetworkService]: {
            loading: true,
          },
        },
      })
    })
  })

  describe(`${ActionType.FetchNetworkServiceSuccess}`, () => {
    it(`should set ${TaskId.FetchNetworkService} loading state to false and add data`, () => {
      const action: any = {
        payload: { data: networkServiceMock },
        type: ActionType.FetchNetworkServiceSuccess,
      }

      const previousState = {
        tasks: {
          [TaskId.FetchNetworkService]: {
            loading: true,
          },
        },
        ui: {
          localNetworkServiceData: {},
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.FetchNetworkService]: {
            loading: false,
            data: action.payload.data,
          },
        },
        ui: {
          localNetworkServiceData: action.payload.data,
        },
      })
    })
  })

  describe(`${ActionType.FetchNetworkServiceError}`, () => {
    it(`should set ${TaskId.FetchNetworkService} loading state to false and add error`, () => {
      const error = new Error()
      const action: any = {
        payload: { error },
        type: ActionType.FetchNetworkServiceError,
      }
      const previousState = {
        tasks: {
          [TaskId.FetchNetworkService]: {
            loading: true,
          },
        },
      }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          [TaskId.FetchNetworkService]: {
            loading: false,
            error: action.payload.error,
          },
        },
        ui: {
          localNetworkServiceData: {},
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
          id: networkServiceId,
          networkServiceConfig: omit(networkServiceMock, 'id'),
        },
        type: ActionType.CreateNetworkServiceSuccess,
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
            data: {
              id: action.payload.id,
              networkServiceConfig: action.payload.networkServiceConfig,
            },
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
          id: networkServiceId,
          networkServiceConfig: updatedNetworkServiceConfig,
        },
        type: ActionType.UpdateNetworkServiceSuccess,
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
            data: {
              id: action.payload.id,
              networkServiceConfig: action.payload.networkServiceConfig,
            },
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
          id: networkServiceId,
        },
        type: ActionType.DeleteNetworkServiceSuccess,
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
            data: {
              id: action.payload.id,
            },
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

describe(`${ActionType.UpdateLocalNetworkServiceData}`, () => {
  it(`should update localNetworkServiceData`, () => {
    const data = { ...networkServiceMock, name: 'New Network Service Name' }
    const action: any = {
      type: ActionType.UpdateLocalNetworkServiceData,
      payload: data,
    }
    const previousState = {
      tasks: {
        [TaskId.FetchNetworkService]: {
          loading: false,
          data: networkServiceMock,
        },
      },
      ui: {},
    }

    expect(reducer(previousState, action)).toStrictEqual({
      tasks: {
        [TaskId.FetchNetworkService]: {
          loading: false,
          data: networkServiceMock,
        },
      },
      ui: {
        localNetworkServiceData: data,
      },
    })
  })
})

describe(`${ActionType.ClearNetworkService}`, () => {
  it(`should clear ${TaskId.FetchNetworkService} and localNetworkServiceData`, () => {
    const action: any = {
      type: ActionType.ClearNetworkService,
    }
    const previousState = {
      tasks: {
        [TaskId.FetchNetworkService]: {
          loading: false,
          data: networkServiceMock,
        },
      },
      ui: {
        localNetworkServiceData: networkServiceMock,
      },
    }

    expect(reducer(previousState, action)).toStrictEqual({
      tasks: {
        [TaskId.FetchNetworkService]: {
          loading: false,
          data: {},
          error: undefined,
        },
      },
      ui: {
        localNetworkServiceData: {},
      },
    })
  })
})
