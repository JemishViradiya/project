/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { call, put, takeLatest, takeLeading } from 'redux-saga/effects'

import { UesSessionApi } from '@ues-data/shared'

import type { IWebAddress } from '../api'
import type {
  createRestrictedIpAddressStart,
  deleteRestrictedIpAddressesStart,
  editRestrictedIpAddressStart,
  fetchRestrictedIpAddressesStart,
  importRestrictedIpAddressesStart,
} from './actions'
import {
  createRestrictedIpAddressError,
  createRestrictedIpAddressSuccess,
  deleteRestrictedIpAddressesError,
  deleteRestrictedIpAddressesSuccess,
  editRestrictedIpAddressError,
  editRestrictedIpAddressSuccess,
  fetchRestrictedIpAddressesError,
  fetchRestrictedIpAddressesSuccess,
  importRestrictedIpAddressesError,
  importRestrictedIpAddressesSuccess,
} from './actions'
import { ActionType } from './types'

export const fetchRestrictedIpAddressesSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof fetchRestrictedIpAddressesStart>>(
    ActionType.FetchRestrictedIpAddressesStart,
    function* ({ payload: { queryParams, apiProvider } }) {
      try {
        queryParams.query = { type: 'RESTRICTED' }
        const { data } = yield call(apiProvider.WebAddresses.searchIpAddresses, UesSessionApi.getTenantId(), queryParams)
        data.offset = queryParams.offset
        yield put(fetchRestrictedIpAddressesSuccess({ result: data }))
      } catch (error) {
        yield put(fetchRestrictedIpAddressesError(error as Error))
      }
    },
  )
}

export const createRestrictedIpAddressesSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof createRestrictedIpAddressStart>>(
    ActionType.CreateRestrictedIpAddressStart,
    function* ({ payload: { apiProvider, ipAddress } }) {
      const data: IWebAddress = ipAddress
      data.tenantGuid = UesSessionApi.getTenantId()

      try {
        yield call(apiProvider.WebAddresses.createRestrictedIpAddress, data)
        yield put(createRestrictedIpAddressSuccess())
      } catch (error) {
        yield put(createRestrictedIpAddressError(error as Error))
      }
    },
  )
}

export const editRestrictedIpAddressesSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof editRestrictedIpAddressStart>>(
    ActionType.EditRestrictedIpAddressStart,
    function* ({ payload: { apiProvider, ipAddress } }) {
      const data: IWebAddress = ipAddress
      data.tenantGuid = UesSessionApi.getTenantId()

      try {
        yield call(apiProvider.WebAddresses.editRestrictedIpAddress, data)
        yield put(editRestrictedIpAddressSuccess())
      } catch (error) {
        yield put(editRestrictedIpAddressError(error as Error))
      }
    },
  )
}

export const deleteRestrictedIpAddressesSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof deleteRestrictedIpAddressesStart>>(
    ActionType.DeleteRestrictedIpAddressesStart,
    function* ({ payload: { entityIds, apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.WebAddresses.removeMultiple, entityIds)
        yield put(deleteRestrictedIpAddressesSuccess({ result: data }))
      } catch (error) {
        yield put(deleteRestrictedIpAddressesError(error as Error))
      }
    },
  )
}

export const importRestrictedIpAddressesSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof importRestrictedIpAddressesStart>>(
    ActionType.ImportRestrictedIpAddressesStart,
    function* ({ payload: { apiProvider, file } }) {
      try {
        const { data } = yield call(apiProvider.WebAddresses.importRestrictedIpAddress, file)
        yield put(importRestrictedIpAddressesSuccess({ result: data }))
      } catch (error) {
        yield put(importRestrictedIpAddressesError(error as Error))
      }
    },
  )
}
