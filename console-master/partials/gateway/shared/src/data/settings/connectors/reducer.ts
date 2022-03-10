//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { ReducerHandlers } from '../../../utils'
import { createReducer, taskHandlersCreator, updateTasks } from '../../../utils'
import type { ConnectorsActions, ConnectorsState } from './types'
import { ActionType, TaskId } from './types'

const defaultState: ConnectorsState = {
  tasks: {
    [TaskId.FetchConnectorsTask]: { loading: false },
    [TaskId.FetchConnectorTask]: { loading: false },
    [TaskId.DeleteConnectorTask]: { loading: false },
    [TaskId.UpdateConnectorTask]: { loading: false },
    [TaskId.CreateConnectorTask]: { loading: false },
  },
  ui: {
    localConnectorData: {},
  },
}

const createTaskHandlers = taskHandlersCreator<ConnectorsState, ConnectorsActions>()

const updateConnectorTaskData = state => updateTasks(state, [[TaskId.FetchConnectorTask, { data: state.ui.localConnectorData }]])

const handlers: ReducerHandlers<ConnectorsState, ConnectorsActions> = {
  ...createTaskHandlers(TaskId.FetchConnectorsTask, {
    start: [ActionType.FetchConnectorsStart],
    error: [ActionType.FetchConnectorsError],
    success: [ActionType.FetchConnectorsSuccess],
  }),

  ...createTaskHandlers(TaskId.FetchConnectorTask, {
    start: [ActionType.FetchConnectorStart],
    error: [ActionType.FetchConnectorError],
    success: [
      ActionType.FetchConnectorSuccess,
      (state, action) => ({
        ...state,
        ui: { ...state.ui, localConnectorData: { ...action.payload.data } },
      }),
    ],
  }),

  ...createTaskHandlers(TaskId.DeleteConnectorTask, {
    start: [ActionType.DeleteConnectorStart],
    error: [ActionType.DeleteConnectorError],
    success: [
      ActionType.DeleteConnectorSuccess,
      state => ({
        ...updateTasks(state, [[TaskId.FetchConnectorTask, { data: {} }]]),
        ui: { ...state.ui, localConnectorData: {} },
      }),
    ],
  }),

  ...createTaskHandlers(TaskId.UpdateConnectorTask, {
    start: [ActionType.UpdateConnectorStart],
    error: [ActionType.UpdateConnectorError],
    success: [ActionType.UpdateConnectorSuccess, updateConnectorTaskData],
  }),

  [ActionType.ClearConnector]: state => ({
    ...updateTasks(state, [[TaskId.FetchConnectorTask, { data: {} }]]),
    ui: { ...state.ui, localConnectorData: {} },
  }),

  [ActionType.UpdateLocalConnectorData]: (state, action) => ({
    ...state,
    ui: {
      ...state.ui,
      localConnectorData:
        action.payload === undefined
          ? state.tasks?.fetchConnectorTask?.data
          : { ...state.ui.localConnectorData, ...action.payload },
    },
  }),

  ...createTaskHandlers(TaskId.CreateConnectorTask, {
    start: [ActionType.CreateConnectorStart],
    error: [ActionType.CreateConnectorError],
    success: [ActionType.CreateConnectorSuccess],
  }),
}

export default createReducer(defaultState, handlers)
