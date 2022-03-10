import { createSelector } from 'reselect'

import type { GetUserDevicePersonaModelsParams, UsersState } from './types'
import { UsersReduxSlice } from './types'

const getState = (state: { [k in typeof UsersReduxSlice]: UsersState }) => state[UsersReduxSlice]

const getTasks = createSelector(getState, state => state?.tasks)

export const getUsersTask = createSelector(getTasks, tasks => tasks?.users)

export const getDevicesGroupedByUserTask = createSelector(getTasks, tasks => tasks?.devicesGroupedByUsers)

export const getUserDetailsTask = createSelector(getTasks, tasks => tasks?.userDetails ?? {})

export const getDeleteUsersTask = createSelector(getTasks, tasks => tasks?.deleteUsers)

export const getUserDevicesTask = createSelector(getTasks, tasks => tasks?.userDevices)

export const getUserDevicePersonaModelsTask = (params: Partial<GetUserDevicePersonaModelsParams>) =>
  createSelector(getTasks, tasks => tasks?.personaModelsByDeviceId[params.deviceId] ?? {})

export const getUpdateUserDevicePersonaModelsTask = createSelector(getTasks, tasks => tasks?.updateUserDevicePersonaModels ?? {})

export const getUserActiveAlertsTask = createSelector(getTasks, tasks => tasks?.userActiveAlerts)

export const getUserHistoryAlertsTask = createSelector(getTasks, tasks => tasks?.userHistoryAlerts)

export const getUserPersonaScoreLogTask = (deviceId: string) =>
  createSelector(getTasks, tasks => tasks?.userPersonaScoreLog[deviceId] ?? {})

export const getUserAlertsWithTrustScoreTask = (deviceId: string) =>
  createSelector(getTasks, tasks => tasks?.userAlertsWithTrustScore[deviceId] ?? {})

export const getScoresForSelectedAlertTask = (deviceId: string) =>
  createSelector(getTasks, tasks => tasks?.scoresForSelectedAlert[deviceId] ?? {})

export const getSearchUsersByUsernameDataTask = createSelector(getTasks, tasks => tasks?.searchUsersByUsernameData ?? {})

export const getSearchZoneByNameDataTask = createSelector(getTasks, tasks => tasks?.searchZonesByNameData ?? {})

export const getSearchDevicesByDeviceNameDataTask = createSelector(getTasks, tasks => tasks?.searchDevicesByDeviceNameData ?? {})
