//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import { createSelector } from 'reselect'

import type { UesReduxState } from '@ues-data/shared'

import type { PoliciesState } from './types'
import { ReduxSlice } from './types'

const getState = (state: UesReduxState<typeof ReduxSlice, PoliciesState>) => state[ReduxSlice]

const getTasks = createSelector(getState, state => state?.tasks)

export const getPolicy = createSelector(getTasks, tasks => tasks?.policy?.result ?? {})

export const getLocalPolicyData = createSelector(getState, state => state?.ui?.localPolicyData)

export const getPolicyAssignedUsers = createSelector(getTasks, tasks => tasks?.policyAssignedUsers?.result ?? [])

export const getPolicyTask = createSelector(getTasks, tasks => tasks?.policy)

export const getPolicyAssignedUsersTask = createSelector(getTasks, tasks => tasks?.policyAssignedUsers)

export const getCreatePolicyTask = createSelector(getTasks, tasks => tasks?.createPolicy)

export const getUpdatePolicyTask = createSelector(getTasks, tasks => tasks?.updatePolicy)

export const getDeletePolicyTask = createSelector(getTasks, tasks => tasks?.deletePolicy)
