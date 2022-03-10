/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { createSelector } from 'reselect'

import type { RestrictedIpAddressesState } from './types'
import { ReduxSlice } from './types'

const getState = (state: { [k in typeof ReduxSlice]: RestrictedIpAddressesState }) => state[ReduxSlice]

const getTasks = createSelector(getState, state => state?.tasks)

export const getRestrictedIpAddresses = createSelector(getTasks, tasks => tasks?.restrictedIpAddresses?.result?.elements ?? [])

export const getRestrictedIpAddressesTask = createSelector(getTasks, tasks => tasks?.restrictedIpAddresses)

export const getCreateRestrictedIpAddressTask = createSelector(getTasks, tasks => tasks?.createRestrictedIpAddress)

export const getEditRestrictedIpAddressTask = createSelector(getTasks, tasks => tasks?.editRestrictedIpAddress)

export const getDeleteRestrictedIpAddressesTask = createSelector(getTasks, tasks => tasks?.deleteRestrictedIpAddresses)

export const getImportRestrictedIpAddressesTask = createSelector(getTasks, tasks => tasks?.importRestrictedIpAddresses)
