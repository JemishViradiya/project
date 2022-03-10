//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { ActionWithPayload } from '../create-action'
import type { ReducerHandlers } from '../create-reducer'

export interface Task<TData = unknown> {
  loading?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any
  data?: TData
}

interface StateWithTasks {
  tasks?: { [taskId: string]: Task }
}

export const updateTask = <TState extends StateWithTasks, TTaskId extends keyof Required<TState['tasks']>>(
  state: TState,
  taskId: TTaskId,
  data: Task,
): TState => ({
  ...state,
  tasks: {
    ...state.tasks,
    [taskId]: data,
  },
})

export const updateTasks = <TState extends StateWithTasks, TTaskId extends keyof Required<TState['tasks']>>(
  state: TState,
  tasks: [TTaskId, Task][] = [],
): TState => ({
  ...state,
  tasks: {
    ...state.tasks,
    ...tasks.reduce(
      (acc, [taskId, data]) => ({
        ...acc,
        [taskId]: {
          ...(state.tasks?.[taskId as string] ?? {}),
          ...data,
        },
      }),
      {},
    ),
  },
})

const isTaskLoaded = (currentTask: Task, previousTask: Task): boolean =>
  previousTask?.loading === true && currentTask?.loading === false

export const isTaskResolved = (currentTask: Task, previousTask: Task): boolean =>
  isTaskLoaded(currentTask, previousTask) && currentTask?.error === undefined

export const isTaskRejected = (currentTask: Task, previousTask: Task): boolean =>
  isTaskLoaded(currentTask, previousTask) && currentTask?.error !== undefined

export enum TaskType {
  Start = 'start',
  Success = 'success',
  Error = 'error',
}

type CustomHandlerFunction<TState = unknown, TActions = unknown, TActionType = unknown> = (
  state: TState,
  action: Extract<TActions, { type: TActionType }>,
) => TState

interface TaskConfig<TState, TActions, TActionTypeStart, TActionTypeSuccess, TActionTypeError> {
  [TaskType.Start]: [TActionTypeStart, CustomHandlerFunction<TState, TActions, TActionTypeStart>] | [TActionTypeStart]

  [TaskType.Success]: [TActionTypeSuccess, CustomHandlerFunction<TState, TActions, TActionTypeSuccess>] | [TActionTypeSuccess]

  [TaskType.Error]: [TActionTypeError, CustomHandlerFunction<TState, TActions, TActionTypeError>] | [TActionTypeError]
}

export const taskHandlersCreator = <TState extends StateWithTasks, TActions extends ActionWithPayload>() => <
  TActionTypeStart extends string = string,
  TActionTypeSuccess extends string = string,
  TActionTypeError extends string = string
>(
  taskId: keyof Required<TState['tasks']>,
  taskConfig: TaskConfig<TState, TActions, TActionTypeStart, TActionTypeSuccess, TActionTypeError>,
): ReducerHandlers<TState, TActions> => {
  const defaultTaskHandlersFunctions = {
    [TaskType.Start]: state => updateTask(state, taskId, { loading: true }),
    [TaskType.Error]: (state, action) =>
      updateTask(state, taskId, {
        loading: false,
        error: action.payload.error,
      }),
    [TaskType.Success]: (state, action) =>
      updateTask(state, taskId, {
        loading: false,
        data: action.payload?.data ?? action.payload,
      }),
  }
  const taskHandlerActionType = (taskType: TaskType) => taskConfig[taskType][0]

  const taskHandlerFunction = (taskType: TaskType) => {
    const [, customHandlerFunction] = taskConfig[taskType]

    if (typeof customHandlerFunction === 'function') {
      return (state, action) => {
        const stateWithUpdatedTask = defaultTaskHandlersFunctions[taskType](state, action)
        return customHandlerFunction(stateWithUpdatedTask, action)
      }
    }
    return defaultTaskHandlersFunctions[taskType]
  }

  return Object.values(TaskType).reduce(
    (acc, taskType) => ({
      ...acc,
      [taskHandlerActionType(taskType)]: taskHandlerFunction(taskType),
    }),
    {},
  ) as ReducerHandlers<TState, TActions>
}
