/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { call, put, takeLatest, takeLeading } from 'redux-saga/effects'

import { UesSessionApi } from '@ues-data/shared'

import type { IWebAddress } from '../api/web-addresses/web-addresses-api-types'
import type {
  createApprovedIpAddressStart,
  deleteApprovedIpAddressesStart,
  editApprovedIpAddressStart,
  fetchApprovedIpAddressesStart,
  importApprovedIpAddressesStart,
} from './actions'
import {
  createApprovedIpAddressError,
  createApprovedIpAddressSuccess,
  deleteApprovedIpAddressesError,
  deleteApprovedIpAddressesSuccess,
  editApprovedIpAddressError,
  editApprovedIpAddressSuccess,
  fetchApprovedIpAddressesError,
  fetchApprovedIpAddressesSuccess,
  importApprovedIpAddressesError,
  importApprovedIpAddressesSuccess,
} from './actions'
import { ActionType } from './types'

export const fetchApprovedIpAddressesSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof fetchApprovedIpAddressesStart>>(
    ActionType.FetchApprovedIpAddressesStart,
    function* ({ payload: { queryParams, apiProvider } }) {
      try {
        queryParams.query = { type: 'APPROVED' }
        const { data } = yield call(apiProvider.WebAddresses.searchIpAddresses, UesSessionApi.getTenantId(), queryParams)
        data.offset = queryParams.offset
        yield put(fetchApprovedIpAddressesSuccess({ result: data }))
      } catch (error) {
        yield put(fetchApprovedIpAddressesError(error as Error))
      }
    },
  )
}

export const createApprovedIpAddressesSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof createApprovedIpAddressStart>>(
    ActionType.CreateApprovedIpAddressStart,
    function* ({ payload: { apiProvider, ipAddress } }) {
      const data: IWebAddress = ipAddress
      data.tenantGuid = UesSessionApi.getTenantId()

      try {
        yield call(apiProvider.WebAddresses.createApprovedIpAddress, data)
        yield put(createApprovedIpAddressSuccess())
      } catch (error) {
        yield put(createApprovedIpAddressError(error as Error))
      }
    },
  )
}

export const editApprovedIpAddressesSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof editApprovedIpAddressStart>>(
    ActionType.EditApprovedIpAddressStart,
    function* ({ payload: { apiProvider, ipAddress } }) {
      const data: IWebAddress = ipAddress
      data.tenantGuid = UesSessionApi.getTenantId()

      try {
        yield call(apiProvider.WebAddresses.editApprovedIpAddress, data)
        yield put(editApprovedIpAddressSuccess())
      } catch (error) {
        yield put(editApprovedIpAddressError(error as Error))
      }
    },
  )
}

export const deleteApprovedIpAddressesSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof deleteApprovedIpAddressesStart>>(
    ActionType.DeleteApprovedIpAddressesStart,
    function* ({ payload: { entityIds, apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.WebAddresses.removeMultiple, entityIds)
        yield put(deleteApprovedIpAddressesSuccess({ result: data }))
      } catch (error) {
        yield put(deleteApprovedIpAddressesError(error as Error))
      }
    },
  )
}

export const importApprovedIpAddressesSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof importApprovedIpAddressesStart>>(
    ActionType.ImportApprovedIpAddressesStart,
    function* ({ payload: { apiProvider, file } }) {
      try {
        const { data } = yield call(apiProvider.WebAddresses.importApprovedIpAddress, file)
        yield put(importApprovedIpAddressesSuccess({ result: data }))
      } catch (error) {
        yield put(importApprovedIpAddressesError(error as Error))
      }
    },
  )
}
