import type {
  AlertListResponse,
  GetAlertsWithTrustScoreParams,
  GetPersonaScoreLogParams,
  PersonaAlertWithTrustScoreItem,
  PersonaScoreChartInterval,
  PersonaScoreLogItem,
  PersonaScoreType,
} from '../alert-service'
import type { PersonaModel } from '../model-service'
import type { Task } from '../types'
import type {
  DevicesGroupedByUserListResponse,
  ShortDeviceItem,
  ShortUserItem,
  UserDetails,
  UserDevicesResponse,
  UsersListResponse,
} from '../user-service'
import type { ShortZoneDetails } from '../zone-service'

export const UsersReduxSlice = 'app.persona.users'

export enum UsersTaskId {
  Users = 'users',
  DevicesByUser = 'devicesGroupedByUsers',
  UserDetails = 'userDetails',
  DeleteUsers = 'deleteUsers',
  UserDevices = 'userDevices',
  PersonaModelsByDeviceId = 'personaModelsByDeviceId',
  UpdateUserDevicePersonaModels = 'updateUserDevicePersonaModels',
  UserActiveAlerts = 'userActiveAlerts',
  UserHistoryAlerts = 'userHistoryAlerts',
  UserPersonaScoreLog = 'userPersonaScoreLog',
  UserAlertsWithTrustScore = 'userAlertsWithTrustScore',
  ScoresForSelectedAlert = 'scoresForSelectedAlert',
  SearchUsersByUsernameData = 'searchUsersByUsernameData',
  SearchZonesByNameData = 'searchZonesByNameData',
  SearchDevicesByDeviceNameData = 'searchDevicesByDeviceNameData',
}

export interface PersonaScoreCollection {
  [PersonaScoreType.TRUSTSCORE]: PersonaScoreLogItem[]
  [PersonaScoreType.META]: PersonaScoreLogItem[]
  [PersonaScoreType.KEYBOARD]: PersonaScoreLogItem[]
  [PersonaScoreType.CONDUCT]: PersonaScoreLogItem[]
  [PersonaScoreType.NETWORK]: PersonaScoreLogItem[]
  [PersonaScoreType.MOUSE]: PersonaScoreLogItem[]
  [PersonaScoreType.LOGON]: PersonaScoreLogItem[]
}

export interface UserPersonaScoreLogData {
  [PersonaScoreChartInterval.Last24Hours]: PersonaScoreCollection
  [PersonaScoreChartInterval.Last30Days]: PersonaScoreCollection
}

export interface GetUserPersonaScoreLogParams {
  interval: PersonaScoreChartInterval
  params: GetPersonaScoreLogParams
}

export interface UserAlertsWithTrustScore {
  [PersonaScoreChartInterval.Last24Hours]: PersonaAlertWithTrustScoreItem[]
  [PersonaScoreChartInterval.Last30Days]: PersonaAlertWithTrustScoreItem[]
}

export interface GetUserAlertsWithTrustScoreParams {
  interval: PersonaScoreChartInterval
  params: GetAlertsWithTrustScoreParams
}

export interface GetScoresForSelectedAlertParams {
  alertId: string
  deviceId: string
}

export interface GetUserDevicePersonaModelsParams {
  userId: string
  deviceId: string
}

export interface UsersState {
  tasks?: {
    users: Task<UsersListResponse>
    devicesGroupedByUsers: Task<DevicesGroupedByUserListResponse>
    userDetails: Task<UserDetails>
    deleteUsers: Task
    userDevices: Task<UserDevicesResponse>
    personaModelsByDeviceId: Record<string, Task<PersonaModel[]>>
    updateUserDevicePersonaModels: Record<string, Task>
    userActiveAlerts: Task<AlertListResponse>
    userHistoryAlerts: Task<AlertListResponse>
    userPersonaScoreLog: Record<string, Task<UserPersonaScoreLogData>>
    userAlertsWithTrustScore: Record<string, Task<UserAlertsWithTrustScore>>
    scoresForSelectedAlert: Record<string, Task<PersonaScoreLogItem[]>>
    searchUsersByUsernameData: Task<ShortUserItem[]>
    searchZonesByNameData: Task<ShortZoneDetails[]>
    searchDevicesByDeviceNameData: Task<ShortDeviceItem[]>
  }
}

export const UsersActionType = {
  GetUserListStart: `${UsersReduxSlice}/get-user-list-start`,
  GetUserListError: `${UsersReduxSlice}/get-user-list-error`,
  GetUserListSuccess: `${UsersReduxSlice}/get-user-list-success`,

  GetDeviceByUserListStart: `${UsersReduxSlice}/get-device-by-user-list-start`,
  GetDeviceByUserListError: `${UsersReduxSlice}/get-device-by-user-list-error`,
  GetDeviceByUserListSuccess: `${UsersReduxSlice}/get-device-by-user-list-success`,

  GetUserDetailsStart: `${UsersReduxSlice}/get-user-details-start`,
  GetUserDetailsError: `${UsersReduxSlice}/get-user-details-error`,
  GetUserDetailsSuccess: `${UsersReduxSlice}/get-user-details-success`,

  DeleteUsersStart: `${UsersReduxSlice}/delete-users-start`,
  DeleteUsersError: `${UsersReduxSlice}/delete-users-error`,
  DeleteUsersSuccess: `${UsersReduxSlice}/delete-users-success`,

  GetUserDevicesStart: `${UsersReduxSlice}/get-user-devices-start`,
  GetUserDevicesError: `${UsersReduxSlice}/get-user-devices-error`,
  GetUserDevicesSuccess: `${UsersReduxSlice}/get-user-devices-success`,

  GetUserDevicePersonaModelsStart: `${UsersReduxSlice}/get-user-device-persona-models-start`,
  GetUserDevicePersonaModelsError: `${UsersReduxSlice}/get-user-device-persona-models-error`,
  GetUserDevicePersonaModelsSuccess: `${UsersReduxSlice}/get-user-device-persona-models-success`,

  UpdateUserDevicePersonaModelsStart: `${UsersReduxSlice}/update-user-device-persona-models-start`,
  UpdateUserDevicePersonaModelsError: `${UsersReduxSlice}/update-user-device-persona-models-error`,
  UpdateUserDevicePersonaModelsSuccess: `${UsersReduxSlice}/update-user-device-persona-models-success`,

  GetUserActiveAlertsStart: `${UsersReduxSlice}/get-user-active-alerts-start`,
  GetUserActiveAlertsError: `${UsersReduxSlice}/get-user-active-alerts-error`,
  GetUserActiveAlertsSuccess: `${UsersReduxSlice}/get-user-active-alerts-success`,

  GetUserHistoryAlertsStart: `${UsersReduxSlice}/get-user-history-alerts-start`,
  GetUserHistoryAlertsError: `${UsersReduxSlice}/get-user-history-alerts-error`,
  GetUserHistoryAlertsSuccess: `${UsersReduxSlice}/get-user-history-alerts-success`,

  GetUserPersonaScoreLogStart: `${UsersReduxSlice}/get-user-persona-score-log-start`,
  GetUserPersonaScoreLogError: `${UsersReduxSlice}/get-user-persona-score-log-error`,
  GetUserPersonaScoreLogSuccess: `${UsersReduxSlice}/get-user-persona-score-log-success`,

  GetUserAlertsWithTrustScoreStart: `${UsersReduxSlice}/get-user-alerts-with-trust-score-start`,
  GetUserAlertsWithTrustScoreError: `${UsersReduxSlice}/get-user-alerts-with-trust-score-error`,
  GetUserAlertsWithTrustScoreSuccess: `${UsersReduxSlice}/get-user-alerts-with-trust-score-success`,

  GetScoresForSelectedAlertStart: `${UsersReduxSlice}/get-get-scores-for-selected-alert-start`,
  GetScoresForSelectedAlertError: `${UsersReduxSlice}/get-get-scores-for-selected-alert-error`,
  GetScoresForSelectedAlertSuccess: `${UsersReduxSlice}/get-get-scores-for-selected-alert-success`,

  SearchUsersByUsernameStart: `${UsersReduxSlice}/search-users-by-username-start`,
  SearchUsersByUsernameError: `${UsersReduxSlice}/search-users-by-username-error`,
  SearchUsersByUsernameSuccess: `${UsersReduxSlice}/search-users-by-username-success`,
  SearchUsersByUsernameReset: `${UsersReduxSlice}/search-users-by-username-reset`,

  SearchZonesByNameStart: `${UsersReduxSlice}/search-zones-by-name-start`,
  SearchZonesByNameError: `${UsersReduxSlice}/search-zones-by-name-error`,
  SearchZonesByNameSuccess: `${UsersReduxSlice}/search-zones-by-name-success`,
  SearchZonesByNameReset: `${UsersReduxSlice}/search-zones-by-name-reset`,

  SearchDevicesByDeviceNameStart: `${UsersReduxSlice}/search-devices-by-device-name-start`,
  SearchDevicesByDeviceNameError: `${UsersReduxSlice}/search-devices-by-device-name-error`,
  SearchDevicesByDeviceNameSuccess: `${UsersReduxSlice}/search-devices-by-device-name-success`,
  SearchDevicesByDeviceNameReset: `${UsersReduxSlice}/search-devices-by-device-name-reset`,
}

export type UsersActionType = string
