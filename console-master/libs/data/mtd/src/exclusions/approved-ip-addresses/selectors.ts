/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { createSelector } from 'reselect'

import type { ApprovedIpAddressesState } from './types'
import { ReduxSlice } from './types'

const getState = (state: { [k in typeof ReduxSlice]: ApprovedIpAddressesState }) => state[ReduxSlice]

const getTasks = createSelector(getState, state => state?.tasks)

export const getApprovedIpAddresses = createSelector(getTasks, tasks => tasks?.approvedIpAddresses?.result?.elements ?? [])

export const getApprovedIpAddressesTask = createSelector(getTasks, tasks => tasks?.approvedIpAddresses)

export const getCreateApprovedIpAddressTask = createSelector(getTasks, tasks => tasks?.createApprovedIpAddress)

export const getEditApprovedIpAddressTask = createSelector(getTasks, tasks => tasks?.editApprovedIpAddress)

export const getDeleteApprovedIpAddressesTask = createSelector(getTasks, tasks => tasks?.deleteApprovedIpAddresses)

export const getImportApprovedIpAddressesTask = createSelector(getTasks, tasks => tasks?.importApprovedIpAddresses)
