import type { Action, Reducer } from 'redux'

import type { Task } from '../types'
import type { DashboardState } from './types'
import { DashboardActionType, DashboardTaskId } from './types'

interface ActionWithPayload<TActionType extends string, TPayload = any> extends Action<TActionType> {
  payload?: TPayload
}

export const defaultState: DashboardState = {
  tasks: {
    alerts: {
      loading: false,
    },
    alertDetails: {
      loading: false,
    },
    userPersonaScoreLog: {
      loading: false,
    },
    userAlertsWithTrustScore: {
      loading: false,
    },
    scoresForSelectedAlert: {
      loading: false,
    },
    updateAlertStatus: {
      loading: false,
    },
    alertRelatedAlerts: {
      loading: false,
    },
    alertComments: {
      loading: false,
    },
    addAlertComment: {
      loading: false,
    },
    deleteAlertComment: {
      loading: false,
    },
    tenantAlertCounts: {
      loading: false,
    },
    tenantOnlineDeviceCounts: {
      loading: false,
    },
    tenantLowestTrustScoreUsers: {
      loading: false,
    },
    searchUsersByUsernameData: {
      loading: false,
    },
    searchZonesByNameData: {
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

const reducer: Reducer<DashboardState, ActionWithPayload<string>> = (state = defaultState, action) => {
  // eslint-disable-next-line sonarjs/max-switch-cases
  switch (action.type) {
    // get alert list
    case DashboardActionType.GetAlertListStart:
      return updateTask(state, DashboardTaskId.Alerts, { ...state.tasks.alerts, loading: true })
    case DashboardActionType.GetAlertListError:
      return updateTask(state, DashboardTaskId.Alerts, { loading: false, error: action.payload.error })
    case DashboardActionType.GetAlertListSuccess:
      return updateTask(state, DashboardTaskId.Alerts, {
        loading: false,
        result: action.payload,
      })

    // get alert details
    case DashboardActionType.GetAlertDetailsStart:
      return updateTask(state, DashboardTaskId.AlertDetails, { ...state.tasks.alertDetails, loading: true })
    case DashboardActionType.GetAlertDetailsError:
      return updateTask(state, DashboardTaskId.AlertDetails, { loading: false, error: action.payload.error })
    case DashboardActionType.GetAlertDetailsSuccess:
      return updateTask(state, DashboardTaskId.AlertDetails, {
        loading: false,
        result: action.payload,
      })

    // get user Persona score log
    case DashboardActionType.GetUserPersonaScoreLogStart:
      return updateTask(state, DashboardTaskId.UserPersonaScoreLog, { ...state.tasks.userPersonaScoreLog, loading: true })
    case DashboardActionType.GetUserPersonaScoreLogError:
      return updateTask(state, DashboardTaskId.UserPersonaScoreLog, { loading: false, error: action.payload.error })
    case DashboardActionType.GetUserPersonaScoreLogSuccess:
      return updateTask(state, DashboardTaskId.UserPersonaScoreLog, {
        loading: false,
        result: action.payload,
      })

    // get user alerts with trust score
    case DashboardActionType.GetUserAlertsWithTrustScoreStart:
      return updateTask(state, DashboardTaskId.UserAlertsWithTrustScore, { ...state.tasks.userAlertsWithTrustScore, loading: true })
    case DashboardActionType.GetUserAlertsWithTrustScoreError:
      return updateTask(state, DashboardTaskId.UserAlertsWithTrustScore, { loading: false, error: action.payload.error })
    case DashboardActionType.GetUserAlertsWithTrustScoreSuccess:
      return updateTask(state, DashboardTaskId.UserAlertsWithTrustScore, {
        loading: false,
        result: action.payload,
      })

    // get scores for selected alert
    case DashboardActionType.GetScoresForSelectedAlertStart:
      return updateTask(state, DashboardTaskId.ScoresForSelectedAlert, { ...state.tasks.scoresForSelectedAlert, loading: true })
    case DashboardActionType.GetScoresForSelectedAlertError:
      return updateTask(state, DashboardTaskId.ScoresForSelectedAlert, { loading: false, error: action.payload.error })
    case DashboardActionType.GetScoresForSelectedAlertSuccess:
      return updateTask(state, DashboardTaskId.ScoresForSelectedAlert, {
        loading: false,
        result: action.payload,
      })

    // update alert status
    case DashboardActionType.UpdateAlertStatusStart:
      return updateTask(state, DashboardTaskId.UpdateAlertStatus, { ...state.tasks.updateAlertStatus, loading: true })
    case DashboardActionType.UpdateAlertStatusError:
      return updateTask(state, DashboardTaskId.UpdateAlertStatus, { loading: false, error: action.payload.error })
    case DashboardActionType.UpdateAlertStatusSuccess:
      return updateTask(state, DashboardTaskId.UpdateAlertStatus, {
        loading: false,
      })

    // get related alerts
    case DashboardActionType.GetRelatedAlersStart:
      return updateTask(state, DashboardTaskId.AlertRelatedAlerts, { ...state.tasks.alertRelatedAlerts, loading: true })
    case DashboardActionType.GetRelatedAlersError:
      return updateTask(state, DashboardTaskId.AlertRelatedAlerts, { loading: false, error: action.payload.error })
    case DashboardActionType.GetRelatedAlersSuccess:
      return updateTask(state, DashboardTaskId.AlertRelatedAlerts, {
        loading: false,
        result: action.payload,
      })

    // get alert comments
    case DashboardActionType.GetAlertCommentsStart:
      return updateTask(state, DashboardTaskId.AlertComments, { ...state.tasks.alertComments, loading: true })
    case DashboardActionType.GetAlertCommentsError:
      return updateTask(state, DashboardTaskId.AlertComments, { loading: false, error: action.payload.error })
    case DashboardActionType.GetAlertCommentsSuccess:
      return updateTask(state, DashboardTaskId.AlertComments, {
        loading: false,
        result: action.payload,
      })

    // add alert comment
    case DashboardActionType.AddAlertCommentStart:
      return updateTask(state, DashboardTaskId.AddAlertComment, { ...state.tasks.addAlertComment, loading: true })
    case DashboardActionType.AddAlertCommentError:
      return updateTask(state, DashboardTaskId.AddAlertComment, { loading: false, error: action.payload.error })
    case DashboardActionType.AddAlertCommentSuccess:
      return updateTask(state, DashboardTaskId.AddAlertComment, {
        loading: false,
      })

    // delete alert comment
    case DashboardActionType.DeleteAlertCommentStart:
      return updateTask(state, DashboardTaskId.DeleteAlertComment, { ...state.tasks.deleteAlertComment, loading: true })
    case DashboardActionType.DeleteAlertCommentError:
      return updateTask(state, DashboardTaskId.DeleteAlertComment, { loading: false, error: action.payload.error })
    case DashboardActionType.DeleteAlertCommentSuccess:
      return updateTask(state, DashboardTaskId.DeleteAlertComment, {
        loading: false,
      })

    // get tenant alert counts
    case DashboardActionType.GetTenantAlertCountsStart:
      return updateTask(state, DashboardTaskId.TenantAlertCounts, { ...state.tasks.tenantAlertCounts, loading: true })
    case DashboardActionType.GetTenantAlertCountsError:
      return updateTask(state, DashboardTaskId.TenantAlertCounts, { loading: false, error: action.payload.error })
    case DashboardActionType.GetTenantAlertCountsSuccess:
      return updateTask(state, DashboardTaskId.TenantAlertCounts, {
        loading: false,
        result: action.payload,
      })

    // get tenant online device counts
    case DashboardActionType.GetTenantOnlineDeviceCountsStart:
      return updateTask(state, DashboardTaskId.TenantOnlineDeviceCounts, { ...state.tasks.tenantOnlineDeviceCounts, loading: true })
    case DashboardActionType.GetTenantOnlineDeviceCountsError:
      return updateTask(state, DashboardTaskId.TenantOnlineDeviceCounts, { loading: false, error: action.payload.error })
    case DashboardActionType.GetTenantOnlineDeviceCountsSuccess:
      return updateTask(state, DashboardTaskId.TenantOnlineDeviceCounts, {
        loading: false,
        result: action.payload,
      })

    // get top lowest trust score users
    case DashboardActionType.GetTenantLowestTrustScoreUsersStart:
      return updateTask(state, DashboardTaskId.TenantLowestTrustScoreUsers, {
        ...state.tasks.tenantLowestTrustScoreUsers,
        loading: true,
      })
    case DashboardActionType.GetTenantLowestTrustScoreUsersError:
      return updateTask(state, DashboardTaskId.TenantLowestTrustScoreUsers, { loading: false, error: action.payload.error })
    case DashboardActionType.GetTenantLowestTrustScoreUsersSuccess:
      return updateTask(state, DashboardTaskId.TenantLowestTrustScoreUsers, {
        loading: false,
        result: action.payload,
      })

    // search users by username
    case DashboardActionType.SearchUsersByUsernameStart:
      return updateTask(state, DashboardTaskId.SearchUsersByUsernameData, {
        ...state.tasks.searchUsersByUsernameData,
        loading: true,
      })
    case DashboardActionType.SearchUsersByUsernameError:
      return updateTask(state, DashboardTaskId.SearchUsersByUsernameData, { loading: false, error: action.payload.error })
    case DashboardActionType.SearchUsersByUsernameSuccess:
      return updateTask(state, DashboardTaskId.SearchUsersByUsernameData, {
        loading: false,
        result: action.payload,
      })
    case DashboardActionType.SearchUsersByUsernameReset:
      return updateTask(state, DashboardTaskId.SearchUsersByUsernameData, {
        loading: false,
      })

    // search users by username
    case DashboardActionType.SearchZonesByNameStart:
      return updateTask(state, DashboardTaskId.SearchZonesByNameData, { ...state.tasks.searchZonesByNameData, loading: true })
    case DashboardActionType.SearchZonesByNameError:
      return updateTask(state, DashboardTaskId.SearchZonesByNameData, { loading: false, error: action.payload.error })
    case DashboardActionType.SearchZonesByNameSuccess:
      return updateTask(state, DashboardTaskId.SearchZonesByNameData, {
        loading: false,
        result: action.payload,
      })
    case DashboardActionType.SearchZonesByNameReset:
      return updateTask(state, DashboardTaskId.SearchZonesByNameData, {
        loading: false,
      })

    default:
      return state
  }
}

export default reducer
