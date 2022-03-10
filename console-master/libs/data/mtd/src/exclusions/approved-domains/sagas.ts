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
  createApprovedDomainStart,
  deleteApprovedDomainStart,
  deleteMultipleApprovedDomainsStart,
  editApprovedDomainStart,
  fetchApprovedDomainsStart,
  importApprovedDomainsStart,
} from './actions'
import {
  createApprovedDomainError,
  createApprovedDomainSuccess,
  deleteApprovedDomainError,
  deleteApprovedDomainSuccess,
  deleteMultipleApprovedDomainsError,
  deleteMultipleApprovedDomainsSuccess,
  editApprovedDomainError,
  editApprovedDomainSuccess,
  fetchApprovedDomainsError,
  fetchApprovedDomainsSuccess,
  importApprovedDomainsError,
  importApprovedDomainsSuccess,
} from './actions'
import { ActionType } from './types'

export const fetchApprovedDomainsSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof fetchApprovedDomainsStart>>(
    ActionType.FetchApprovedDomainsStart,
    function* ({ payload: { queryParams, apiProvider } }) {
      try {
        queryParams.query = { type: 'APPROVED' }
        const { data } = yield call(apiProvider.WebAddresses.searchDomains, UesSessionApi.getTenantId(), queryParams)
        data.offset = queryParams.offset
        yield put(fetchApprovedDomainsSuccess({ result: data }))
      } catch (error) {
        yield put(fetchApprovedDomainsError(error as Error))
      }
    },
  )
}

export const createApprovedDomainsSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof createApprovedDomainStart>>(
    ActionType.CreateApprovedDomainStart,
    function* ({ payload: { apiProvider, domain } }) {
      const data: IWebAddress = domain
      data.tenantGuid = UesSessionApi.getTenantId()

      try {
        yield call(apiProvider.WebAddresses.createApprovedDomain, data)
        yield put(createApprovedDomainSuccess())
      } catch (error) {
        yield put(createApprovedDomainError(error as Error))
      }
    },
  )
}

export const editApprovedDomainsSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof editApprovedDomainStart>>(
    ActionType.EditApprovedDomainStart,
    function* ({ payload: { apiProvider, domain } }) {
      const data: IWebAddress = domain
      data.tenantGuid = UesSessionApi.getTenantId()

      try {
        yield call(apiProvider.WebAddresses.editApprovedDomain, data)
        yield put(editApprovedDomainSuccess())
      } catch (error) {
        yield put(editApprovedDomainError(error as Error))
      }
    },
  )
}

export const deleteApprovedDomainsSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof deleteApprovedDomainStart>>(
    ActionType.DeleteApprovedDomainStart,
    function* ({ payload: { entityId, apiProvider } }) {
      try {
        yield call(apiProvider.WebAddresses.remove, entityId)
        yield put(deleteApprovedDomainSuccess())
      } catch (error) {
        yield put(deleteApprovedDomainError(error as Error))
      }
    },
  )
}

export const deleteMultipleApprovedDomainsSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof deleteMultipleApprovedDomainsStart>>(
    ActionType.DeleteMultipleApprovedDomainsStart,
    function* ({ payload: { entityIds, apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.WebAddresses.removeMultiple, entityIds)
        yield put(deleteMultipleApprovedDomainsSuccess({ result: data }))
      } catch (error) {
        yield put(deleteMultipleApprovedDomainsError(error as Error))
      }
    },
  )
}

export const importApprovedDomainsSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof importApprovedDomainsStart>>(
    ActionType.ImportApprovedDomainsStart,
    function* ({ payload: { apiProvider, file } }) {
      try {
        const { data } = yield call(apiProvider.WebAddresses.importApprovedDomain, file)
        yield put(importApprovedDomainsSuccess({ result: data }))
      } catch (error) {
        yield put(importApprovedDomainsError(error as Error))
      }
    },
  )
}
