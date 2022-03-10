import reduce from 'lodash-es/reduce'
import { all, call, put, select, takeEvery, takeLatest } from 'redux-saga/effects'

import type { AlertListResponse, PersonaScoreType } from '../alert-service'
import { PersonaAlertStatus } from '../alert-service'
import type {
  deleteUsersStart,
  getDeviceByUserListStart,
  getScoresForSelectedAlertStart,
  getUserActiveAlertsStart,
  getUserAlertsWithTrustScoreStart,
  getUserDetailsStart,
  getUserDevicePersonaModelsStart,
  getUserDevicesStart,
  getUserHistoryAlertsStart,
  getUserListStart,
  getUserPersonaScoreLogStart,
  searchDevicesByDeviceNameStart,
  searchUsersByUsernameStart,
  searchZonesByNameStart,
  updateUserDevicePersonaModelsStart,
} from './actions'
import {
  deleteUsersError,
  deleteUsersSuccess,
  getDeviceByUserListError,
  getDeviceByUserListSuccess,
  getScoresForSelectedAlertError,
  getScoresForSelectedAlertSuccess,
  getUserActiveAlertsError,
  getUserActiveAlertsSuccess,
  getUserAlertsWithTrustScoreError,
  getUserAlertsWithTrustScoreSuccess,
  getUserDetailsError,
  getUserDetailsSuccess,
  getUserDevicePersonaModelsError,
  getUserDevicePersonaModelsSuccess,
  getUserDevicesError,
  getUserDevicesSuccess,
  getUserHistoryAlertsError,
  getUserHistoryAlertsSuccess,
  getUserListError,
  getUserListSuccess,
  getUserPersonaScoreLogError,
  getUserPersonaScoreLogSuccess,
  searchDevicesByDeviceNameError,
  searchDevicesByDeviceNameSuccess,
  searchUsersByUsernameError,
  searchUsersByUsernameSuccess,
  searchZonesByNameError,
  searchZonesByNameSuccess,
  updateUserDevicePersonaModelsError,
  updateUserDevicePersonaModelsSuccess,
} from './actions'
import { DEFAULT_PERSONA_SCORE_DATA, DEFAULT_USER_ALERTS_WITH_TRUST_SCORE_DATA } from './constants'
import { getUserAlertsWithTrustScoreTask, getUserPersonaScoreLogTask } from './selectors'
import type { UserAlertsWithTrustScore, UserPersonaScoreLogData } from './types'
import { UsersActionType } from './types'

export const getUserListSaga = function* ({ payload: { params, apiProvider } }: ReturnType<typeof getUserListStart>) {
  try {
    const { data } = yield call(apiProvider.getUserList, { ...params, includeMeta: true })

    yield put(getUserListSuccess(data))
  } catch (error) {
    yield put(getUserListError(error as Error))
  }
}

export const getDeviceByUserListSaga = function* ({
  payload: { params, apiProvider },
}: ReturnType<typeof getDeviceByUserListStart>) {
  try {
    const { data } = yield call(apiProvider.getDevicesGroupedByUserList, { ...params, includeMeta: true })

    yield put(getDeviceByUserListSuccess(data))
  } catch (error) {
    yield put(getDeviceByUserListError(error as Error))
  }
}

export const getUserDetailsSaga = function* ({ payload: { userId, apiProvider } }: ReturnType<typeof getUserDetailsStart>) {
  try {
    const { data } = yield call(apiProvider.getUserDetails, userId)

    yield put(getUserDetailsSuccess(data))
  } catch (error) {
    yield put(getUserDetailsError(error as Error))
  }
}

export const deleteUsersSaga = function* ({ payload: { userIds, apiProvider } }: ReturnType<typeof deleteUsersStart>) {
  try {
    yield call(apiProvider.deleteUsers, userIds)

    yield put(deleteUsersSuccess())
  } catch (error) {
    yield put(deleteUsersError(error as Error))
  }
}

export const getUserDevicesSaga = function* ({ payload: { userId, apiProvider } }: ReturnType<typeof getUserDevicesStart>) {
  try {
    const { data } = yield call(apiProvider.getUserDevices, userId)

    yield put(getUserDevicesSuccess(data))
  } catch (error) {
    yield put(getUserDevicesError(error as Error))
  }
}

export const getUserDevicePersonaModelsSaga = function* ({
  payload: { params, apiProvider },
}: ReturnType<typeof getUserDevicePersonaModelsStart>) {
  try {
    const { data } = yield call(apiProvider.getPersonaModels, params)

    yield put(getUserDevicePersonaModelsSuccess(params.deviceId, data))
  } catch (error) {
    yield put(getUserDevicePersonaModelsError(params.deviceId, error as Error))
  }
}

export const updateUserDevicePersonaModelsSaga = function* ({
  payload: { params, apiProvider },
}: ReturnType<typeof updateUserDevicePersonaModelsStart>) {
  try {
    yield call(apiProvider.updatePersonaModel, params)

    yield put(updateUserDevicePersonaModelsSuccess(params))
  } catch (error) {
    yield put(updateUserDevicePersonaModelsError(params, error as Error))
  }
}

export const getUserActiveAlertsSaga = function* ({
  payload: { params, apiProvider },
}: ReturnType<typeof getUserActiveAlertsStart>) {
  try {
    const activeAlertsParams = {
      filters: [{ userId: params.userId }, { status: [PersonaAlertStatus.NEW, PersonaAlertStatus.IN_PROGRESS] }],
    }
    const { data } = yield call(apiProvider.getAlertList, activeAlertsParams)

    yield put(getUserActiveAlertsSuccess(data))
  } catch (error) {
    yield put(getUserActiveAlertsError(error as Error))
  }
}

export const getUserHistoryAlertsSaga = function* ({
  payload: { params, apiProvider },
}: ReturnType<typeof getUserHistoryAlertsStart>) {
  try {
    const historyAlertsParams = {
      filters: [{ userId: params.userId }, { status: [PersonaAlertStatus.REVIEWED, PersonaAlertStatus.FALSE_POSITIVE] }],
    }
    const { data } = yield call(apiProvider.getAlertList, historyAlertsParams)

    yield put(getUserHistoryAlertsSuccess(data))
  } catch (error) {
    yield put(getUserHistoryAlertsError(error as Error))
  }
}

export const getUserPersonaScoreLogSaga = function* ({
  payload: { deviceId, params, apiProvider },
}: ReturnType<typeof getUserPersonaScoreLogStart>) {
  // `interval` and `deviceId` will be the same for each requested model
  const { interval } = params[0]

  try {
    // get current score data state
    const { result: currentScoreData }: { result: UserPersonaScoreLogData } = yield select(getUserPersonaScoreLogTask(deviceId))
    // get current score data state for the requested device
    const deviceScoreLogData = currentScoreData ?? DEFAULT_PERSONA_SCORE_DATA

    const fetchedScoresMap = Object.entries(deviceScoreLogData[interval])
      .filter(([_key, value]) => value.length > 0)
      .map(([key]) => key)

    // create calls for scores for each provided model type (aka "scoreType")
    const calls = params
      .filter(value => !fetchedScoresMap.includes(value.params.scoreType))
      .reduce(
        (allCalls, { params: callParams }) => ({
          ...allCalls,
          [callParams.scoreType]: call(apiProvider.getScoreLog, callParams),
        }),
        {},
      )

    // make all calls
    const responses: Record<PersonaScoreType, AlertListResponse> = yield all(calls)

    // create new score data state for the requested device
    const newScoreLogData = {
      ...deviceScoreLogData,
      [interval]: {
        ...deviceScoreLogData[interval],
        ...reduce(
          responses,
          (formattedData, { data }, scoreType) => ({
            ...formattedData,
            [scoreType]: data,
          }),
          {},
        ),
      },
    }

    yield put(getUserPersonaScoreLogSuccess(deviceId, newScoreLogData))
  } catch (error) {
    yield put(getUserPersonaScoreLogError(deviceId, error as Error))
  }
}

export const getUserAlertsWithTrustScoreSaga = function* ({
  payload: {
    params: { params, interval },
    apiProvider,
  },
}: ReturnType<typeof getUserAlertsWithTrustScoreStart>) {
  try {
    // get current alert score data state
    const { result: currentAlerts }: { result: UserAlertsWithTrustScore } = yield select(
      getUserAlertsWithTrustScoreTask(params.deviceId),
    )

    // get current alert score data state for the requested device
    const deviceAlertScoreData = currentAlerts || DEFAULT_USER_ALERTS_WITH_TRUST_SCORE_DATA

    if (deviceAlertScoreData[interval].length === 0) {
      const { data } = yield call(apiProvider.getAlertsWithTrustScore, params)

      // create new alert score data for the requested device
      const newAlertScoreData = {
        ...deviceAlertScoreData,
        [interval]: data,
      }

      yield put(getUserAlertsWithTrustScoreSuccess(params.deviceId, newAlertScoreData))
    } else {
      yield put(getUserAlertsWithTrustScoreSuccess(params.deviceId, deviceAlertScoreData))
    }
  } catch (error) {
    yield put(getUserAlertsWithTrustScoreError(params.deviceId, error as Error))
  }
}

export const getScoreForSelectedAlertsSaga = function* ({
  payload: {
    params: { alertId, deviceId },
    apiProvider,
  },
}: ReturnType<typeof getScoresForSelectedAlertStart>) {
  try {
    const { data: scoredForAlert } = yield call(apiProvider.getScoresForAlert, alertId)

    yield put(getScoresForSelectedAlertSuccess(deviceId, scoredForAlert))
  } catch (error) {
    yield put(getScoresForSelectedAlertError(deviceId, error as Error))
  }
}

export const searchUsersByUsernameSaga = function* ({
  payload: { params, apiProvider },
}: ReturnType<typeof searchUsersByUsernameStart>) {
  try {
    const { data } = yield call(apiProvider.getUsersContainingUsername, params)

    yield put(searchUsersByUsernameSuccess(data))
  } catch (error) {
    yield put(searchUsersByUsernameError(error as Error))
  }
}

export const searchZonesByNameSaga = function* ({ payload: { zoneName, apiProvider } }: ReturnType<typeof searchZonesByNameStart>) {
  try {
    const { data } = yield call(apiProvider.getZonesByName, zoneName)

    yield put(searchZonesByNameSuccess(data))
  } catch (error) {
    yield put(searchZonesByNameError(error as Error))
  }
}

export const searchDevicesByDeviceNameSaga = function* ({
  payload: { params, apiProvider },
}: ReturnType<typeof searchDevicesByDeviceNameStart>) {
  try {
    const { data } = yield call(apiProvider.getDeviceContainsDeviceName, params)

    yield put(searchDevicesByDeviceNameSuccess(data))
  } catch (error) {
    yield put(searchDevicesByDeviceNameError(error as Error))
  }
}

export default function* exclusionSaga() {
  yield all([
    takeLatest(UsersActionType.GetUserListStart, getUserListSaga),
    takeLatest(UsersActionType.GetDeviceByUserListStart, getDeviceByUserListSaga),
    takeLatest(UsersActionType.GetUserDetailsStart, getUserDetailsSaga),
    takeLatest(UsersActionType.DeleteUsersStart, deleteUsersSaga),
    takeLatest(UsersActionType.GetUserDevicesStart, getUserDevicesSaga),
    takeEvery(UsersActionType.GetUserDevicePersonaModelsStart, getUserDevicePersonaModelsSaga),
    takeEvery(UsersActionType.UpdateUserDevicePersonaModelsStart, updateUserDevicePersonaModelsSaga),
    takeLatest(UsersActionType.GetUserActiveAlertsStart, getUserActiveAlertsSaga),
    takeLatest(UsersActionType.GetUserHistoryAlertsStart, getUserHistoryAlertsSaga),
    takeEvery(UsersActionType.GetUserPersonaScoreLogStart, getUserPersonaScoreLogSaga),
    takeLatest(UsersActionType.GetUserAlertsWithTrustScoreStart, getUserAlertsWithTrustScoreSaga),
    takeLatest(UsersActionType.GetScoresForSelectedAlertStart, getScoreForSelectedAlertsSaga),
    takeLatest(UsersActionType.SearchUsersByUsernameStart, searchUsersByUsernameSaga),
    takeLatest(UsersActionType.SearchDevicesByDeviceNameStart, searchDevicesByDeviceNameSaga),
    takeLatest(UsersActionType.SearchZonesByNameStart, searchZonesByNameSaga),
  ])
}
