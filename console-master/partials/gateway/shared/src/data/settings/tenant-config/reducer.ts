//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { ReducerHandlers } from '../../../utils'
import { createReducer, taskHandlersCreator, updateTasks } from '../../../utils'
import type { TenantConfigActions, TenantConfigState } from './types'
import { ActionType, TaskId } from './types'

const defaultState: TenantConfigState = {
  tasks: {
    [TaskId.FetchTenantConfigTask]: { loading: false },
    [TaskId.UpdateTenantConfigTask]: { loading: false },
    [TaskId.FetchTenantHealthTask]: { loading: false },
  },
  ui: {
    localTenantConfig: {},
  },
}

const createTaskHandlers = taskHandlersCreator<TenantConfigState, TenantConfigActions>()

const handlers: ReducerHandlers<TenantConfigState, TenantConfigActions> = {
  ...createTaskHandlers(TaskId.FetchTenantConfigTask, {
    start: [ActionType.FetchTenantConfigStart],
    error: [ActionType.FetchTenantConfigError],
    success: [
      ActionType.FetchTenantConfigSuccess,
      (state, action) => ({
        ...state,
        ui: { ...state.ui, localTenantConfig: action.payload.data },
      }),
    ],
  }),

  ...createTaskHandlers(TaskId.FetchTenantHealthTask, {
    start: [ActionType.FetchTenantHealthStart],
    error: [ActionType.FetchTenantHealthError],
    success: [ActionType.FetchTenantHealthSuccess],
  }),

  ...createTaskHandlers(TaskId.UpdateTenantConfigTask, {
    start: [ActionType.UpdateTenantConfigStart],
    error: [ActionType.UpdateTenantConfigError],
    success: [
      ActionType.UpdateTenantConfigSuccess,
      (state, action) => {
        const updatedData = {
          ...state.tasks.fetchTenantConfigTask.data,
          ...action.payload.data,
        }

        return {
          ...updateTasks(state, [
            [
              TaskId.FetchTenantConfigTask,
              {
                data: updatedData,
              },
            ],
          ]),
          ui: { ...state.ui, localTenantConfig: updatedData },
        }
      },
    ],
  }),

  [ActionType.UpdateLocalTenantConfig]: (state, action) => ({
    ...state,
    ui: {
      ...state.ui,
      localTenantConfig: { ...state.ui.localTenantConfig, ...action.payload },
    },
  }),

  [ActionType.ClearLocalTenantConfig]: state => ({
    ...state,
    ui: { ...state.ui, localTenantConfig: state.tasks?.fetchTenantConfigTask?.data },
  }),
}

export default createReducer(defaultState, handlers)
