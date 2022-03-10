/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { call, put, takeLatest, takeLeading } from 'redux-saga/effects'

import { PolicyService, PolicyServiceClassMock } from '../common-service/policy'
import { POLICY_SETTING_TYPE } from '../common-service/policy/policy-types'
import type { BrowserDomain } from '../domain-service'
import type {
  createBrowserDomainStart,
  deleteBrowserDomainStart,
  editBrowserDomainStart,
  fetchBrowserDomainsStart,
  getBrowserDomainStart,
  validateBrowserDomainStart,
} from './actions'
import {
  createBrowserDomainError,
  createBrowserDomainSuccess,
  deleteBrowserDomainError,
  deleteBrowserDomainSuccess,
  editBrowserDomainError,
  editBrowserDomainSuccess,
  fetchBrowserDomainsError,
  fetchBrowserDomainsSuccess,
  getBrowserDomainError,
  getBrowserDomainSuccess,
  validateBrowserDomainError,
  validateBrowserDomainSuccess,
} from './actions'
import { BrowserDomainActionType } from './types'

export const fetchBrowserDomainsSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof fetchBrowserDomainsStart>>(
    BrowserDomainActionType.FetchBrowserDomainsStart,
    function* ({ payload: { queryParams, policiesAssignment, apiProvider } }) {
      try {
        const CommonPolicyService = localStorage.getItem('UES_DATA_MOCK') !== 'true' ? PolicyService : PolicyServiceClassMock
        const { data } = yield call(apiProvider.readAll, queryParams)
        let elements
        if (policiesAssignment) {
          const { data: policiesAssignedData } = yield call(CommonPolicyService.getReference, POLICY_SETTING_TYPE.BROWSER)
          elements = data?.elements?.map(d => {
            d.policiesAssigned = policiesAssignedData.find(p => p.reference === d.domain)?.usedInPolicies.length || 0
            return d
          })
        }
        if (queryParams) {
          data.offset = queryParams.offset
        }
        yield put(fetchBrowserDomainsSuccess(elements ? { ...data, elements } : data))
      } catch (error) {
        yield put(fetchBrowserDomainsError(error as Error))
      }
    },
  )
}

export const getBrowserDomainSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof getBrowserDomainStart>>(
    BrowserDomainActionType.GetBrowserDomainStart,
    function* ({ payload: { browserDomainGuid, apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.read, browserDomainGuid)
        yield put(getBrowserDomainSuccess(data))
      } catch (error) {
        yield put(getBrowserDomainError(error as Error))
      }
    },
  )
}

export const createBrowserDomainsSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof createBrowserDomainStart>>(
    BrowserDomainActionType.CreateBrowserDomainStart,
    function* ({ payload: { apiProvider, browserDomain } }) {
      const data: BrowserDomain = browserDomain

      try {
        yield call(apiProvider.create, data)
        yield put(createBrowserDomainSuccess())
      } catch (error) {
        yield put(createBrowserDomainError(error as Error))
      }
    },
  )
}

export const editBrowserDomainsSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof editBrowserDomainStart>>(
    BrowserDomainActionType.EditBrowserDomainStart,
    function* ({ payload: { apiProvider, browserDomainGuid, browserDomain } }) {
      try {
        const { data } = yield call(apiProvider.update, browserDomainGuid, browserDomain)
        yield put(editBrowserDomainSuccess(data))
      } catch (error) {
        yield put(editBrowserDomainError(error as Error))
      }
    },
  )
}

export const deleteBrowserDomainsSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof deleteBrowserDomainStart>>(
    BrowserDomainActionType.DeleteBrowserDomainStart,
    function* ({ payload: { browserDomainGuid, apiProvider } }) {
      try {
        yield call(apiProvider.remove, browserDomainGuid)
        yield put(deleteBrowserDomainSuccess())
      } catch (error) {
        yield put(deleteBrowserDomainError(error as Error))
      }
    },
  )
}

export const validateBrowserDomainSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof validateBrowserDomainStart>>(
    BrowserDomainActionType.ValidateBrowserDomainStart,
    function* ({ payload: { domainName, apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.validate, domainName)
        yield put(validateBrowserDomainSuccess(data))
      } catch (error) {
        const httpStatusCode = error.response.status
        yield put(validateBrowserDomainError(error as Error, httpStatusCode))
      }
    },
  )
}
