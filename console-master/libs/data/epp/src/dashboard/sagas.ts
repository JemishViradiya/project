import { all, call, put, takeLatest } from 'redux-saga/effects'

import type {
  fetchDeviceProtectionPercentageStart,
  fetchThreatEventsStart,
  fetchThreatProtectionPercentageStart,
  fetchThreatsByPriorityStart,
  fetchThreatStatsStart,
  fetchTopTenListStart,
  fetchTotalFilesAnalyzedStart,
} from './actions'
import {
  fetchDeviceProtectionPercentageError,
  fetchDeviceProtectionPercentageSuccess,
  fetchThreatEventsError,
  fetchThreatEventsSuccess,
  fetchThreatProtectionPercentageError,
  fetchThreatProtectionPercentageSuccess,
  fetchThreatsByPriorityError,
  fetchThreatsByPrioritySuccess,
  fetchThreatStatsError,
  fetchThreatStatsSuccess,
  fetchTopTenListError,
  fetchTopTenListSuccess,
  fetchTotalFilesAnalyzedError,
  fetchTotalFilesAnalyzedSuccess,
} from './actions'
import { EppDashboardAction } from './constants'

const fetchThreatStatsSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof fetchThreatStatsStart>>(
    EppDashboardAction.FetchThreatStatsStart,
    function* ({ payload: { apiProvider } }) {
      try {
        const data = yield call(apiProvider.getThreatStats)
        yield put(fetchThreatStatsSuccess(data))
      } catch (error) {
        yield put(fetchThreatStatsError(error as Error))
      }
    },
  )
}

const fetchTotalFilesAnalyzedSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof fetchTotalFilesAnalyzedStart>>(
    EppDashboardAction.FetchTotalFilesAnalyzedStart,
    function* ({ payload: { apiProvider } }) {
      try {
        const data = yield call(apiProvider.getTotalFilesAnalyzed)
        yield put(fetchTotalFilesAnalyzedSuccess(data))
      } catch (error) {
        yield put(fetchTotalFilesAnalyzedError(error as Error))
      }
    },
  )
}

const fetchThreatsByPrioritySaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof fetchThreatsByPriorityStart>>(
    EppDashboardAction.FetchThreatsByPriorityStart,
    function* ({ payload: { apiProvider } }) {
      try {
        const data = yield call(apiProvider.getThreatsByPriority)
        yield put(fetchThreatsByPrioritySuccess(data))
      } catch (error) {
        yield put(fetchThreatsByPriorityError(error as Error))
      }
    },
  )
}

const fetchThreatProtectionPercentageSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof fetchThreatProtectionPercentageStart>>(
    EppDashboardAction.FetchThreatProtectionPercentageStart,
    function* ({ payload: { apiProvider } }) {
      try {
        const data = yield call(apiProvider.getThreatProtectionPercentage)
        yield put(fetchThreatProtectionPercentageSuccess(data))
      } catch (error) {
        yield put(fetchThreatProtectionPercentageError(error as Error))
      }
    },
  )
}

const fetchDeviceProtectionPercentageSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof fetchDeviceProtectionPercentageStart>>(
    EppDashboardAction.FetchDeviceProtectionPercentageStart,
    function* ({ payload: { apiProvider } }) {
      try {
        const data = yield call(apiProvider.getDeviceProtectionPercentage)
        yield put(fetchDeviceProtectionPercentageSuccess(data))
      } catch (error) {
        yield put(fetchDeviceProtectionPercentageError(error as Error))
      }
    },
  )
}

const fetchTopTenListSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof fetchTopTenListStart>>(
    EppDashboardAction.FetchTopTenListStart,
    function* ({ payload: { apiProvider } }) {
      try {
        const data = yield call(apiProvider.getTopTenLists)
        yield put(fetchTopTenListSuccess(data))
      } catch (error) {
        yield put(fetchTopTenListError(error as Error))
      }
    },
  )
}

const fetchThreatEventsSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof fetchThreatEventsStart>>(
    EppDashboardAction.FetchThreatEventsStart,
    function* ({ payload: { apiProvider } }) {
      try {
        const data = yield call(apiProvider.getThreatEvents)
        for (const ev of data) {
          ev.ThreatEventsDate = new Date(parseInt(ev.ThreatEventsDate.slice(6, -2))).toISOString()
        }
        yield put(fetchThreatEventsSuccess(data))
      } catch (error) {
        yield put(fetchThreatEventsError(error as Error))
      }
    },
  )
}

const rootSaga = function* (): Generator {
  yield all([
    fetchThreatStatsSaga(),
    fetchTotalFilesAnalyzedSaga(),
    fetchThreatsByPrioritySaga(),
    fetchThreatEventsSaga(),
    fetchThreatProtectionPercentageSaga(),
    fetchDeviceProtectionPercentageSaga(),
    fetchTopTenListSaga(),
  ])
}

export {
  rootSaga as default,
  fetchThreatStatsSaga,
  fetchTotalFilesAnalyzedSaga,
  fetchThreatsByPrioritySaga,
  fetchThreatEventsSaga,
  fetchThreatProtectionPercentageSaga,
  fetchDeviceProtectionPercentageSaga,
  fetchTopTenListSaga,
}
