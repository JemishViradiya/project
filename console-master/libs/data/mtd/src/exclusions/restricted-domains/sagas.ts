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
  createRestrictedDomainStart,
  deleteMultipleRestrictedDomainsStart,
  deleteRestrictedDomainStart,
  editRestrictedDomainStart,
  fetchRestrictedDomainsStart,
  importRestrictedDomainsStart,
} from './actions'
import {
  createRestrictedDomainError,
  createRestrictedDomainSuccess,
  deleteMultipleRestrictedDomainsError,
  deleteMultipleRestrictedDomainsSuccess,
  deleteRestrictedDomainError,
  deleteRestrictedDomainSuccess,
  editRestrictedDomainError,
  editRestrictedDomainSuccess,
  fetchRestrictedDomainsError,
  fetchRestrictedDomainsSuccess,
  importRestrictedDomainsError,
  importRestrictedDomainsSuccess,
} from './actions'
import { ActionType } from './types'

export const fetchRestrictedDomainsSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof fetchRestrictedDomainsStart>>(
    ActionType.FetchRestrictedDomainsStart,
    function* ({ payload: { queryParams, apiProvider } }) {
      try {
        queryParams.query = { type: 'RESTRICTED' }
        const { data } = yield call(apiProvider.WebAddresses.searchDomains, UesSessionApi.getTenantId(), queryParams)
        data.offset = queryParams.offset
        yield put(fetchRestrictedDomainsSuccess({ result: data }))
      } catch (error) {
        yield put(fetchRestrictedDomainsError(error as Error))
      }
    },
  )
}

export const createRestrictedDomainsSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof createRestrictedDomainStart>>(
    ActionType.CreateRestrictedDomainStart,
    function* ({ payload: { apiProvider, domain } }) {
      const data: IWebAddress = domain
      data.tenantGuid = UesSessionApi.getTenantId()

      try {
        yield call(apiProvider.WebAddresses.createRestrictedDomain, data)
        yield put(createRestrictedDomainSuccess())
      } catch (error) {
        yield put(createRestrictedDomainError(error as Error))
      }
    },
  )
}

export const editRestrictedDomainsSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof editRestrictedDomainStart>>(
    ActionType.EditRestrictedDomainStart,
    function* ({ payload: { apiProvider, domain } }) {
      const data: IWebAddress = domain
      data.tenantGuid = UesSessionApi.getTenantId()

      try {
        yield call(apiProvider.WebAddresses.editRestrictedDomain, data)
        yield put(editRestrictedDomainSuccess())
      } catch (error) {
        yield put(editRestrictedDomainError(error as Error))
      }
    },
  )
}

export const deleteRestrictedDomainsSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof deleteRestrictedDomainStart>>(
    ActionType.DeleteRestrictedDomainStart,
    function* ({ payload: { entityId, apiProvider } }) {
      try {
        yield call(apiProvider.WebAddresses.remove, entityId)
        yield put(deleteRestrictedDomainSuccess())
      } catch (error) {
        yield put(deleteRestrictedDomainError(error as Error))
      }
    },
  )
}

export const deleteMultipleRestrictedDomainsSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof deleteMultipleRestrictedDomainsStart>>(
    ActionType.DeleteMultipleRestrictedDomainsStart,
    function* ({ payload: { entityIds, apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.WebAddresses.removeMultiple, entityIds)
        yield put(deleteMultipleRestrictedDomainsSuccess({ result: data }))
      } catch (error) {
        yield put(deleteMultipleRestrictedDomainsError(error as Error))
      }
    },
  )
}

export const importRestrictedDomainsSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof importRestrictedDomainsStart>>(
    ActionType.ImportRestrictedDomainsStart,
    function* ({ payload: { apiProvider, file } }) {
      try {
        const { data } = yield call(apiProvider.WebAddresses.importRestrictedDomain, file)
        yield put(importRestrictedDomainsSuccess({ result: data }))
      } catch (error) {
        yield put(importRestrictedDomainsError(error as Error))
      }
    },
  )
}
