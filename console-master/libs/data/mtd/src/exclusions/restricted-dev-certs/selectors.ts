/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { createSelector } from 'reselect'

import type { RestrictedDevCertsState } from './types'
import { ReduxSlice } from './types'

const getState = (state: { [k in typeof ReduxSlice]: RestrictedDevCertsState }) => state[ReduxSlice]

const getTasks = createSelector(getState, state => state?.tasks)

export const getRestrictedDevCerts = createSelector(getTasks, tasks => tasks?.restrictedDevCerts?.result?.elements ?? [])

export const getRestrictedDevCertsTask = createSelector(getTasks, tasks => tasks?.restrictedDevCerts)

export const getCreateRestrictedDevCertTask = createSelector(getTasks, tasks => tasks?.createRestrictedDevCert)

export const getEditRestrictedDevCertTask = createSelector(getTasks, tasks => tasks?.editRestrictedDevCert)

export const getDeleteRestrictedDevCertsTask = createSelector(getTasks, tasks => tasks?.deleteRestrictedDevCerts)

export const getImportRestrictedDevCertsTask = createSelector(getTasks, tasks => tasks?.importRestrictedDevCerts)
