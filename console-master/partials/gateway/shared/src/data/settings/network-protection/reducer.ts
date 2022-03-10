//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { merge } from 'lodash-es'

import type { ReducerHandlers } from '../../../utils'
import { createReducer, taskHandlersCreator, updateTasks } from '../../../utils'
import type { NetworkProtectionConfigActions, NetworkProtectionConfigState } from './types'
import { ActionType, TaskId } from './types'

export const defaultState: NetworkProtectionConfigState = {
  tasks: {
    [TaskId.FetchNetworkProtectionConfigTask]: { loading: false },
    [TaskId.UpdateNetworkProtectionConfigTask]: { loading: false },
  },
  ui: {
    localNetworkProtectionConfig: {},
  },
}

const createTaskHandlers = taskHandlersCreator<NetworkProtectionConfigState, NetworkProtectionConfigActions>()

const handlers: ReducerHandlers<NetworkProtectionConfigState, NetworkProtectionConfigActions> = {
  ...createTaskHandlers(TaskId.FetchNetworkProtectionConfigTask, {
    start: [ActionType.FetchNetworkProtectionConfigStart],
    error: [ActionType.FetchNetworkProtectionConfigError],
    success: [
      ActionType.FetchNetworkProtectionConfigSuccess,
      (state, action) => ({
        ...state,
        ui: { ...state.ui, localNetworkProtectionConfig: action.payload.data },
      }),
    ],
  }),

  ...createTaskHandlers(TaskId.UpdateNetworkProtectionConfigTask, {
    start: [ActionType.UpdateNetworkProtectionConfigStart],
    error: [ActionType.UpdateNetworkProtectionConfigError],
    success: [
      ActionType.UpdateNetworkProtectionConfigSuccess,
      (state, action) => {
        const updatedData = {
          ...state.tasks.fetchNetworkProtectionConfigTask.data,
          ...action.payload.data,
        }

        return {
          ...updateTasks(state, [
            [
              TaskId.FetchNetworkProtectionConfigTask,
              {
                data: updatedData,
              },
            ],
          ]),
          ui: { ...state.ui, localNetworkProtectionConfig: updatedData },
        }
      },
    ],
  }),

  [ActionType.UpdateLocalNetworkProtectionConfig]: (state, action) => ({
    ...state,
    ui: {
      ...state.ui,
      localNetworkProtectionConfig: merge({}, state.ui.localNetworkProtectionConfig, action.payload),
    },
  }),

  [ActionType.ClearLocalNetworkProtectionConfig]: state => ({
    ...state,
    ui: { ...state.ui, localNetworkProtectionConfig: state.tasks?.fetchNetworkProtectionConfigTask?.data },
  }),
}

export default createReducer(defaultState, handlers)
