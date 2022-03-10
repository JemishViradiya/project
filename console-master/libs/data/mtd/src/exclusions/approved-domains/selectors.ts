/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { createSelector } from 'reselect'

import type { ApprovedDomainsState } from './types'
import { ReduxSlice } from './types'

const getState = (state: { [k in typeof ReduxSlice]: ApprovedDomainsState }) => state[ReduxSlice]

const getTasks = createSelector(getState, state => state?.tasks)

export const getApprovedDomains = createSelector(getTasks, tasks => tasks?.approvedDomains?.result?.elements ?? [])

export const getApprovedDomainsTask = createSelector(getTasks, tasks => tasks?.approvedDomains)

export const getCreateApprovedDomainTask = createSelector(getTasks, tasks => tasks?.createApprovedDomain)

export const getEditApprovedDomainTask = createSelector(getTasks, tasks => tasks?.editApprovedDomain)

export const getDeleteApprovedDomainTask = createSelector(getTasks, tasks => tasks?.deleteApprovedDomain)

export const getDeleteMultipleApprovedDomainsTask = createSelector(getTasks, tasks => tasks?.deleteMultipleApprovedDomains)

export const getImportApprovedDomainsTask = createSelector(getTasks, tasks => tasks?.importApprovedDomains)
