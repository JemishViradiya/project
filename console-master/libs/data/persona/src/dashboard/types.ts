import type { ShortUserItem, ShortZoneDetails, UserAlertsWithTrustScore, UserPersonaScoreLogData, UserWithTrustScore } from '..'
import type {
  AlertCommentItem,
  AlertDetails,
  AlertListResponse,
  GetAlertListParams,
  PersonaAlertType,
  PersonaScoreLogItem,
} from '../alert-service'
import type { StatisticsCountItem, StatisticsTimeInterval, Task } from '../types'

export const DashboardReduxSlice = 'app.persona.dashboard'

export enum DashboardTaskId {
  Alerts = 'alerts',
  UpdateAlertStatus = 'updateAlertStatus',
  AlertDetails = 'alertDetails',
  AlertRelatedAlerts = 'alertRelatedAlerts',
  UserPersonaScoreLog = 'userPersonaScoreLog',
  UserAlertsWithTrustScore = 'userAlertsWithTrustScore',
  ScoresForSelectedAlert = 'scoresForSelectedAlert',
  AlertComments = 'alertComments',
  AddAlertComment = 'addAlertComment',
  DeleteAlertComment = 'deleteAlertComment',
  TenantAlertCounts = 'tenantAlertCounts',
  TenantOnlineDeviceCounts = 'tenantOnlineDeviceCounts',
  TenantLowestTrustScoreUsers = 'tenantLowestTrustScoreUsers',
  SearchUsersByUsernameData = 'searchUsersByUsernameData',
  SearchZonesByNameData = 'searchZonesByNameData',
}

export interface DashboardState {
  tasks?: {
    alerts: Task<AlertListResponse>
    updateAlertStatus: Task
    alertDetails: Task<AlertDetails>
    userPersonaScoreLog: Task<UserPersonaScoreLogData>
    userAlertsWithTrustScore: Task<UserAlertsWithTrustScore>
    scoresForSelectedAlert: Task<PersonaScoreLogItem[]>
    alertRelatedAlerts: Task<AlertListResponse>
    alertComments: Task<AlertCommentItem[]>
    addAlertComment: Task
    deleteAlertComment: Task
    tenantAlertCounts: Task<TenantAlertCountsMap>
    tenantOnlineDeviceCounts: Task<StatisticsCountItem[]>
    tenantLowestTrustScoreUsers: Task<UserWithTrustScore[]>
    searchUsersByUsernameData: Task<ShortUserItem[]>
    searchZonesByNameData: Task<ShortZoneDetails[]>
  }
}

export interface GetRelatedAlertsParams extends GetAlertListParams {
  alertId: string
}

export interface GetTenantAlertCountsParams {
  fromTime: string
  toTime: string
  interval: StatisticsTimeInterval
  alertTypes: PersonaAlertType[]
}

export type TenantAlertCountsMap = Record<string, StatisticsCountItem[]>

export const DashboardActionType = {
  GetAlertListStart: `${DashboardReduxSlice}/get-alert-list-start`,
  GetAlertListError: `${DashboardReduxSlice}/get-alert-list-error`,
  GetAlertListSuccess: `${DashboardReduxSlice}/get-alert-list-success`,

  GetAlertDetailsStart: `${DashboardReduxSlice}/get-alert-details-start`,
  GetAlertDetailsError: `${DashboardReduxSlice}/get-alert-details-error`,
  GetAlertDetailsSuccess: `${DashboardReduxSlice}/get-alert-details-success`,

  GetUserPersonaScoreLogStart: `${DashboardReduxSlice}/get-user-persona-score-log-start`,
  GetUserPersonaScoreLogError: `${DashboardReduxSlice}/get-user-persona-score-log-error`,
  GetUserPersonaScoreLogSuccess: `${DashboardReduxSlice}/get-user-persona-score-log-success`,

  GetUserAlertsWithTrustScoreStart: `${DashboardReduxSlice}/get-user-alerts-with-trust-score-start`,
  GetUserAlertsWithTrustScoreError: `${DashboardReduxSlice}/get-user-alerts-with-trust-score-error`,
  GetUserAlertsWithTrustScoreSuccess: `${DashboardReduxSlice}/get-user-alerts-with-trust-score-success`,

  GetScoresForSelectedAlertStart: `${DashboardReduxSlice}/get-scores-for-selected-alert-start`,
  GetScoresForSelectedAlertError: `${DashboardReduxSlice}/get-scores-for-selected-alert-error`,
  GetScoresForSelectedAlertSuccess: `${DashboardReduxSlice}/get-scores-for-selected-alert-success`,

  UpdateAlertStatusStart: `${DashboardReduxSlice}/update-alert-status-start`,
  UpdateAlertStatusError: `${DashboardReduxSlice}/update-alert-status-error`,
  UpdateAlertStatusSuccess: `${DashboardReduxSlice}/update-alert-status-success`,

  GetRelatedAlersStart: `${DashboardReduxSlice}/get-related-alerts-start`,
  GetRelatedAlersError: `${DashboardReduxSlice}/get-related-alerts-error`,
  GetRelatedAlersSuccess: `${DashboardReduxSlice}/get-related-alerts-success`,

  GetAlertCommentsStart: `${DashboardReduxSlice}/get-alert-comments-start`,
  GetAlertCommentsError: `${DashboardReduxSlice}/get-alert-comments-error`,
  GetAlertCommentsSuccess: `${DashboardReduxSlice}/get-alert-comments-success`,

  AddAlertCommentStart: `${DashboardReduxSlice}/add-alert-comment-start`,
  AddAlertCommentError: `${DashboardReduxSlice}/add-alert-comment-error`,
  AddAlertCommentSuccess: `${DashboardReduxSlice}/add-alert-comment-success`,

  DeleteAlertCommentStart: `${DashboardReduxSlice}/delete-alert-comment-start`,
  DeleteAlertCommentError: `${DashboardReduxSlice}/delete-alert-comment-error`,
  DeleteAlertCommentSuccess: `${DashboardReduxSlice}/delete-alert-comment-success`,

  GetTenantAlertCountsStart: `${DashboardReduxSlice}/get-tenant-alert-counts-start`,
  GetTenantAlertCountsError: `${DashboardReduxSlice}/get-tenant-alert-counts-error`,
  GetTenantAlertCountsSuccess: `${DashboardReduxSlice}/get-tenant-alert-counts-success`,

  GetTenantOnlineDeviceCountsStart: `${DashboardReduxSlice}/get-tenant-online-device-counts-start`,
  GetTenantOnlineDeviceCountsError: `${DashboardReduxSlice}/get-tenant-online-device-counts-error`,
  GetTenantOnlineDeviceCountsSuccess: `${DashboardReduxSlice}/get-tenant-online-device-counts-success`,

  GetTenantLowestTrustScoreUsersStart: `${DashboardReduxSlice}/get-tenant-lowest-trust-score-users-start`,
  GetTenantLowestTrustScoreUsersError: `${DashboardReduxSlice}/get-tenant-lowest-trust-score-users-error`,
  GetTenantLowestTrustScoreUsersSuccess: `${DashboardReduxSlice}/get-tenant-lowest-trust-score-users-success`,

  SearchUsersByUsernameStart: `${DashboardReduxSlice}/search-users-by-username-start`,
  SearchUsersByUsernameError: `${DashboardReduxSlice}/search-users-by-username-error`,
  SearchUsersByUsernameSuccess: `${DashboardReduxSlice}/search-users-by-username-success`,
  SearchUsersByUsernameReset: `${DashboardReduxSlice}/search-users-by-username-reset`,

  SearchZonesByNameStart: `${DashboardReduxSlice}/search-zones-by-name-start`,
  SearchZonesByNameError: `${DashboardReduxSlice}/search-zones-by-name-error`,
  SearchZonesByNameSuccess: `${DashboardReduxSlice}/search-zones-by-name-success`,
  SearchZonesByNameReset: `${DashboardReduxSlice}/search-zones-by-name-reset`,
}

export type DashboardActionType = string
