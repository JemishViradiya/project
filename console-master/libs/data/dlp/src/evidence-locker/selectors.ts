/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { createSelector } from 'reselect'

import type { EvidenceLockerState } from './types'
import { EvidenceLockerReduxSlice } from './types'

const getState = (state: { [k in typeof EvidenceLockerReduxSlice]: EvidenceLockerState }) => state[EvidenceLockerReduxSlice]

const getTasks = createSelector(getState, state => state?.tasks)

export const getEvidenceLockerTask = createSelector(getTasks, tasks => tasks?.getEvidenceLocker)
