/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { PagableResponse } from '@ues-data/shared-types'

import type { BrowserDomain, BrowserDomainApi, BrowserDomainMockApi } from '../domain-service'

export type ApiProvider = typeof BrowserDomainApi | typeof BrowserDomainMockApi

export const BrowserDomainsReduxSlice = 'app.dlp.domains'

export interface Task<TResult = unknown> {
  loading?: boolean
  error?: Error
  result?: TResult
}

export enum TaskId {
  BrowserDomains = 'browserDomains',
  GetBrowserDomain = 'getBrowserDomain',
  CreateBrowserDomain = 'createBrowserDomain',
  EditBrowserDomain = 'editBrowserDomain',
  DeleteBrowserDomain = 'deleteBrowserDomain',
  ValidateBrowserDomain = 'validateBrowserDomain',
}

export interface BrowserDomainsState {
  tasks?: {
    browserDomains: Task<PagableResponse<BrowserDomain>>
    getBrowserDomain: Task<BrowserDomain>
    createBrowserDomain: Task
    editBrowserDomain: Task
    deleteBrowserDomain: Task
    validateBrowserDomain: Task
  }
}

export const BrowserDomainActionType = {
  FetchBrowserDomainsStart: `${BrowserDomainsReduxSlice}/fetch-browser-domains-start`,
  FetchBrowserDomainsError: `${BrowserDomainsReduxSlice}/fetch-browser-domains-error`,
  FetchBrowserDomainsSuccess: `${BrowserDomainsReduxSlice}/fetch-browser-domains-success`,

  GetBrowserDomainStart: `${BrowserDomainsReduxSlice}/get-browser-domain-start`,
  GetBrowserDomainError: `${BrowserDomainsReduxSlice}/get-browser-domain-error`,
  GetBrowserDomainSuccess: `${BrowserDomainsReduxSlice}/get-browser-domain-success`,

  CreateBrowserDomainStart: `${BrowserDomainsReduxSlice}/create-browser-domain-start`,
  CreateBrowserDomainError: `${BrowserDomainsReduxSlice}/create-browser-domain-error`,
  CreateBrowserDomainSuccess: `${BrowserDomainsReduxSlice}/create-browser-domain-success`,

  EditBrowserDomainStart: `${BrowserDomainsReduxSlice}/edit-browser-domain-start`,
  EditBrowserDomainError: `${BrowserDomainsReduxSlice}/edit-browser-domain-error`,
  EditBrowserDomainSuccess: `${BrowserDomainsReduxSlice}/edit-browser-domain-success`,

  DeleteBrowserDomainStart: `${BrowserDomainsReduxSlice}/delete-browser-domain-start`,
  DeleteBrowserDomainError: `${BrowserDomainsReduxSlice}/delete-browser-domain-error`,
  DeleteBrowserDomainSuccess: `${BrowserDomainsReduxSlice}/delete-browser-domain-success`,

  ValidateBrowserDomainStart: `${BrowserDomainsReduxSlice}/validate-browser-domain-start`,
  ValidateBrowserDomainError: `${BrowserDomainsReduxSlice}/validate-browser-domain-error`,
  ValidateBrowserDomainSuccess: `${BrowserDomainsReduxSlice}/validate-browser-domain-success`,
}

// eslint-disable-next-line no-redeclare
export type BrowserDomainActionType = string
