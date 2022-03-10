/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { createSelector } from 'reselect'

import type { RestrictedDomainsState } from './types'
import { ReduxSlice } from './types'

const getState = (state: { [k in typeof ReduxSlice]: RestrictedDomainsState }) => state[ReduxSlice]

const getTasks = createSelector(getState, state => state?.tasks)

export const getRestrictedDomains = createSelector(getTasks, tasks => tasks?.restrictedDomains?.result?.elements ?? [])

export const getRestrictedDomainsTask = createSelector(getTasks, tasks => tasks?.restrictedDomains)

export const getCreateRestrictedDomainTask = createSelector(getTasks, tasks => tasks?.createRestrictedDomain)

export const getEditRestrictedDomainTask = createSelector(getTasks, tasks => tasks?.editRestrictedDomain)

export const getDeleteRestrictedDomainTask = createSelector(getTasks, tasks => tasks?.deleteRestrictedDomain)

export const getDeleteMultipleRestrictedDomainsTask = createSelector(getTasks, tasks => tasks?.deleteMultipleRestrictedDomains)

export const getImportRestrictedDomainsTask = createSelector(getTasks, tasks => tasks?.importRestrictedDomains)
