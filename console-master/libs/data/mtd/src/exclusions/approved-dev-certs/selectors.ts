/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { createSelector } from 'reselect'

import type { ApprovedDevCertsState } from './types'
import { ReduxSlice } from './types'

const getState = (state: { [k in typeof ReduxSlice]: ApprovedDevCertsState }) => state[ReduxSlice]

const getTasks = createSelector(getState, state => state?.tasks)

export const getApprovedDevCerts = createSelector(getTasks, tasks => tasks?.approvedDevCerts?.result?.elements ?? [])

export const getApprovedDevCertsTask = createSelector(getTasks, tasks => tasks?.approvedDevCerts)

export const getCreateApprovedDevCertTask = createSelector(getTasks, tasks => tasks?.createApprovedDevCert)

export const getEditApprovedDevCertTask = createSelector(getTasks, tasks => tasks?.editApprovedDevCert)

export const getDeleteApprovedDevCertsTask = createSelector(getTasks, tasks => tasks?.deleteApprovedDevCerts)

export const getImportApprovedDevCertTask = createSelector(getTasks, tasks => tasks?.importApprovedDevCerts)
