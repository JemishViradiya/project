/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { createSelector } from 'reselect'

import type { BrowserDomainsState } from './types'
import { BrowserDomainsReduxSlice } from './types'

const getState = (state: { [k in typeof BrowserDomainsReduxSlice]: BrowserDomainsState }) => state[BrowserDomainsReduxSlice]

const getTasks = createSelector(getState, state => state?.tasks)

export const getBrowserDomainsTask = createSelector(getTasks, tasks => tasks?.browserDomains)

export const getBrowserDomainTask = createSelector(getTasks, tasks => tasks?.getBrowserDomain)

export const getCreateBrowserDomainTask = createSelector(getTasks, tasks => tasks?.createBrowserDomain)

export const getEditBrowserDomainTask = createSelector(getTasks, tasks => tasks?.editBrowserDomain)

export const getDeleteBrowserDomainTask = createSelector(getTasks, tasks => tasks?.deleteBrowserDomain)

export const getValidateBrowserDomainTask = createSelector(getTasks, tasks => tasks?.validateBrowserDomain)
