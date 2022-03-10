import reduce from 'lodash-es/reduce'
import { all, call, put, select, takeLatest } from 'redux-saga/effects'

import type { AlertListResponse, PersonaAlertType, PersonaScoreType } from '../alert-service'
import { PERSONA_ALERT_TYPE_TO_EVENT_ID_MAP } from '../constants'
import type { StatisticsCountResponse } from '../types'
import type { UserWithTrustScore } from '../user-service'
import type { UserAlertsWithTrustScore, UserPersonaScoreLogData } from '../users'
import { DEFAULT_PERSONA_SCORE_DATA, DEFAULT_USER_ALERTS_WITH_TRUST_SCORE_DATA } from '../users'
import type {
  addAlertCommentStart,
  deleteAlertCommentStart,
  getAlertCommentsStart,
  getAlertDetailsStart,
  getAlertListStart,
  getRelatedAlertsStart,
  getScoresForSelectedAlertStart,
  getTenantAlertCountsStart,
  getTenantLowestTrustScoreUsersStart,
  getTenantOnlineDeviceCountsStart,
  getUserAlertsWithTrustScoreStart,
  getUserPersonaScoreLogStart,
  searchUsersByUsernameStart,
  searchZonesByNameStart,
  updateAlertStatusStart,
} from './actions'
import {
  addAlertCommentError,
  addAlertCommentSuccess,
  deleteAlertCommentError,
  deleteAlertCommentSuccess,
  getAlertCommentsError,
  getAlertCommentsSuccess,
  getAlertDetailsError,
  getAlertDetailsSuccess,
  getAlertListError,
  getAlertListSuccess,
  getRelatedAlertsError,
  getRelatedAlertsSuccess,
  getScoresForSelectedAlertError,
  getScoresForSelectedAlertSuccess,
  getTenantAlertCountsError,
  getTenantAlertCountsSuccess,
  getTenantLowestTrustScoreUsersError,
  getTenantLowestTrustScoreUsersSuccess,
  getTenantOnlineDeviceCountsError,
  getTenantOnlineDeviceCountsSuccess,
  getUserAlertsWithTrustScoreError,
  getUserAlertsWithTrustScoreSuccess,
  getUserPersonaScoreLogError,
  getUserPersonaScoreLogSuccess,
  searchUsersByUsernameError,
  searchUsersByUsernameSuccess,
  searchZonesByNameError,
  searchZonesByNameSuccess,
  updateAlertStatusError,
  updateAlertStatusSuccess,
} from './actions'
import { getUserAlertsWithTrustScoreTask, getUserPersonaScoreLogTask } from './selectors'
import { DashboardActionType } from './types'

export const getAlertListSaga = function* ({ payload: { params, apiProvider } }: ReturnType<typeof getAlertListStart>) {
  try {
    const { data } = yield call(apiProvider.getAlertList, { ...params, includeMeta: true })

    yield put(getAlertListSuccess(data))
  } catch (error) {
    yield put(getAlertListError(error as Error))
  }
}

export const getAlertDetailsSaga = function* ({ payload: { alertId, apiProvider } }: ReturnType<typeof getAlertDetailsStart>) {
  try {
    const { data } = yield call(apiProvider.getAlertDetails, alertId)

    yield put(getAlertDetailsSuccess(data))
  } catch (error) {
    yield put(getAlertDetailsError(error as Error))
  }
}

export const getUserPersonaScoreLogSaga = function* ({
  payload: { params, apiProvider },
}: ReturnType<typeof getUserPersonaScoreLogStart>) {
  // `interval` and `deviceId` will be the same for each requested model
  const { interval } = params[0]

  try {
    // get current score data state
    const { result: currentScoreData }: { result: UserPersonaScoreLogData } = yield select(getUserPersonaScoreLogTask)
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

    yield put(getUserPersonaScoreLogSuccess(newScoreLogData))
  } catch (error) {
    yield put(getUserPersonaScoreLogError(error as Error))
  }
}

export const getAlertsWithTrustScoreSaga = function* ({
  payload: {
    params: { params, interval },
    apiProvider,
  },
}: ReturnType<typeof getUserAlertsWithTrustScoreStart>) {
  try {
    // get current alert score data state
    const { result: currentAlerts }: { result: UserAlertsWithTrustScore } = yield select(getUserAlertsWithTrustScoreTask)

    // get current alert score data state for the requested device
    const deviceAlertScoreData = currentAlerts || DEFAULT_USER_ALERTS_WITH_TRUST_SCORE_DATA

    if (deviceAlertScoreData[interval].length === 0) {
      const { data } = yield call(apiProvider.getAlertsWithTrustScore, params)

      // create new alert score data for the requested device
      const newAlertScoreData = {
        ...deviceAlertScoreData,
        [interval]: data,
      }

      yield put(getUserAlertsWithTrustScoreSuccess(newAlertScoreData))
    } else {
      yield put(getUserAlertsWithTrustScoreSuccess(deviceAlertScoreData))
    }
  } catch (error) {
    yield put(getUserAlertsWithTrustScoreError(error as Error))
  }
}

export const getScoreForSelectedAlertsSaga = function* ({
  payload: {
    params: { alertId },
    apiProvider,
  },
}: ReturnType<typeof getScoresForSelectedAlertStart>) {
  try {
    const { data: scoredForAlert } = yield call(apiProvider.getScoresForAlert, alertId)

    yield put(getScoresForSelectedAlertSuccess(scoredForAlert))
  } catch (error) {
    yield put(getScoresForSelectedAlertError(error as Error))
  }
}

export const updateAlertStatusSaga = function* ({ payload: { params, apiProvider } }: ReturnType<typeof updateAlertStatusStart>) {
  try {
    yield call(apiProvider.updateAlertStatus, params)

    yield put(updateAlertStatusSuccess())
  } catch (error) {
    yield put(updateAlertStatusError(error as Error))
  }
}

export const getRelatedAlertsSaga = function* ({ payload: { params, apiProvider } }: ReturnType<typeof getRelatedAlertsStart>) {
  try {
    const { data: res }: { data: AlertListResponse } = yield call(apiProvider.getAlertList, params)

    const { alertId } = params

    yield put(
      getRelatedAlertsSuccess({
        ...res,
        data: res.data.filter(alert => alert.alertId !== alertId),
      }),
    )
  } catch (error) {
    yield put(getRelatedAlertsError(error as Error))
  }
}

export const getAlertCommentsSaga = function* ({ payload: { alertId, apiProvider } }: ReturnType<typeof getAlertCommentsStart>) {
  try {
    const { data } = yield call(apiProvider.getAlertHistoryAndComments, alertId)

    yield put(getAlertCommentsSuccess(data))
  } catch (error) {
    yield put(getAlertCommentsError(error as Error))
  }
}

export const addAlertCommentSaga = function* ({ payload: { params, apiProvider } }: ReturnType<typeof addAlertCommentStart>) {
  try {
    yield call(apiProvider.addAlertComment, params)

    yield put(addAlertCommentSuccess())
  } catch (error) {
    yield put(addAlertCommentError(error as Error))
  }
}

export const deleteAlertCommentSaga = function* ({
  payload: { commentId, apiProvider },
}: ReturnType<typeof deleteAlertCommentStart>) {
  try {
    yield call(apiProvider.deleteAlertComment, commentId)

    yield put(deleteAlertCommentSuccess())
  } catch (error) {
    yield put(deleteAlertCommentError(error as Error))
  }
}

export const getTenantAlertCountsSaga = function* ({
  payload: { params, apiProvider },
}: ReturnType<typeof getTenantAlertCountsStart>) {
  try {
    const calls = params.alertTypes.reduce(
      (allCalls, alertType) => ({
        ...allCalls,
        [alertType]: call(apiProvider.getTenantAlertsCountForAlertType, {
          fromTime: params.fromTime,
          toTime: params.toTime,
          interval: params.interval,
          alertableType: PERSONA_ALERT_TYPE_TO_EVENT_ID_MAP[alertType],
        }),
      }),
      {},
    )

    const responses: Record<PersonaAlertType, { data?: StatisticsCountResponse }> = yield all(calls)

    const alertCountsMap = reduce(
      responses,
      (formattedData, { data }, alertType) => ({
        ...formattedData,
        [alertType]: data.count,
      }),
      {},
    )

    yield put(getTenantAlertCountsSuccess(alertCountsMap))
  } catch (error) {
    yield put(getTenantAlertCountsError(error as Error))
  }
}

export const getTenantOnlineDeviceCountsSaga = function* ({
  payload: { params, apiProvider },
}: ReturnType<typeof getTenantOnlineDeviceCountsStart>) {
  try {
    const { data }: { data: StatisticsCountResponse } = yield call(apiProvider.getTenantDeviceOnlineCount, params)

    yield put(getTenantOnlineDeviceCountsSuccess(data.count))
  } catch (error) {
    yield put(getTenantOnlineDeviceCountsError(error as Error))
  }
}

export const getTenantLowestTrustScoreUsersSaga = function* ({
  payload: { apiProvider },
}: ReturnType<typeof getTenantLowestTrustScoreUsersStart>) {
  try {
    const { data }: { data: UserWithTrustScore[] } = yield call(apiProvider.getTenantTopLowestTrustScoreUsers)

    yield put(getTenantLowestTrustScoreUsersSuccess(data))
  } catch (error) {
    yield put(getTenantLowestTrustScoreUsersError(error as Error))
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

export default function* exclusionSaga() {
  yield all([
    takeLatest(DashboardActionType.GetAlertListStart, getAlertListSaga),
    takeLatest(DashboardActionType.GetAlertDetailsStart, getAlertDetailsSaga),
    takeLatest(DashboardActionType.GetRelatedAlersStart, getRelatedAlertsSaga),
    takeLatest(DashboardActionType.GetAlertCommentsStart, getAlertCommentsSaga),
    takeLatest(DashboardActionType.AddAlertCommentStart, addAlertCommentSaga),
    takeLatest(DashboardActionType.DeleteAlertCommentStart, deleteAlertCommentSaga),
    takeLatest(DashboardActionType.GetTenantAlertCountsStart, getTenantAlertCountsSaga),
    takeLatest(DashboardActionType.GetTenantOnlineDeviceCountsStart, getTenantOnlineDeviceCountsSaga),
    takeLatest(DashboardActionType.GetTenantLowestTrustScoreUsersStart, getTenantLowestTrustScoreUsersSaga),
    takeLatest(DashboardActionType.SearchUsersByUsernameStart, searchUsersByUsernameSaga),
    takeLatest(DashboardActionType.SearchZonesByNameStart, searchZonesByNameSaga),
  ])
}
