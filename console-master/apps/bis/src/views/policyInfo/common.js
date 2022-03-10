import { RiskFactorId } from '@ues-data/bis/model'

import { ActionType, RiskLevel } from '../../shared'

export const backToPolicyList = (navigate, location) => {
  const locationState = location.state

  if (locationState && locationState.goBack) {
    const wh = window.history
    // NOTE: Safari sometimes adds an extra location history entry.
    // We add the check below to go back the expected location.
    if (!wh.state && wh.length >= 2) {
      navigate(-2)
    } else {
      navigate(-1)
    }
  } else {
    const pathname = location.pathname.replace(/\/policies\/.*$/, '/policies')
    navigate(pathname)
  }
}

export const isPolicyAssigned = policy => policy.appliedGroups > 0 || policy.appliedUsers > 0

const ReAuthenticateToConfirmAction = {
  actionType: ActionType.ReAuthenticateToConfirm.actionType,
  actionAttributes: {},
}

const injectReAuthAction = (levelActions, level) => {
  const settingIndex = levelActions.findIndex(s => s.level === level)
  const setting = settingIndex > -1 ? levelActions[settingIndex] : null
  if (!setting) {
    return [...levelActions, { level, actions: [ReAuthenticateToConfirmAction] }]
  } else {
    return [
      ...levelActions.slice(0, settingIndex),
      {
        ...setting,
        actions: setting.actions ? [...setting.actions, ReAuthenticateToConfirmAction] : [ReAuthenticateToConfirmAction],
      },
      ...levelActions.slice(settingIndex + 1),
    ]
  }
}

// Process policy data to add/remove REACH actions.
export const processReAuthAction = policyData => {
  const identityPolicy = policyData && policyData.identityPolicy
  if (identityPolicy) {
    const originalLevelActions = identityPolicy.riskLevelActions || []
    let levelActions = []
    originalLevelActions.forEach(setting => {
      levelActions.push({
        ...setting,
        actions: (setting.actions || []).filter(action => action.actionType !== ActionType.ReAuthenticateToConfirm.actionType),
      })
    })

    const fixUp = identityPolicy.fixUp
    if (fixUp && fixUp.enabled) {
      switch (fixUp.minimumBehavioralRiskLevel) {
        case RiskLevel.MEDIUM:
          levelActions = injectReAuthAction(levelActions, RiskLevel.MEDIUM)
        // Fall-through
        // eslint-disable-next-line no-fallthrough
        case RiskLevel.HIGH:
          levelActions = injectReAuthAction(levelActions, RiskLevel.HIGH)
        // Fall-through
        // eslint-disable-next-line no-fallthrough
        case RiskLevel.CRITICAL:
          levelActions = injectReAuthAction(levelActions, RiskLevel.CRITICAL)
          break
        default:
          break
      }
    }
    return {
      ...policyData,
      identityPolicy: {
        ...policyData.identityPolicy,
        riskLevelActions: levelActions,
      },
    }
  }
  return policyData
}

export const processDisabledRiskFactors = policyData => {
  const { riskFactors, ipAddressPolicy } = policyData?.identityPolicy || {}
  if (!(riskFactors ?? []).includes(RiskFactorId.IpAddress) && ipAddressPolicy) {
    // IP address risk doesn't have "enabled/disabled" property so we need to remove it on save/update
    const { ipAddressPolicy, ...rest } = policyData.identityPolicy
    return {
      ...policyData,
      identityPolicy: {
        ...rest,
      },
    }
  }
  return policyData
}
