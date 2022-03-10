/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { all, call, delay, put, takeEvery, takeLatest, takeLeading } from 'redux-saga/effects'

import { convertDirectoryFromRest, mapData } from '../directoryUtils'
import type {
  addCompanyDirectoryStart,
  cancelSyncDirectoryStart,
  editCompanyDirectoryStart,
  getCompanyDirectoriesStart,
  removeCompanyDirectoryStart,
  syncDirectoryStart,
} from './actions'
import {
  addCompanyDirectoryError,
  addCompanyDirectorySuccess,
  cancelSyncDirectoryError,
  cancelSyncDirectorySuccess,
  editCompanyDirectoryError,
  editCompanyDirectorySuccess,
  getCompanyDirectoriesError,
  getCompanyDirectoriesSuccess,
  removeCompanyDirectoryError,
  removeCompanyDirectorySuccess,
  syncDirectoryError,
  syncDirectoryRetry,
  syncDirectorySuccess,
} from './actions'
import { ActionType } from './types'

export const removeCompanyDirectorySaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof removeCompanyDirectoryStart>>(
    ActionType.RemoveCompanyDirectoryStart,
    function* ({ payload: { id, apiProvider } }) {
      try {
        yield call(apiProvider.removeDirectory, id)
        yield put(removeCompanyDirectorySuccess({ id }))
      } catch (error) {
        yield put(removeCompanyDirectoryError(error as Error))
      }
    },
  )
}

export const addCompanyDirectorySaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof addCompanyDirectoryStart>>(
    ActionType.AddCompanyDirectoryStart,
    function* ({ payload: { directory, apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.addDirectory, directory)
        yield put(addCompanyDirectorySuccess(data))
      } catch (error) {
        yield put(addCompanyDirectoryError(error as Error))
      }
    },
  )
}

export const getCompanyDirectoriesSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof getCompanyDirectoriesStart>>(
    ActionType.GetCompanyDirectoriesStart,
    function* ({ payload: { sortOrder, apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.getDirectories)
        const sortedConnections = data.sort(function (a, b) {
          return ('' + a.name).localeCompare(b.name)
        })

        const connections = mapData(sortOrder === 'asc' ? sortedConnections : sortedConnections.reverse())
        yield put(getCompanyDirectoriesSuccess(connections))

        for (const directory of connections) {
          const { data } = yield call(apiProvider.getSync, directory.id)
          directory.syncStatus = { updated: true, ...data }
          yield put(syncDirectorySuccess({ id: directory.id, syncState: data }))
        }
      } catch (error) {
        yield put(getCompanyDirectoriesError(error as Error))
      }
    },
  )
}

export const editCompanyDirectorySaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof editCompanyDirectoryStart>>(
    ActionType.EditCompanyDirectoryStart,
    function* ({ payload: { directory, apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.editDirectory, directory)
        yield put(editCompanyDirectorySuccess(convertDirectoryFromRest(data)))
      } catch (error) {
        yield put(editCompanyDirectoryError(error as Error))
      }
    },
  )
}

export const cancelSyncDirectorySaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof cancelSyncDirectoryStart>>(
    ActionType.CancelSyncDirectoryStart,
    function* ({ payload: { id, apiProvider } }) {
      try {
        yield call(apiProvider.cancelSync, id)
        const { data } = yield call(apiProvider.getSync, id)
        yield put(cancelSyncDirectorySuccess({ id, syncState: data }))
      } catch (error) {
        yield put(cancelSyncDirectoryError(error as Error))
      }
    },
  )
}

export const syncDirectorySaga = function* (): Generator {
  yield takeEvery<ReturnType<typeof syncDirectoryStart>>(
    ActionType.SyncDirectoryStart,
    function* ({ payload: { id, type, apiProvider } }) {
      const TIMEOUT = 1000 * 60
      const RETRY_STEP = 5000
      let retries = TIMEOUT / RETRY_STEP

      try {
        yield call(apiProvider.startSync, id, type)
        // Wait a seccond for state update on server before getting the updated state
        while (retries > 0) {
          const { data } = yield call(apiProvider.getSync, id)
          if (data.syncState === 'RUNNING') {
            retries -= 1
          } else {
            retries = 0
          }
          if (retries === 0) {
            yield put(syncDirectorySuccess({ id, syncState: data }))
          } else {
            yield put(syncDirectoryRetry({ id, syncState: data }))
          }
          yield delay(RETRY_STEP)
        }
      } catch (error) {
        yield put(syncDirectoryError(error as Error))
      }
    },
  )
}

export const rootSaga = function* (): Generator {
  yield all([
    call(getCompanyDirectoriesSaga),
    call(removeCompanyDirectorySaga),
    call(addCompanyDirectorySaga),
    call(editCompanyDirectorySaga),
    call(cancelSyncDirectorySaga),
    call(syncDirectorySaga),
  ])
}
