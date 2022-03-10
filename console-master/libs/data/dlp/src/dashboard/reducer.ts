/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { Action, Reducer } from 'redux'

import type { DashboardState, Task } from './types'
import { DashboardActionType, TaskId } from './types'

interface ActionWithPayload<TActionType extends string, TPayload = any> extends Action<TActionType> {
  payload?: TPayload
}

export const defaultState: DashboardState = {
  tasks: {
    getTopEvents: {
      loading: false,
    },
    exfiltrationTypeEvents: {
      loading: false,
    },
    evidenceLockerInfo: {
      loading: false,
    },
    getTotalSensitiveFilesOnEndpoints: {
      loading: false,
    },
    getNumberActiveDevices: {
      loading: false,
    },
    getNumberActiveUsers: {
      loading: false,
    },
    getSensitiveFilesOnEndpoints: {
      loading: false,
    },
  },
}

const updateTask = (state: DashboardState, taskId: string, data: Task): DashboardState => ({
  ...state,
  tasks: {
    ...state.tasks,
    [taskId]: data,
  },
})

const updateTopEventsTask = (state: DashboardState, taskId: string, { result, ...data }: any): DashboardState => ({
  ...state,
  tasks: {
    ...state.tasks,
    [taskId]: {
      ...data,
      result: {
        ...(state.tasks[taskId].result ? state.tasks[taskId].result : {}),
        ...(result ? result : {}),
      },
    },
  },
})

const reducer: Reducer<DashboardState, ActionWithPayload<DashboardActionType>> = (state = defaultState, action) => {
  switch (action.type) {
    //get top-events
    case DashboardActionType.GetTopEventsStart:
      return updateTopEventsTask(state, TaskId.GetTopEvents, { loading: true })

    case DashboardActionType.GetTopEventsError:
      return updateTopEventsTask(state, TaskId.GetTopEvents, {
        loading: false,
        error: action.payload.error,
      })

    case DashboardActionType.GetTopEventsSuccess: {
      return updateTopEventsTask(state, TaskId.GetTopEvents, { loading: false, result: action.payload })
    }

    // get exfiltration type events
    case DashboardActionType.FetchExfiltrationEventsStart: {
      return updateTask(state, TaskId.ExfiltrationTypeEvents, { loading: true })
    }
    case DashboardActionType.FetchExfiltrationEventsError: {
      return updateTask(state, TaskId.ExfiltrationTypeEvents, { loading: false, error: action.payload.error })
    }
    case DashboardActionType.FetchExfiltrationEventsSuccess: {
      return updateTask(state, TaskId.ExfiltrationTypeEvents, { loading: false, result: action.payload })
    }

    //get evidence locker info
    case DashboardActionType.GetEvidenceLockerInfoStart:
      return updateTask(state, TaskId.EvidenceLockerInfo, { loading: true })

    case DashboardActionType.GetEvidenceLockerInfoError:
      return updateTask(state, TaskId.EvidenceLockerInfo, {
        loading: false,
        error: action.payload.error,
      })

    case DashboardActionType.GetEvidenceLockerInfoSuccess: {
      return updateTask(state, TaskId.EvidenceLockerInfo, { loading: false, result: action.payload })
    }

    //get Total sensitive files on endpoints
    case DashboardActionType.GetTotalSensitiveFilesOnEndpointsStart: {
      return updateTask(state, TaskId.GetTotalSensitiveFilesOnEndpoints, { loading: true })
    }
    case DashboardActionType.GetTotalSensitiveFilesOnEndpointsError: {
      return updateTask(state, TaskId.GetTotalSensitiveFilesOnEndpoints, { loading: false, error: action.payload.error })
    }
    case DashboardActionType.GetTotalSensitiveFilesOnEndpointsSuccess: {
      return updateTask(state, TaskId.GetTotalSensitiveFilesOnEndpoints, { loading: false, result: action.payload })
    }

    //get sensitive files on endpoints
    case DashboardActionType.GetSensitiveFilesOnEndpointsStart: {
      return updateTask(state, TaskId.GetSensitiveFilesOnEndpoints, { loading: true })
    }
    case DashboardActionType.GetSensitiveFilesOnEndpointsError: {
      return updateTask(state, TaskId.GetSensitiveFilesOnEndpoints, { loading: false, error: action.payload.error })
    }
    case DashboardActionType.GetSensitiveFilesOnEndpointsSuccess: {
      return updateTask(state, TaskId.GetSensitiveFilesOnEndpoints, { loading: false, result: action.payload })
    }

    //get Number of Active Users
    case DashboardActionType.GetNumberActiveUsersStart: {
      return updateTask(state, TaskId.GetNumberActiveUsers, { loading: true })
    }
    case DashboardActionType.GetNumberActiveUsersError: {
      return updateTask(state, TaskId.GetNumberActiveUsers, { loading: false, error: action.payload.error })
    }
    case DashboardActionType.GetNumberActiveUsersSuccess: {
      return updateTask(state, TaskId.GetNumberActiveUsers, { loading: false, result: action.payload })
    }

    //get Number of Active Devices
    case DashboardActionType.GetNumberActiveDevicesStart: {
      return updateTask(state, TaskId.GetNumberActiveDevices, { loading: true })
    }
    case DashboardActionType.GetNumberActiveDevicesError: {
      return updateTask(state, TaskId.GetNumberActiveDevices, { loading: false, error: action.payload.error })
    }
    case DashboardActionType.GetNumberActiveDevicesSuccess: {
      return updateTask(state, TaskId.GetNumberActiveDevices, { loading: false, result: action.payload })
    }

    default:
      return state
  }
}

export default reducer
