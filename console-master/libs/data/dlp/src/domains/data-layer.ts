/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { ReduxMutation, ReduxQuery } from '@ues-data/shared'
import type { PagableResponse } from '@ues-data/shared-types'
import { Permission } from '@ues-data/shared-types'

import type { BrowserDomain } from '../domain-service'
import { BrowserDomainApi, BrowserDomainMockApi } from '../domain-service'
import {
  createBrowserDomainStart,
  deleteBrowserDomainStart,
  editBrowserDomainStart,
  fetchBrowserDomainsStart,
  getBrowserDomainStart,
  validateBrowserDomainStart,
} from './actions'
import {
  getBrowserDomainsTask,
  getBrowserDomainTask,
  getCreateBrowserDomainTask,
  getDeleteBrowserDomainTask,
  getEditBrowserDomainTask,
  getValidateBrowserDomainTask,
} from './selectors'
import type { BrowserDomainsState, TaskId } from './types'
import { BrowserDomainsReduxSlice } from './types'

const permissions = new Set([Permission.BIP_SETTINGS_READ])

export const queryBrowserDomains: ReduxQuery<
  PagableResponse<BrowserDomain>,
  Parameters<typeof fetchBrowserDomainsStart>[0],
  BrowserDomainsState['tasks'][TaskId.BrowserDomains]
> = {
  query: payload => fetchBrowserDomainsStart(payload, BrowserDomainApi),
  mockQuery: payload => fetchBrowserDomainsStart(payload, BrowserDomainMockApi),
  selector: () => getBrowserDomainsTask,
  dataProp: 'result',
  slice: BrowserDomainsReduxSlice,
  permissions,
}

export const queryBrowserDomain: ReduxQuery<
  BrowserDomain,
  Parameters<typeof getBrowserDomainStart>[0],
  BrowserDomainsState['tasks'][TaskId.GetBrowserDomain]
> = {
  query: payload => getBrowserDomainStart(payload, BrowserDomainApi),
  mockQuery: payload => getBrowserDomainStart(payload, BrowserDomainMockApi),
  selector: () => getBrowserDomainTask,
  dataProp: 'result',
  slice: BrowserDomainsReduxSlice,
  permissions,
}

export const mutationCreateBrowserDomain: ReduxMutation<
  BrowserDomain,
  Parameters<typeof createBrowserDomainStart>[0],
  BrowserDomainsState['tasks'][TaskId.CreateBrowserDomain]
> = {
  mutation: payload => createBrowserDomainStart(payload, BrowserDomainApi),
  mockMutation: payload => createBrowserDomainStart(payload, BrowserDomainMockApi),
  selector: () => getCreateBrowserDomainTask,
  slice: BrowserDomainsReduxSlice,
}

export const mutationEditBrowserDomain: ReduxMutation<
  BrowserDomain,
  Parameters<typeof editBrowserDomainStart>[0],
  BrowserDomainsState['tasks'][TaskId.EditBrowserDomain]
> = {
  mutation: payload => editBrowserDomainStart(payload, BrowserDomainApi),
  mockMutation: payload => editBrowserDomainStart(payload, BrowserDomainMockApi),
  selector: () => getEditBrowserDomainTask,
  slice: BrowserDomainsReduxSlice,
}

export const mutationDeleteBrowserDomain: ReduxMutation<
  void,
  Parameters<typeof deleteBrowserDomainStart>[0],
  BrowserDomainsState['tasks'][TaskId.DeleteBrowserDomain]
> = {
  mutation: payload => deleteBrowserDomainStart(payload, BrowserDomainApi),
  mockMutation: payload => deleteBrowserDomainStart(payload, BrowserDomainMockApi),
  selector: () => getDeleteBrowserDomainTask,
  slice: BrowserDomainsReduxSlice,
}

export const validateBrowserDomain: ReduxQuery<
  BrowserDomain,
  Parameters<typeof validateBrowserDomainStart>[0],
  BrowserDomainsState['tasks'][TaskId.ValidateBrowserDomain]
> = {
  query: payload => validateBrowserDomainStart(payload, BrowserDomainApi),
  mockQuery: payload => validateBrowserDomainStart(payload, BrowserDomainMockApi),
  selector: () => getValidateBrowserDomainTask,
  dataProp: 'result',
  slice: BrowserDomainsReduxSlice,
  permissions,
}
