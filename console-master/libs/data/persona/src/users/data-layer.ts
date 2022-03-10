import type { ReduxMutation, ReduxQuery } from '@ues-data/shared'
import { Permission } from '@ues-data/shared'

import type { AlertListResponse } from '../alert-service'
import { AlertsApi, AlertsMockApi } from '../alert-service'
import type { PersonaModel } from '../model-service'
import { ModelsApi, ModelsMockApi } from '../model-service'
import type { Task } from '../types'
import type { DevicesGroupedByUserListResponse, UserDetails, UserDevicesResponse, UsersListResponse } from '../user-service'
import { UsersApi, UsersMockApi } from '../user-service'
import {
  deleteUsersStart,
  getDeviceByUserListStart,
  getUserActiveAlertsStart,
  getUserDetailsStart,
  getUserDevicePersonaModelsStart,
  getUserDevicesStart,
  getUserHistoryAlertsStart,
  getUserListStart,
  updateUserDevicePersonaModelsStart,
} from './actions'
import {
  getDeleteUsersTask,
  getDevicesGroupedByUserTask,
  getUpdateUserDevicePersonaModelsTask,
  getUserActiveAlertsTask,
  getUserDetailsTask,
  getUserDevicePersonaModelsTask,
  getUserDevicesTask,
  getUserHistoryAlertsTask,
  getUsersTask,
} from './selectors'
import type { UsersState, UsersTaskId } from './types'
import { UsersReduxSlice } from './types'

const ReadUserPermissions = new Set([Permission.ECS_USERS_READ])

export const queryUsers: ReduxQuery<
  UsersListResponse,
  Parameters<typeof getUserListStart>[0],
  UsersState['tasks'][UsersTaskId.Users]
> = {
  query: payload => getUserListStart(payload, UsersApi),
  mockQuery: payload => getUserListStart(payload, UsersMockApi),
  selector: () => getUsersTask,
  dataProp: 'result',
  slice: UsersReduxSlice,
  permissions: new Set([Permission.ECS_USERS_LIST]),
}

export const queryDevicesGroupedByUser: ReduxQuery<
  DevicesGroupedByUserListResponse,
  Parameters<typeof getDeviceByUserListStart>[0],
  UsersState['tasks'][UsersTaskId.DevicesByUser]
> = {
  query: payload => getDeviceByUserListStart(payload, UsersApi),
  mockQuery: payload => getDeviceByUserListStart(payload, UsersMockApi),
  selector: () => getDevicesGroupedByUserTask,
  dataProp: 'result',
  slice: UsersReduxSlice,
  permissions: new Set([Permission.ECS_USERS_LIST]),
}

export const queryUserDetails: ReduxQuery<
  UserDetails,
  Parameters<typeof getUserDetailsStart>[0],
  UsersState['tasks'][UsersTaskId.UserDetails]
> = {
  query: payload => getUserDetailsStart(payload, UsersApi),
  mockQuery: payload => getUserDetailsStart(payload, UsersMockApi),
  selector: () => getUserDetailsTask,
  dataProp: 'result',
  slice: UsersReduxSlice,
  permissions: ReadUserPermissions,
}

export const mutationDeleteUsers: ReduxMutation<
  void,
  Parameters<typeof deleteUsersStart>[0],
  UsersState['tasks'][UsersTaskId.DeleteUsers]
> = {
  mutation: payload => deleteUsersStart(payload, UsersApi),
  mockMutation: payload => deleteUsersStart(payload, UsersMockApi),
  selector: () => getDeleteUsersTask,
  dataProp: 'result',
  slice: UsersReduxSlice,
}

export const queryUserDevices: ReduxQuery<
  UserDevicesResponse,
  Parameters<typeof getUserDevicesStart>[0],
  UsersState['tasks'][UsersTaskId.UserDevices]
> = {
  query: payload => getUserDevicesStart(payload, UsersApi),
  mockQuery: payload => getUserDevicesStart(payload, UsersMockApi),
  selector: () => getUserDevicesTask,
  dataProp: 'result',
  slice: UsersReduxSlice,
  permissions: ReadUserPermissions,
}

export const queryUserDevicePersonaModels: ReduxQuery<
  PersonaModel[],
  Parameters<typeof getUserDevicePersonaModelsStart>[0],
  Task<PersonaModel[]>
> = {
  query: payload => getUserDevicePersonaModelsStart(payload, ModelsApi),
  mockQuery: payload => getUserDevicePersonaModelsStart(payload, ModelsMockApi),
  selector: params => getUserDevicePersonaModelsTask(params),
  dataProp: 'result',
  slice: UsersReduxSlice,
  permissions: ReadUserPermissions,
}

export const mutationUpdatePersonaModels: ReduxMutation<void, Parameters<typeof updateUserDevicePersonaModelsStart>[0], Task> = {
  mutation: payload => updateUserDevicePersonaModelsStart(payload, ModelsApi),
  mockMutation: payload => updateUserDevicePersonaModelsStart(payload, ModelsMockApi),
  selector: () => getUpdateUserDevicePersonaModelsTask,
  dataProp: 'result',
  slice: UsersReduxSlice,
}

export const queryUserActiveAlerts: ReduxQuery<
  AlertListResponse,
  Parameters<typeof getUserActiveAlertsStart>[0],
  UsersState['tasks'][UsersTaskId.UserActiveAlerts]
> = {
  query: payload => getUserActiveAlertsStart(payload, AlertsApi),
  mockQuery: payload => getUserActiveAlertsStart(payload, AlertsMockApi),
  selector: () => getUserActiveAlertsTask,
  dataProp: 'result',
  slice: UsersReduxSlice,
  permissions: ReadUserPermissions,
}

export const queryUserHistoryAlerts: ReduxQuery<
  AlertListResponse,
  Parameters<typeof getUserHistoryAlertsStart>[0],
  UsersState['tasks'][UsersTaskId.UserHistoryAlerts]
> = {
  query: payload => getUserHistoryAlertsStart(payload, AlertsApi),
  mockQuery: payload => getUserHistoryAlertsStart(payload, AlertsMockApi),
  selector: () => getUserHistoryAlertsTask,
  dataProp: 'result',
  slice: UsersReduxSlice,
  permissions: ReadUserPermissions,
}
