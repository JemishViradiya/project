/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { call, put, takeLatest, takeLeading } from 'redux-saga/effects'

import type {
  assotiateDataEntitiesStart,
  createDataEntityStart,
  deleteDataEntityStart,
  editDataEntityStart,
  fetchAssotiatedDataEntitiesStart,
  fetchDataEntitiesByGuidsStart,
  fetchDataEntitiesStart,
  getDataEntityStart,
} from './actions'
import {
  assotiateDataEntitiesError,
  assotiateDataEntitiesSuccess,
  createDataEntityError,
  createDataEntitySuccess,
  deleteDataEntityError,
  deleteDataEntitySuccess,
  editDataEntityError,
  editDataEntitySuccess,
  fetchAssotiatedDataEntitiesError,
  fetchAssotiatedDataEntitiesSuccess,
  fetchDataEntitiesByGuidsError,
  fetchDataEntitiesByGuidsSuccess,
  fetchDataEntitiesError,
  fetchDataEntitiesSuccess,
  getDataEntityError,
  getDataEntitySuccess,
} from './actions'
import { DataEntityActionType } from './types'

export const fetchDataEntitiesSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof fetchDataEntitiesStart>>(
    DataEntityActionType.FetchDataEntitiesStart,
    function* ({ payload: { queryParams, apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.readAll, queryParams)
        if (queryParams) {
          data.offset = queryParams.offset
        }
        yield put(fetchDataEntitiesSuccess(data))
      } catch (error) {
        yield put(fetchDataEntitiesError(error as Error))
      }
    },
  )
}

export const fetchAssociatedDataEntitiesSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof fetchAssotiatedDataEntitiesStart>>(
    DataEntityActionType.GetAssociatedDataEntitiesStart,
    function* ({ payload: { apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.readAssociated)
        yield put(fetchAssotiatedDataEntitiesSuccess(data))
      } catch (error) {
        yield put(fetchAssotiatedDataEntitiesError(error as Error))
      }
    },
  )
}

export const fetchDataEntitiesByGuidsSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof fetchDataEntitiesByGuidsStart>>(
    DataEntityActionType.GetDataEntitiesByGuidsStart,
    function* ({ payload: { dataEntityGuids, apiProvider } }) {
      try {
        // Check for API calls with empty dataEntityGuids array in order to avoid errors
        if (!dataEntityGuids.length) return
        const { data } = yield call(apiProvider.readAllByGuids, dataEntityGuids)
        yield put(fetchDataEntitiesByGuidsSuccess(data))
      } catch (error) {
        yield put(fetchDataEntitiesByGuidsError(error as Error))
      }
    },
  )
}

export const getDataEntitySaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof getDataEntityStart>>(
    DataEntityActionType.GetDataEntityStart,
    function* ({ payload: { dataEntityGuid, apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.read, dataEntityGuid)
        yield put(getDataEntitySuccess(data))
      } catch (error) {
        yield put(getDataEntityError(error as Error))
      }
    },
  )
}

export const createDataEntitiesSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof createDataEntityStart>>(
    DataEntityActionType.CreateDataEntityStart,
    function* ({ payload: { apiProvider, dataEntity } }) {
      try {
        const { data } = yield call(apiProvider.create, dataEntity)
        yield put(createDataEntitySuccess(data))
      } catch (error) {
        yield put(createDataEntityError(error as Error))
      }
    },
  )
}

export const associateDataEntitiesSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof assotiateDataEntitiesStart>>(
    DataEntityActionType.AssociateDataEntitiesStart,
    function* ({ payload: { dataEntityGuids, apiProvider } }) {
      try {
        yield call(apiProvider.associateDataEntity, dataEntityGuids)
        yield put(assotiateDataEntitiesSuccess())
      } catch (error) {
        yield put(assotiateDataEntitiesError(error as Error))
      }
    },
  )
}

export const editDataEntitiesSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof editDataEntityStart>>(
    DataEntityActionType.EditDataEntityStart,
    function* ({ payload: { apiProvider, dataEntity } }) {
      try {
        const { data } = yield call(apiProvider.update, dataEntity)
        yield put(editDataEntitySuccess(data))
      } catch (error) {
        yield put(editDataEntityError(error as Error))
      }
    },
  )
}

export const deleteDataEntitiesSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof deleteDataEntityStart>>(
    DataEntityActionType.DeleteDataEntityStart,
    function* ({ payload: { dataEntityGuid, apiProvider } }) {
      try {
        yield call(apiProvider.remove, dataEntityGuid)
        yield put(deleteDataEntitySuccess())
      } catch (error) {
        yield put(deleteDataEntityError(error as Error))
      }
    },
  )
}
