import type { Action, Reducer } from 'redux'

import { EppDashboardAction, TaskId } from './constants'
import type { EppDashboardState, Task } from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface ActionWithPayload<TActionType extends string, TPayload = any> extends Action<TActionType> {
  payload?: TPayload
}

const defaultState: EppDashboardState = {
  tasks: {
    threatStats: {
      loading: false,
    },
    totalFilesAnalyzed: {
      loading: false,
    },
    threatsByPriority: {
      loading: false,
    },
    threatProtectionPercentage: {
      loading: false,
    },
    deviceProtectionPercentage: {
      loading: false,
    },
    topTenLists: {
      loading: false,
    },
    threatEvents: {
      loading: false,
    },
  },
}

const updateTask = (state: EppDashboardState, taskId: string, data: Task): EppDashboardState => ({
  ...state,
  tasks: {
    ...state.tasks,
    [taskId]: data,
  },
})

const reducer: Reducer<EppDashboardState, ActionWithPayload<string>> = (state = defaultState, action) => {
  switch (action.type) {
    case EppDashboardAction.FetchThreatStatsStart:
      return updateTask(state, TaskId.ThreatStats, { ...state.tasks.threatStats, loading: true })

    case EppDashboardAction.FetchThreatStatsSuccess:
      return updateTask(state, TaskId.ThreatStats, { loading: false, result: { ...action.payload } })

    case EppDashboardAction.FetchThreatStatsError:
      return updateTask(state, TaskId.ThreatStats, { loading: false, error: action.payload.error })

    case EppDashboardAction.FetchTotalFilesAnalyzedStart:
      return updateTask(state, TaskId.TotalFilesAnalyzed, { ...state.tasks.totalFilesAnalyzed, loading: true })

    case EppDashboardAction.FetchTotalFilesAnalyzedSuccess:
      return updateTask(state, TaskId.TotalFilesAnalyzed, { loading: false, result: { ...action.payload } })

    case EppDashboardAction.FetchTotalFilesAnalyzedError:
      return updateTask(state, TaskId.TotalFilesAnalyzed, { loading: false, error: action.payload.error })

    case EppDashboardAction.FetchThreatsByPriorityStart:
      return updateTask(state, TaskId.ThreatsByPriority, { ...state.tasks.threatsByPriority, loading: true })

    case EppDashboardAction.FetchThreatsByPrioritySuccess:
      return updateTask(state, TaskId.ThreatsByPriority, { loading: false, result: { ...action.payload } })

    case EppDashboardAction.FetchThreatsByPriorityError:
      return updateTask(state, TaskId.ThreatsByPriority, { loading: false, error: action.payload.error })

    case EppDashboardAction.FetchThreatProtectionPercentageStart:
      return updateTask(state, TaskId.ThreatProtectionPercentage, { ...state.tasks.threatProtectionPercentage, loading: true })

    case EppDashboardAction.FetchThreatProtectionPercentageSuccess:
      return updateTask(state, TaskId.ThreatProtectionPercentage, { loading: false, result: action.payload })

    case EppDashboardAction.FetchThreatProtectionPercentageError:
      return updateTask(state, TaskId.ThreatProtectionPercentage, { loading: false, error: action.payload.error })

    case EppDashboardAction.FetchDeviceProtectionPercentageStart:
      return updateTask(state, TaskId.DeviceProtectionPercentage, { ...state.tasks.deviceProtectionPercentage, loading: true })

    case EppDashboardAction.FetchDeviceProtectionPercentageSuccess:
      return updateTask(state, TaskId.DeviceProtectionPercentage, { loading: false, result: action.payload })

    case EppDashboardAction.FetchDeviceProtectionPercentageError:
      return updateTask(state, TaskId.DeviceProtectionPercentage, { loading: false, error: action.payload.error })

    case EppDashboardAction.FetchTopTenListStart:
      return updateTask(state, TaskId.TopTenLists, { ...state.tasks.topTenLists, loading: true })

    case EppDashboardAction.FetchTopTenListSuccess:
      return updateTask(state, TaskId.TopTenLists, { loading: false, result: { ...action.payload } })

    case EppDashboardAction.FetchTopTenListError:
      return updateTask(state, TaskId.TopTenLists, { loading: false, error: action.payload.error })

    case EppDashboardAction.FetchThreatEventsStart:
      return updateTask(state, TaskId.ThreatEvents, { ...state.tasks.threatEvents, loading: true })

    case EppDashboardAction.FetchThreatEventsSuccess:
      return updateTask(state, TaskId.ThreatEvents, { loading: false, result: action.payload })

    case EppDashboardAction.FetchThreatEventsError:
      return updateTask(state, TaskId.ThreatEvents, { loading: false, error: action.payload.error })

    default:
      return state
  }
}

export default reducer
