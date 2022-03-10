import type {
  AddAlertCommentParams,
  AlertCommentItem,
  AlertDetails,
  AlertListResponse,
  GetAlertListParams,
  PersonaScoreLogItem,
  UpdateAlertStatusParams,
} from '../alert-service'
import type { AlertsApiProvider, StatisticsCountItem, UsersApiProvider, ZonesApiProvider } from '../types'
import type {
  GetTenantDeviceOnlineCountParams,
  GetUserContainingUsernameParams,
  ShortUserItem,
  UserWithTrustScore,
} from '../user-service'
import type {
  GetScoresForSelectedAlertParams,
  GetUserAlertsWithTrustScoreParams,
  GetUserPersonaScoreLogParams,
  UserAlertsWithTrustScore,
  UserPersonaScoreLogData,
} from '../users'
import type { ShortZoneDetails } from '../zone-service'
import type { GetRelatedAlertsParams, GetTenantAlertCountsParams, TenantAlertCountsMap } from './types'
import { DashboardActionType } from './types'

// get alert list
export const getAlertListStart = (params: GetAlertListParams, apiProvider: AlertsApiProvider) => ({
  type: DashboardActionType.GetAlertListStart,
  payload: { params, apiProvider },
})

export const getAlertListSuccess = (payload: AlertListResponse) => ({
  type: DashboardActionType.GetAlertListSuccess,
  payload,
})

export const getAlertListError = (error: Error) => ({
  type: DashboardActionType.GetAlertListError,
  payload: { error },
})

// get alert details
export const getAlertDetailsStart = (alertId: string, apiProvider: AlertsApiProvider) => ({
  type: DashboardActionType.GetAlertDetailsStart,
  payload: { alertId, apiProvider },
})

export const getAlertDetailsSuccess = (payload: AlertDetails) => ({
  type: DashboardActionType.GetAlertDetailsSuccess,
  payload,
})

export const getAlertDetailsError = (error: Error) => ({
  type: DashboardActionType.GetAlertDetailsError,
  payload: { error },
})

// get user Persona score log
export const getUserPersonaScoreLogStart = (params: GetUserPersonaScoreLogParams[], apiProvider: AlertsApiProvider) => ({
  type: DashboardActionType.GetUserPersonaScoreLogStart,
  payload: { params, apiProvider },
})

export const getUserPersonaScoreLogSuccess = (payload: UserPersonaScoreLogData) => ({
  type: DashboardActionType.GetUserPersonaScoreLogSuccess,
  payload,
})

export const getUserPersonaScoreLogError = (error: Error) => ({
  type: DashboardActionType.GetUserPersonaScoreLogError,
  payload: { error },
})

// get user alerts with trust score
export const getUserAlertsWithTrustScoreStart = (params: GetUserAlertsWithTrustScoreParams, apiProvider: AlertsApiProvider) => ({
  type: DashboardActionType.GetUserAlertsWithTrustScoreStart,
  payload: { params, apiProvider },
})

export const getUserAlertsWithTrustScoreSuccess = (payload: UserAlertsWithTrustScore) => ({
  type: DashboardActionType.GetUserAlertsWithTrustScoreSuccess,
  payload,
})

export const getUserAlertsWithTrustScoreError = (error: Error) => ({
  type: DashboardActionType.GetUserAlertsWithTrustScoreError,
  payload: { error },
})

// get scores for selected alert
export const getScoresForSelectedAlertStart = (params: GetScoresForSelectedAlertParams, apiProvider: AlertsApiProvider) => ({
  type: DashboardActionType.GetScoresForSelectedAlertStart,
  payload: { params, apiProvider },
})

export const getScoresForSelectedAlertSuccess = (payload: PersonaScoreLogItem[]) => ({
  type: DashboardActionType.GetScoresForSelectedAlertSuccess,
  payload,
})

export const getScoresForSelectedAlertError = (error: Error) => ({
  type: DashboardActionType.GetScoresForSelectedAlertError,
  payload: { error },
})

// update alert status
export const updateAlertStatusStart = (params: UpdateAlertStatusParams[], apiProvider: AlertsApiProvider) => ({
  type: DashboardActionType.UpdateAlertStatusStart,
  payload: { params, apiProvider },
})

export const updateAlertStatusSuccess = () => ({
  type: DashboardActionType.UpdateAlertStatusSuccess,
})

export const updateAlertStatusError = (error: Error) => ({
  type: DashboardActionType.UpdateAlertStatusError,
  payload: { error },
})

// get related alerts
export const getRelatedAlertsStart = (params: GetRelatedAlertsParams, apiProvider: AlertsApiProvider) => ({
  type: DashboardActionType.GetRelatedAlersStart,
  payload: { params, apiProvider },
})

export const getRelatedAlertsSuccess = (payload: AlertListResponse) => ({
  type: DashboardActionType.GetRelatedAlersSuccess,
  payload,
})

export const getRelatedAlertsError = (error: Error) => ({
  type: DashboardActionType.GetRelatedAlersError,
  payload: { error },
})

// get alert comments
export const getAlertCommentsStart = (alertId: string, apiProvider: AlertsApiProvider) => ({
  type: DashboardActionType.GetAlertCommentsStart,
  payload: { alertId, apiProvider },
})

export const getAlertCommentsSuccess = (payload: AlertCommentItem[]) => ({
  type: DashboardActionType.GetAlertCommentsSuccess,
  payload,
})

export const getAlertCommentsError = (error: Error) => ({
  type: DashboardActionType.GetAlertCommentsError,
  payload: { error },
})

// add alert comment
export const addAlertCommentStart = (params: AddAlertCommentParams, apiProvider: AlertsApiProvider) => ({
  type: DashboardActionType.AddAlertCommentStart,
  payload: { params, apiProvider },
})

export const addAlertCommentSuccess = () => ({
  type: DashboardActionType.AddAlertCommentSuccess,
})

export const addAlertCommentError = (error: Error) => ({
  type: DashboardActionType.AddAlertCommentError,
  payload: { error },
})

// delete alert comment
export const deleteAlertCommentStart = (commentId: string, apiProvider: AlertsApiProvider) => ({
  type: DashboardActionType.DeleteAlertCommentStart,
  payload: { commentId, apiProvider },
})

export const deleteAlertCommentSuccess = () => ({
  type: DashboardActionType.DeleteAlertCommentSuccess,
})

export const deleteAlertCommentError = (error: Error) => ({
  type: DashboardActionType.DeleteAlertCommentError,
  payload: { error },
})

// get tenant alert counts
export const getTenantAlertCountsStart = (params: GetTenantAlertCountsParams, apiProvider: AlertsApiProvider) => ({
  type: DashboardActionType.GetTenantAlertCountsStart,
  payload: { params, apiProvider },
})

export const getTenantAlertCountsSuccess = (payload: TenantAlertCountsMap) => ({
  type: DashboardActionType.GetTenantAlertCountsSuccess,
  payload,
})

export const getTenantAlertCountsError = (error: Error) => ({
  type: DashboardActionType.GetTenantAlertCountsError,
  payload: { error },
})

// get tenant online device counts
export const getTenantOnlineDeviceCountsStart = (params: GetTenantDeviceOnlineCountParams, apiProvider: UsersApiProvider) => ({
  type: DashboardActionType.GetTenantOnlineDeviceCountsStart,
  payload: { params, apiProvider },
})

export const getTenantOnlineDeviceCountsSuccess = (payload: StatisticsCountItem[]) => ({
  type: DashboardActionType.GetTenantOnlineDeviceCountsSuccess,
  payload,
})

export const getTenantOnlineDeviceCountsError = (error: Error) => ({
  type: DashboardActionType.GetTenantOnlineDeviceCountsError,
  payload: { error },
})

// get tenant lowest trust score users
export const getTenantLowestTrustScoreUsersStart = (apiProvider: UsersApiProvider) => ({
  type: DashboardActionType.GetTenantLowestTrustScoreUsersStart,
  payload: { apiProvider },
})

export const getTenantLowestTrustScoreUsersSuccess = (payload: UserWithTrustScore[]) => ({
  type: DashboardActionType.GetTenantLowestTrustScoreUsersSuccess,
  payload,
})

export const getTenantLowestTrustScoreUsersError = (error: Error) => ({
  type: DashboardActionType.GetTenantLowestTrustScoreUsersError,
  payload: { error },
})

// search users by username
export const searchUsersByUsernameStart = (params: GetUserContainingUsernameParams, apiProvider: UsersApiProvider) => ({
  type: DashboardActionType.SearchUsersByUsernameStart,
  payload: { params, apiProvider },
})

export const searchUsersByUsernameSuccess = (payload: ShortUserItem[]) => ({
  type: DashboardActionType.SearchUsersByUsernameSuccess,
  payload,
})

export const searchUsersByUsernameError = (error: Error) => ({
  type: DashboardActionType.SearchUsersByUsernameError,
  payload: { error },
})

export const searchUsersByUsernameReset = () => ({
  type: DashboardActionType.SearchUsersByUsernameReset,
})

// search zones by name
export const searchZonesByNameStart = (zoneName: string, apiProvider: ZonesApiProvider) => ({
  type: DashboardActionType.SearchZonesByNameStart,
  payload: { zoneName, apiProvider },
})

export const searchZonesByNameSuccess = (payload: ShortZoneDetails[]) => ({
  type: DashboardActionType.SearchZonesByNameSuccess,
  payload,
})

export const searchZonesByNameError = (error: Error) => ({
  type: DashboardActionType.SearchZonesByNameError,
  payload: { error },
})

export const searchZonesByNameReset = () => ({
  type: DashboardActionType.SearchZonesByNameReset,
})
