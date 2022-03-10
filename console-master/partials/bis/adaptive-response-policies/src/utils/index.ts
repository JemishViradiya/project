import { removeNull } from '@ues-bis/shared'
import { ActionDefinition, ActionType, RiskLevelTypes } from '@ues-data/bis/model'

import { DEFAULT_POLICY_FORM_VALUES, EDITABLE_POLICY_FORM_FIELDS } from '../config'
import type { PolicyData, PolicyFormValues } from '../model'

export const getIdByAction = (level, action) => {
  let id
  if (action.actionType === ActionType.OverrideNetworkAccessControlPolicy) {
    id = action.actionAttributes.entityId
  }
  return `${level}-${action.actionType}-${id}`
}

export const identityActionsAccessor = level => policyData => {
  if (!policyData.identityPolicy.riskLevelActions) {
    policyData.identityPolicy.riskLevelActions = []
  }
  const setting = policyData.identityPolicy.riskLevelActions.find(setting => setting.level === level)
  if (!setting) {
    const newSetting = { level, actions: [] }
    policyData.identityPolicy.riskLevelActions = [...policyData.identityPolicy.riskLevelActions, newSetting]
    return newSetting.actions
  }
  if (!setting.actions) {
    setting.actions = []
  }
  return setting.actions
}

export const isPolicyAssigned = policy => policy.appliedGroups > 0 || policy.appliedUsers > 0

// Workaround for SIS-12577/SIS-12623. It should be removed once Actor implemented new algorithm for populating recovery actions.
export const injectEmptyLowRiskBlock = policyData => {
  const actions = policyData?.identityPolicy?.riskLevelActions
  if (actions?.length && !actions?.find(item => item.level === RiskLevelTypes.LOW)) {
    return {
      ...policyData,
      identityPolicy: {
        ...policyData.identityPolicy,
        riskLevelActions: [
          ...actions,
          {
            level: RiskLevelTypes.LOW,
            actions: [],
          },
        ],
      },
    }
  }
  return policyData
}

export const canAddAction = (levelActions, action) => {
  // Ensure no duplicate actions on the same level
  if (action.actionType && levelActions.some(levelAction => levelAction.actionType === action.actionType)) {
    return false
  }
  // Possibly other situations in the future
  return true
}

export const isActionAvailable = (availableActions, actionType: ActionType) => {
  const actionDefinition = ActionDefinition[actionType]
  if (actionDefinition) {
    return availableActions.some(
      action => action.actionType === actionDefinition.actionType && action.pillarTypeId === actionDefinition.pillarTypeId,
    )
  }
  return false
}

const removeEmptyIdentityRiskLevelActionsBlocks = (policyData: PolicyData): PolicyData => ({
  ...policyData,
  identityPolicy: {
    ...policyData.identityPolicy,
    riskLevelActions: policyData.identityPolicy.riskLevelActions.filter(entry => entry.actions.length > 0),
  },
})

export const deleteAction = (policyData: PolicyData, actionsAccessor, index) => {
  const clone: PolicyData = JSON.parse(JSON.stringify(policyData))
  const actions = actionsAccessor(clone)
  actions.splice(index, 1)

  return clone
}

export const policyFormValuesToMutationInput = (formValues: PolicyFormValues) =>
  removeNull({
    ...formValues,
    policyData: injectEmptyLowRiskBlock(formValues.policyData),
  })

export const fetchedPolicyToPolicyFormValues = (policy?: PolicyFormValues) => {
  const formFields = EDITABLE_POLICY_FORM_FIELDS.reduce<PolicyFormValues>(
    (acc, field) => ({
      ...acc,
      [field]: policy?.[field] ?? acc[field],
    }),
    DEFAULT_POLICY_FORM_VALUES,
  )

  return JSON.parse(
    JSON.stringify(
      {
        ...formFields,
        policyData: removeEmptyIdentityRiskLevelActionsBlocks(formFields.policyData),
      },
      (_, value) => (value === null ? undefined : value),
    ),
  )
}
