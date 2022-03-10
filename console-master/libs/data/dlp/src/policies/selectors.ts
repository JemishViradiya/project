/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { isEqual } from 'lodash-es'
import { createSelector } from 'reselect'

import type { PoliciesState } from './types'
import { PoliciesReduxSlice } from './types'

const getState = (state: { [k in typeof PoliciesReduxSlice]: PoliciesState }) => state[PoliciesReduxSlice]

const getTasks = createSelector(getState, state => state?.tasks)

export const getPolicies = createSelector(getTasks, tasks => tasks?.policies?.result?.elements ?? [])

export const getPoliciesTask = createSelector(getTasks, tasks => tasks?.policies)

export const getPoliciesByGuidsTask = createSelector(getTasks, tasks => tasks?.policiesByGuids)

export const getPolicyTask = createSelector(getTasks, tasks => tasks?.getPolicy)

export const getCreatePolicyTask = createSelector(getTasks, tasks => tasks?.createPolicy)

export const getEditPolicyTask = createSelector(getTasks, tasks => tasks?.editPolicy)

export const getDeletePolicyTask = createSelector(getTasks, tasks => tasks?.deletePolicy)

export const getDefaultPolicyTask = createSelector(getTasks, tasks => tasks?.getDefaultPolicy)

export const getSetDefaultPolicyTask = createSelector(getTasks, tasks => tasks?.setDefaultPolicy)

export const getPolicySettingDefinitionTask = createSelector(getTasks, tasks => tasks?.getPolicySettingDefinition)

export const getLocalPolicyData = createSelector(getState, state => state?.ui?.localPolicyData)

export const getBrowserDomains = createSelector(getState, state => state?.ui?.localPolicyData?.browserDomains)

export const getConditionJSON = createSelector(getState, state => state?.ui?.localPolicyData?.condition)

export const getPolicyRules = createSelector(getState, state => state?.ui?.localPolicyData?.policyRules)

export const getGeneralInfo = createSelector(getState, state => ({
  policyName: state?.ui?.localPolicyData?.policyName,
  description: state?.ui?.localPolicyData?.description,
  classification: state?.ui?.localPolicyData?.classification,
}))

export const getSupportedPolicyRules = (supportedOsTypes, isAddMode = false) => {
  return createSelector(getPolicySettingDefinitionTask, getPolicyTask, (policyDefinition, policy) => {
    if (!isAddMode && policy?.result?.value) {
      const policyData = JSON.parse(policy?.result?.value)
      return policyData?.policyRules?.filter(i => supportedOsTypes.includes(i.osType.toString())) ?? []
    }
    return policyDefinition?.result?.policyRules?.filter(i => supportedOsTypes.includes(i.osType.toString())) ?? []
  })
}

export const getHasUnsavedPolicyChanges = addMode => {
  return createSelector(
    getPolicyTask,
    getLocalPolicyData,
    getPolicySettingDefinitionTask,
    (policy, localPolicyData, definitionPolicy) => {
      if (!addMode && policy?.result?.value) {
        const policyValues = JSON.parse(policy?.result.value)
        const policyData = { ...policy?.result, ...policyValues }
        delete policyData.value
        return !isEqual(localPolicyData, policyData)
      } else {
        return !isEqual(localPolicyData, definitionPolicy?.result)
      }
    },
  )
}
