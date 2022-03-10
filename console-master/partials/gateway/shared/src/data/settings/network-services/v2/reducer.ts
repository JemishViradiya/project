//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { ReducerHandlers } from '../../../../utils'
import { createReducer, taskHandlersCreator, updateTasks } from '../../../../utils'
import type { NetworkServicesActions, NetworkServicesState } from './types'
import { ActionType, TaskId } from './types'

export const defaultState: NetworkServicesState = {
  tasks: {
    [TaskId.NetworkServices]: { loading: false },
  },
}

const createTaskHandlers = taskHandlersCreator<NetworkServicesState, NetworkServicesActions>()

const handlers: ReducerHandlers<NetworkServicesState, NetworkServicesActions> = {
  ...createTaskHandlers(TaskId.NetworkServices, {
    start: [ActionType.FetchNetworkServicesStart],
    error: [ActionType.FetchNetworkServicesError],
    success: [ActionType.FetchNetworkServicesSuccess],
  }),

  ...createTaskHandlers(TaskId.CreateNetworkService, {
    start: [ActionType.CreateNetworkServiceStart],
    error: [ActionType.CreateNetworkServiceError],
    success: [
      ActionType.CreateNetworkServiceSuccess,
      (state, action) => {
        const newItem = {
          id: action.payload.networkServiceId,
          ...action.payload.networkServiceConfig,
        }

        const newData = [newItem, ...(state.tasks.networkServices?.data || [])]

        return updateTasks(state, [[TaskId.NetworkServices, { data: newData }]])
      },
    ],
  }),

  ...createTaskHandlers(TaskId.UpdateNetworkService, {
    start: [ActionType.UpdateNetworkServiceStart],
    error: [ActionType.UpdateNetworkServiceError],
    success: [
      ActionType.UpdateNetworkServiceSuccess,
      (state, action) => {
        const newData = [...state.tasks.networkServices.data]

        const itemIndex = newData.findIndex(item => item.id === action.payload.networkServiceId)

        newData[itemIndex] = {
          ...newData[itemIndex],
          ...action.payload.networkServiceConfig,
        }

        return updateTasks(state, [[TaskId.NetworkServices, { data: newData }]])
      },
    ],
  }),

  ...createTaskHandlers(TaskId.DeleteNetworkService, {
    start: [ActionType.DeleteNetworkServiceStart],
    error: [ActionType.DeleteNetworkServiceError],
    success: [
      ActionType.DeleteNetworkServiceSuccess,
      (state, action) => {
        const newData = [...state.tasks.networkServices.data]

        newData.splice(
          newData.findIndex(item => action.payload.networkServiceId === item.id),
          1,
        )

        return updateTasks(state, [[TaskId.NetworkServices, { data: newData }]])
      },
    ],
  }),
}

export default createReducer(defaultState, handlers)
