/* eslint-disable sonarjs/max-switch-cases */
/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import * as httpStatus from 'http-status-codes'
import type { Action, Reducer } from 'redux'

import type { ConnectionState, Task } from './types'
import { ActionType } from './types'

interface ActionWithPayload<TActionType extends string, TPayload = any> extends Action<TActionType> {
  payload?: TPayload
}

export const defaultState: ConnectionState = {
  tasks: {
    connectionList: {
      loading: false,
    },
    addConnectionList: {
      loading: false,
    },
    removeConnection: {
      loading: false,
    },
    uemTenantList: {
      loading: false,
    },
    addAppConfig: {
      loading: false,
    },
    groupList: {
      loading: false,
    },
    retryConnection: {
      loading: false,
    },
  },
}

const updateTask = (state: ConnectionState, taskId: string, data: Task): ConnectionState => ({
  ...state,
  tasks: {
    ...state.tasks,
    [taskId]: data,
  },
})

const handleError = (state: ConnectionState, task: string, action: ActionWithPayload<string>) => {
  return updateTask(state, task, {
    loading: false,
    error: action.payload.error,
  })
}

// eslint-disable-next-line sonarjs/cognitive-complexity
const reducer: Reducer<ConnectionState, ActionWithPayload<ActionType>> = (state = defaultState, action) => {
  switch (action.type) {
    // Get connections
    case ActionType.GetConnectionsStart:
      return updateTask(state, 'connectionList', { loading: true })
    case ActionType.GetConnectionsError:
      try {
        if (action.payload.error.response.status !== httpStatus.NOT_FOUND) {
          return handleError(state, 'connectionList', action)
        } else {
          return updateTask(state, 'connectionList', { loading: false, result: [] })
        }
      } catch (error) {
        return handleError(state, 'connectionList', action)
      }
    case ActionType.GetConnectionsSuccess:
      return updateTask(state, 'connectionList', { loading: false, result: action.payload.emm })

    // Add Connections
    case ActionType.AddConnectionsStart:
      return updateTask(state, 'addConnectionList', { loading: true })
    case ActionType.AddConnectionsError:
      return handleError(state, 'addConnectionList', action)
    case ActionType.AddConnectionsSuccess:
      if (action.payload.emm['status'] !== undefined && action.payload.emm['status'] === httpStatus.CREATED) {
        return updateTask(state, 'addConnectionList', { loading: false })
      }
      if (action.payload.emm['status'] !== undefined && action.payload.emm['status'] === httpStatus.MULTI_STATUS) {
        const errAction = {
          type: ActionType.AddConnectionsError,
          payload: {
            error: JSON.stringify(action.payload.emm),
          },
        }
        return handleError(state, 'addConnectionList', errAction)
      }
      return updateTask(state, 'addConnectionList', { loading: false })
    //Remove Connection
    case ActionType.RemoveConnectionStart:
      return updateTask(state, 'removeConnection', { loading: true })
    case ActionType.RemoveConnectionError:
      try {
        if (action.payload.error.response.status !== httpStatus.INTERNAL_SERVER_ERROR) {
          return handleError(state, 'removeConnection', action)
        } else {
          if (action.payload.error.response['data']['subStatusCode'] === httpStatus.MULTI_STATUS) {
            state.tasks.connectionList.result['data'] = state.tasks.connectionList.result['data'].filter(d => d.type !== 'INTUNE')
            return {
              ...state,
              tasks: {
                ...state.tasks,
                removeConnection: { loading: false },
                connectionList: {
                  loading: false,
                  result: {
                    data: state.tasks.connectionList.result['data'],
                    status: state.tasks.connectionList.result['status'],
                  },
                },
              },
            }
          } else {
            return handleError(state, 'removeConnection', action)
          }
        }
      } catch (error) {
        return handleError(state, 'removeConnection', action)
      }
    case ActionType.RemoveConnectionSuccess:
      if (state.tasks.connectionList.result['status'] === httpStatus.OK) {
        state.tasks.connectionList.result['data'] = state.tasks.connectionList.result['data'].filter(
          d => d.type !== action.payload.emm.type,
        )
      } else {
        const conn = state.tasks.connectionList.result['data']['responses'].filter(d => {
          return d.body.type !== action.payload.emm.type
        })
        state.tasks.connectionList.result['data']['responses'] = conn
      }
      return {
        ...state,
        tasks: {
          ...state.tasks,
          removeConnection: { loading: false },
          connectionList: {
            loading: false,
            result: {
              data: state.tasks.connectionList.result['data'],
              status: state.tasks.connectionList.result['status'],
            },
          },
        },
      }
    //Get UEM tenants list
    case ActionType.GetUEMTenantsStart:
      return updateTask(state, 'uemTenantList', { loading: true })
    case ActionType.GetUEMTenantsError:
      return handleError(state, 'uemTenantList', action)
    case ActionType.GetUEMTenantsSuccess:
      if (action.payload.emm.data !== undefined && action.payload.emm.data.uemTenants !== undefined) {
        return updateTask(state, 'uemTenantList', { loading: false, result: action.payload.emm.data })
      } else {
        return handleError(state, 'uemTenantList', action)
      }
    // Add App config
    case ActionType.AddAppConfigStart:
      return updateTask(state, 'addAppConfig', { loading: true })
    case ActionType.AddAppConfigError:
      return handleError(state, 'addAppConfig', action)
    case ActionType.AddAppConfigSuccess:
      if (action.payload.emm['status'] !== undefined && action.payload.emm['status'] === httpStatus.CREATED) {
        return updateTask(state, 'addAppConfig', { loading: false })
      }
      if (action.payload.emm['status'] !== undefined && action.payload.emm['status'] === httpStatus.MULTI_STATUS) {
        const errAction = {
          type: ActionType.AddAppConfigError,
          payload: {
            error: action.payload.emm,
          },
        }
        return handleError(state, 'addAppConfig', errAction)
      }
      return updateTask(state, 'addAppConfig', { loading: false })

    // Retry Connection
    case ActionType.RetryConnectionStart:
      return updateTask(state, 'retryConnection', { loading: true })
    case ActionType.RetryConnectionSuccess:
      return updateTask(state, 'retryConnection', { loading: false })
    case ActionType.RetryConnectionError:
      return handleError(state, 'retryConnection', action)

    // Get group list
    case ActionType.GetGroupsStart:
      return updateTask(state, 'groupList', { loading: true })
    case ActionType.GetGroupsError:
      try {
        if (action.payload.error.response.status !== httpStatus.NOT_FOUND) {
          return handleError(state, 'groupList', action)
        } else {
          return updateTask(state, 'groupList', { loading: false, result: [] })
        }
      } catch (error) {
        return handleError(state, 'groupList', action)
      }
    case ActionType.GetGroupsSuccess:
      return updateTask(state, 'groupList', { loading: false, result: action.payload.emm })

    //default
    default:
      return state
  }
}

export default reducer
