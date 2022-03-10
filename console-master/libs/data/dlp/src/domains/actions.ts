/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { PagableResponse } from '@ues-data/shared-types'

import type { BrowserDomain } from '../domain-service/domains-types'
import type { PageableSortableQueryParamsWithPolicesAssignment } from '../types'
import type { ApiProvider } from './types'
import { BrowserDomainActionType } from './types'

//fetch domains
export const fetchBrowserDomainsStart = (
  payload: PageableSortableQueryParamsWithPolicesAssignment<BrowserDomain>,
  apiProvider: ApiProvider,
) => {
  const { policiesAssignment, ...queries } = payload
  return {
    type: BrowserDomainActionType.FetchBrowserDomainsStart,
    payload: { queryParams: queries, policiesAssignment: policiesAssignment ?? false, apiProvider },
  }
}

export const fetchBrowserDomainsSuccess = (payload: PagableResponse<BrowserDomain>) => ({
  type: BrowserDomainActionType.FetchBrowserDomainsSuccess,
  payload,
})

export const fetchBrowserDomainsError = (error: Error) => ({
  type: BrowserDomainActionType.FetchBrowserDomainsError,
  payload: { error },
})

//get domain
export const getBrowserDomainStart = (payload: { browserDomainGuid: string }, apiProvider: ApiProvider) => ({
  type: BrowserDomainActionType.GetBrowserDomainStart,
  payload: { ...payload, apiProvider },
})

export const getBrowserDomainSuccess = (payload: BrowserDomain) => ({
  type: BrowserDomainActionType.GetBrowserDomainSuccess,
  payload,
})

export const getBrowserDomainError = (error: Error) => ({
  type: BrowserDomainActionType.GetBrowserDomainError,
  payload: { error },
})

//create domain
export const createBrowserDomainStart = (payload: BrowserDomain, apiProvider: ApiProvider) => ({
  type: BrowserDomainActionType.CreateBrowserDomainStart,
  payload: { apiProvider, browserDomain: payload },
})

export const createBrowserDomainSuccess = () => ({
  type: BrowserDomainActionType.CreateBrowserDomainSuccess,
})

export const createBrowserDomainError = (error: Error) => ({
  type: BrowserDomainActionType.CreateBrowserDomainError,
  payload: { error },
})

//edit domain
export const editBrowserDomainStart = (
  payload: { browserDomainGuid: string; browserDomain: BrowserDomain },
  apiProvider: ApiProvider,
) => ({
  type: BrowserDomainActionType.EditBrowserDomainStart,
  payload: { ...payload, apiProvider },
})

export const editBrowserDomainSuccess = (payload: BrowserDomain) => ({
  type: BrowserDomainActionType.EditBrowserDomainSuccess,
  payload,
})

export const editBrowserDomainError = (error: Error) => ({
  type: BrowserDomainActionType.EditBrowserDomainError,
  payload: { error },
})

//delete domain
export const deleteBrowserDomainStart = (payload: { browserDomainGuid: string }, apiProvider: ApiProvider) => ({
  type: BrowserDomainActionType.DeleteBrowserDomainStart,
  payload: { ...payload, apiProvider },
})

export const deleteBrowserDomainSuccess = () => ({
  type: BrowserDomainActionType.DeleteBrowserDomainSuccess,
})

export const deleteBrowserDomainError = (error: Error) => ({
  type: BrowserDomainActionType.DeleteBrowserDomainError,
  payload: { error },
})

export const validateBrowserDomainStart = (payload: { domainName: string }, apiProvider: ApiProvider) => ({
  type: BrowserDomainActionType.ValidateBrowserDomainStart,
  payload: { ...payload, apiProvider },
})

export const validateBrowserDomainSuccess = (payload: { httpStatusCode: string }) => ({
  type: BrowserDomainActionType.ValidateBrowserDomainSuccess,
  payload,
})

export const validateBrowserDomainError = (error: Error, httpStatusCode: string) => ({
  type: BrowserDomainActionType.ValidateBrowserDomainError,
  payload: { error, httpStatusCode },
})
