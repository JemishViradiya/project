//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { ReducerHandlers } from '../../../../utils'
import { createReducer, taskHandlersCreator, updateTasks } from '../../../../utils'
import type { NetworkServicesActions, NetworkServicesState } from './types'
import { ActionType, TaskId } from './types'

export const defaultState: NetworkServicesState = {
  tasks: {},
  ui: { localNetworkServiceData: {} },
}

const createTaskHandlers = taskHandlersCreator<NetworkServicesState, NetworkServicesActions>()

const handlers: ReducerHandlers<NetworkServicesState, NetworkServicesActions> = {
  ...createTaskHandlers(TaskId.FetchNetworkService, {
    start: [ActionType.FetchNetworkServiceStart],
    error: [
      ActionType.FetchNetworkServiceError,
      state => ({
        ...state,
        ui: { ...state.ui, localNetworkServiceData: {} },
      }),
    ],
    success: [
      ActionType.FetchNetworkServiceSuccess,
      (state, action) => ({
        ...state,
        ui: { ...state.ui, localNetworkServiceData: action.payload.data },
      }),
    ],
  }),

  ...createTaskHandlers(TaskId.CreateNetworkService, {
    start: [ActionType.CreateNetworkServiceStart],
    error: [ActionType.CreateNetworkServiceError],
    success: [ActionType.CreateNetworkServiceSuccess],
  }),

  ...createTaskHandlers(TaskId.UpdateNetworkService, {
    start: [ActionType.UpdateNetworkServiceStart],
    error: [ActionType.UpdateNetworkServiceError],
    success: [ActionType.UpdateNetworkServiceSuccess],
  }),

  ...createTaskHandlers(TaskId.DeleteNetworkService, {
    start: [ActionType.DeleteNetworkServiceStart],
    error: [ActionType.DeleteNetworkServiceError],
    success: [ActionType.DeleteNetworkServiceSuccess],
  }),

  [ActionType.UpdateLocalNetworkServiceData]: (state, action) => ({
    ...state,
    ui: {
      ...state.ui,
      localNetworkServiceData: { ...state.ui.localNetworkServiceData, ...action.payload },
    },
  }),

  [ActionType.ClearNetworkService]: state => ({
    ...updateTasks(state, [[TaskId.FetchNetworkService, { data: {}, error: undefined }]]),
    ui: { ...state.ui, localNetworkServiceData: {} },
  }),
}

export default createReducer(defaultState, handlers)
