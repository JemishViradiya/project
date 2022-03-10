/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { call, put, takeLatest } from 'redux-saga/effects'

import type { fetchFileDetailsStart, fetchFileInventoryStart } from './actions'
import { fetchFileDetailsError, fetchFileDetailsSuccess, fetchFileInventoryError, fetchFileInventorySuccess } from './actions'
import { FileInventoryActionType } from './types'

export const fetchFileInventorySaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof fetchFileInventoryStart>>(
    FileInventoryActionType.FetchFileInventoryStart,
    function* ({ payload: { queryParams, apiProvider } }) {
      try {
        const hashes = []
        const { data } = yield call(apiProvider.readAll, queryParams)
        data?.elements?.map(element => hashes.push(element?.hash))

        const { data: countsData } = yield call(apiProvider.readUserAndDeviceCounts, hashes)
        data?.elements?.map(element => {
          if (countsData[element?.hash]) {
            Object.assign(element, countsData[element?.hash])
          }
          return element
        })
        yield put(fetchFileInventorySuccess(data))
      } catch (error) {
        yield put(fetchFileInventoryError(error as Error))
      }
    },
  )
}

export const fetchFileDetailsSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof fetchFileDetailsStart>>(
    FileInventoryActionType.FetchFileDetailsStart,
    function* ({ payload: { fileHash, apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.read, fileHash)
        yield put(fetchFileDetailsSuccess(data))
      } catch (error) {
        yield put(fetchFileDetailsError(error as Error))
      }
    },
  )
}
