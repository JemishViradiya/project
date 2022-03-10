import type { AlertListResponse, GetAlertListParams, PersonaScoreLogItem } from '../alert-service'
import type { PersonaModel, UpdatePersonaModelsParams } from '../model-service'
import type { AlertsApiProvider, ListRequestParams, ModelsApiProvider, UsersApiProvider, ZonesApiProvider } from '../types'
import type {
  DevicesGroupedByUserListResponse,
  GetUserContainingUsernameParams,
  GetUserListParams,
  ShortDeviceItem,
  ShortUserItem,
  UserDetails,
  UserDevicesResponse,
  UsersListResponse,
} from '../user-service'
import type { ShortZoneDetails } from '../zone-service'
import type {
  GetScoresForSelectedAlertParams,
  GetUserAlertsWithTrustScoreParams,
  GetUserDevicePersonaModelsParams,
  GetUserPersonaScoreLogParams,
  UserAlertsWithTrustScore,
  UserPersonaScoreLogData,
} from './types'
import { UsersActionType } from './types'

// get user list
export const getUserListStart = (params: GetUserListParams, apiProvider: UsersApiProvider) => ({
  type: UsersActionType.GetUserListStart,
  payload: { params, apiProvider },
})

export const getUserListSuccess = (payload: UsersListResponse) => ({
  type: UsersActionType.GetUserListSuccess,
  payload,
})

export const getUserListError = (error: Error) => ({
  type: UsersActionType.GetUserListError,
  payload: { error },
})

// get device by grouped user list
export const getDeviceByUserListStart = (params: ListRequestParams, apiProvider: UsersApiProvider) => ({
  type: UsersActionType.GetDeviceByUserListStart,
  payload: { params, apiProvider },
})

export const getDeviceByUserListSuccess = (payload: DevicesGroupedByUserListResponse) => ({
  type: UsersActionType.GetDeviceByUserListSuccess,
  payload,
})

export const getDeviceByUserListError = (error: Error) => ({
  type: UsersActionType.GetDeviceByUserListError,
  payload: { error },
})

// get user details
export const getUserDetailsStart = (userId: string, apiProvider: UsersApiProvider) => ({
  type: UsersActionType.GetUserDetailsStart,
  payload: { userId, apiProvider },
})

export const getUserDetailsSuccess = (payload: UserDetails) => ({
  type: UsersActionType.GetUserDetailsSuccess,
  payload,
})

export const getUserDetailsError = (error: Error) => ({
  type: UsersActionType.GetUserDetailsError,
  payload: { error },
})

// delete users
export const deleteUsersStart = (userIds: string[], apiProvider: UsersApiProvider) => ({
  type: UsersActionType.DeleteUsersStart,
  payload: { userIds, apiProvider },
})

export const deleteUsersSuccess = () => ({
  type: UsersActionType.DeleteUsersSuccess,
})

export const deleteUsersError = (error: Error) => ({
  type: UsersActionType.DeleteUsersError,
  payload: { error },
})

// get user devices
export const getUserDevicesStart = (userId: string, apiProvider: UsersApiProvider) => ({
  type: UsersActionType.GetUserDevicesStart,
  payload: { userId, apiProvider },
})

export const getUserDevicesSuccess = (payload: UserDevicesResponse) => ({
  type: UsersActionType.GetUserDevicesSuccess,
  payload,
})

export const getUserDevicesError = (error: Error) => ({
  type: UsersActionType.GetUserDevicesError,
  payload: { error },
})

// get user device persona models
export const getUserDevicePersonaModelsStart = (params: GetUserDevicePersonaModelsParams, apiProvider: ModelsApiProvider) => ({
  type: UsersActionType.GetUserDevicePersonaModelsStart,
  payload: { params, apiProvider },
})

export const getUserDevicePersonaModelsSuccess = (id: string, data: PersonaModel[]) => ({
  type: UsersActionType.GetUserDevicePersonaModelsSuccess,
  payload: { id, data },
})

export const getUserDevicePersonaModelsError = (id: string, error: Error) => ({
  type: UsersActionType.GetUserDevicePersonaModelsError,
  payload: { id, error },
})

// update user device persona models
export const updateUserDevicePersonaModelsStart = (params: UpdatePersonaModelsParams, apiProvider: ModelsApiProvider) => ({
  type: UsersActionType.UpdateUserDevicePersonaModelsStart,
  payload: { params, apiProvider },
})

export const updateUserDevicePersonaModelsSuccess = (params: UpdatePersonaModelsParams) => ({
  type: UsersActionType.UpdateUserDevicePersonaModelsSuccess,
  payload: {
    params,
  },
})

export const updateUserDevicePersonaModelsError = (params: UpdatePersonaModelsParams, error: Error) => ({
  type: UsersActionType.UpdateUserDevicePersonaModelsError,
  payload: { params, error },
})

// get user active alerts
export const getUserActiveAlertsStart = (params: GetAlertListParams, apiProvider: AlertsApiProvider) => ({
  type: UsersActionType.GetUserActiveAlertsStart,
  payload: { params, apiProvider },
})

export const getUserActiveAlertsSuccess = (payload: AlertListResponse) => ({
  type: UsersActionType.GetUserActiveAlertsSuccess,
  payload,
})

export const getUserActiveAlertsError = (error: Error) => ({
  type: UsersActionType.GetUserActiveAlertsError,
  payload: { error },
})

// get user alerts history
export const getUserHistoryAlertsStart = (params: GetAlertListParams, apiProvider: AlertsApiProvider) => ({
  type: UsersActionType.GetUserHistoryAlertsStart,
  payload: { params, apiProvider },
})

export const getUserHistoryAlertsSuccess = (payload: AlertListResponse) => ({
  type: UsersActionType.GetUserHistoryAlertsSuccess,
  payload,
})

export const getUserHistoryAlertsError = (error: Error) => ({
  type: UsersActionType.GetUserHistoryAlertsError,
  payload: { error },
})

// get user Persona score log
export const getUserPersonaScoreLogStart = (
  deviceId: string,
  params: GetUserPersonaScoreLogParams[],
  apiProvider: AlertsApiProvider,
) => ({
  type: UsersActionType.GetUserPersonaScoreLogStart,
  payload: { deviceId, params, apiProvider },
})

export const getUserPersonaScoreLogSuccess = (deviceId: string, payload: UserPersonaScoreLogData) => ({
  type: UsersActionType.GetUserPersonaScoreLogSuccess,
  payload: { deviceId, payload },
})

export const getUserPersonaScoreLogError = (deviceId: string, error: Error) => ({
  type: UsersActionType.GetUserPersonaScoreLogError,
  payload: { deviceId, error },
})

// get user alerts with trust score
export const getUserAlertsWithTrustScoreStart = (params: GetUserAlertsWithTrustScoreParams, apiProvider: AlertsApiProvider) => ({
  type: UsersActionType.GetUserAlertsWithTrustScoreStart,
  payload: { params, apiProvider },
})

export const getUserAlertsWithTrustScoreSuccess = (deviceId: string, payload: UserAlertsWithTrustScore) => ({
  type: UsersActionType.GetUserAlertsWithTrustScoreSuccess,
  payload: { deviceId, payload },
})

export const getUserAlertsWithTrustScoreError = (deviceId: string, error: Error) => ({
  type: UsersActionType.GetUserAlertsWithTrustScoreError,
  payload: { deviceId, error },
})

// get scores for selected alert
export const getScoresForSelectedAlertStart = (params: GetScoresForSelectedAlertParams, apiProvider: AlertsApiProvider) => ({
  type: UsersActionType.GetScoresForSelectedAlertStart,
  payload: { params, apiProvider },
})

export const getScoresForSelectedAlertSuccess = (deviceId: string, payload: PersonaScoreLogItem[]) => ({
  type: UsersActionType.GetScoresForSelectedAlertSuccess,
  payload: { deviceId, payload },
})

export const getScoresForSelectedAlertError = (deviceId: string, error: Error) => ({
  type: UsersActionType.GetScoresForSelectedAlertError,
  payload: { deviceId, error },
})

// search users by username
export const searchUsersByUsernameStart = (params: GetUserContainingUsernameParams, apiProvider: UsersApiProvider) => ({
  type: UsersActionType.SearchUsersByUsernameStart,
  payload: { params, apiProvider },
})

export const searchUsersByUsernameSuccess = (payload: ShortUserItem[]) => ({
  type: UsersActionType.SearchUsersByUsernameSuccess,
  payload,
})

export const searchUsersByUsernameError = (error: Error) => ({
  type: UsersActionType.SearchUsersByUsernameError,
  payload: { error },
})

export const searchUsersByUsernameReset = () => ({
  type: UsersActionType.SearchUsersByUsernameReset,
})

// search zones by name
export const searchZonesByNameStart = (zoneName: string, apiProvider: ZonesApiProvider) => ({
  type: UsersActionType.SearchZonesByNameStart,
  payload: { zoneName, apiProvider },
})

export const searchZonesByNameSuccess = (payload: ShortZoneDetails[]) => ({
  type: UsersActionType.SearchZonesByNameSuccess,
  payload,
})

export const searchZonesByNameError = (error: Error) => ({
  type: UsersActionType.SearchZonesByNameError,
  payload: { error },
})

export const searchZonesByNameReset = () => ({
  type: UsersActionType.SearchZonesByNameReset,
})

// search devices by name
export const searchDevicesByDeviceNameStart = (query: string, apiProvider: UsersApiProvider) => ({
  type: UsersActionType.SearchDevicesByDeviceNameStart,
  payload: { params: query, apiProvider },
})

export const searchDevicesByDeviceNameSuccess = (payload: ShortDeviceItem[]) => ({
  type: UsersActionType.SearchDevicesByDeviceNameSuccess,
  payload,
})

export const searchDevicesByDeviceNameError = (error: Error) => ({
  type: UsersActionType.SearchDevicesByDeviceNameError,
  payload: { error },
})

export const searchDevicesByDeviceNameReset = () => ({
  type: UsersActionType.SearchDevicesByDeviceNameReset,
})
