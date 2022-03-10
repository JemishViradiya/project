import { StandaloneRiskLevelColor } from '@ues-bis/shared'
import { getEngineRiskLevel } from '@ues-bis/standalone-shared'

import * as common from '../common'
import { ColorLink } from '../theme/theme'
import { isValidRiskScore } from './util/validateRiskScore'

const CRITICAL = 'CRITICAL'
const HIGH = 'HIGH'
const MEDIUM = 'MEDIUM'
const LOW = 'LOW'
const TRAINING = 'TRAINING'
const UNKNOWN = 'UNKNOWN'
const UNTRUSTED = common.TrustLevel.UNTRUSTED
const UNDETECTED = common.TrustLevel.UNDETECTED
const UNDEFINED = common.TrustLevel.UNDEFINED
const TRUSTED = common.TrustLevel.TRUSTED
const AT_RISK = 'AT_RISK'
const SAFE = 'SAFE'

export const Label = {
  CRITICAL: `risk.level.${CRITICAL}`,
  HIGH: `risk.level.${HIGH}`,
  MEDIUM: `risk.level.${MEDIUM}`,
  LOW: `risk.level.${LOW}`,
  TRAINING: `risk.level.${TRAINING}`,
  UNKNOWN: `risk.level.${UNKNOWN}`,
  UNTRUSTED: `risk.level.${UNTRUSTED}`,
  UNDETECTED: `risk.level.${UNDETECTED}`,
  UNDEFINED: `risk.level.${UNDEFINED}`,
  TRUSTED: `risk.level.${TRUSTED}`,
  AT_RISK: `risk.level.${AT_RISK}`,
  SAFE: `risk.level.${SAFE}`,
}

export const IN_PROGRESS = 'in_progress'
export const VALID = 'valid'
export const INVALID = 'invalid'
export const EXPIRED = 'expired'
export const CANCELLED = 'cancelled'
export const NOT_APPLICABLE = 'not_applicable'

const KNOWN_LOC = 'known'
const UNKNOWN_LOC = 'unknown'

export const GeozoneRiskLevel = {
  HIGH,
  MEDIUM,
  LOW,
  UNKNOWN,
}

export const IdentityRiskLevel = {
  CRITICAL,
  ...GeozoneRiskLevel,
}

const resolveAnomalyRiskLevel = (riskScore, range) => {
  const { min, max } = range || {}
  if (isValidRiskScore(riskScore) && min && max) {
    return riskScore >= min && riskScore <= max ? Label.AT_RISK : Label.SAFE
  }
  return null
}

const resolveDetectionBasedAnomalyRiskLevel = (riskLevel, detectionRiskLevel) => {
  if (riskLevel === Label.AT_RISK) {
    return detectionRiskLevel
  }
  if (riskLevel === Label.SAFE) {
    return LOW
  }
  return UNKNOWN
}

export const RiskLevel = {
  ...IdentityRiskLevel,

  isValidRiskScore,

  // So far TRAINING is used only for behavioral risk level,
  // but it should go to GeozoneRiskLevel or IdentityRiskLevel as part of SIS-9599 and SIS-9601
  TRAINING,

  KNOWN_LOC,
  UNKNOWN_LOC,

  UNTRUSTED,
  UNDETECTED,
  UNDEFINED,
  TRUSTED,

  AT_RISK,
  SAFE,

  compare(level1, level2) {
    const RiskLevelOrder = [CRITICAL, HIGH, MEDIUM, LOW, UNKNOWN]
    if (level1 !== level2) {
      const risk1 = RiskLevelOrder.indexOf(level1)
      const risk2 = RiskLevelOrder.indexOf(level2)
      if (risk1 !== -1 && risk2 !== -1) {
        return risk1 - risk2
      } else if (risk1 !== -1) {
        return -1
      } else if (risk2 !== -1) {
        return 1
      }
    }
    return 0
  },

  color(riskLevel) {
    return StandaloneRiskLevelColor[riskLevel]
  },

  label: {
    CRITICAL: 'risk.label.critical',
    HIGH: 'risk.label.high',
    MEDIUM: 'risk.label.medium',
    LOW: 'risk.label.low',
  },

  BehaviorOptions: {
    label: 'risk.common.identityRisk',
    field: 'behavioralRiskLevel',
    levels: [
      {
        key: CRITICAL,
        activeLabel: 'risk.identity.critical',
        activeColor: StandaloneRiskLevelColor.CRITICAL,
        activeClass: 'critical',
        label: Label.CRITICAL,
      },
      {
        key: HIGH,
        activeLabel: 'risk.identity.high',
        activeColor: StandaloneRiskLevelColor.HIGH,
        activeClass: 'high',
        label: Label.HIGH,
      },
      {
        key: MEDIUM,
        activeLabel: 'risk.identity.medium',
        activeColor: StandaloneRiskLevelColor.MEDIUM,
        activeClass: 'medium',
        label: Label.MEDIUM,
      },
      {
        key: LOW,
        activeLabel: 'risk.identity.low',
        activeColor: StandaloneRiskLevelColor.LOW,
        activeClass: 'low',
        label: Label.LOW,
      },
      {
        key: UNKNOWN,
        activeLabel: 'risk.identity.unknown',
        activeColor: StandaloneRiskLevelColor.UNKNOWN,
        activeClass: 'unknown',
        label: Label.UNKNOWN,
      },
    ],
  },

  GeozoneOptions: {
    label: 'common.geozoneRisk',
    field: 'geozoneRiskLevel',
    levels: [
      {
        key: HIGH,
        activeLabel: 'risk.geozone.high',
        activeColor: StandaloneRiskLevelColor.HIGH,
        activeClass: 'high',
        label: Label.HIGH,
      },
      {
        key: MEDIUM,
        activeLabel: 'risk.geozone.medium',
        activeColor: StandaloneRiskLevelColor.MEDIUM,
        activeClass: 'medium',
        label: Label.MEDIUM,
      },
      {
        key: LOW,
        activeLabel: 'risk.geozone.low',
        activeColor: StandaloneRiskLevelColor.LOW,
        activeClass: 'low',
        label: Label.LOW,
      },
      {
        key: UNKNOWN,
        activeLabel: 'risk.geozone.unknown',
        activeColor: StandaloneRiskLevelColor.UNKNOWN,
        activeClass: 'unknown',
        label: Label.UNKNOWN,
      },
    ],
  },

  AppAnomalyOptions: {
    label: 'risk.common.appAnomaly',
    field: 'appAnomalyDetectionRiskLevel',
    levels: [
      {
        key: AT_RISK,
        activeLabel: 'risk.appAnomaly.atRisk',
        activeColor: ColorLink,
        activeClass: 'unknown',
        label: Label.AT_RISK,
      },
      {
        key: SAFE,
        activeLabel: 'risk.appAnomaly.safe',
        activeColor: ColorLink,
        activeClass: 'unknown',
        label: Label.SAFE,
      },
    ],
  },

  NetworkAnomalyOptions: {
    label: 'risk.common.networkAnomaly',
    field: 'networkAnomalyDetectionRiskLevel',
    levels: [
      {
        key: AT_RISK,
        activeLabel: 'risk.common.networkAnomalyAtRisk',
        activeColor: ColorLink,
        activeClass: 'unknown',
        label: Label.AT_RISK,
      },
      {
        key: SAFE,
        activeLabel: 'risk.common.networkAnomalySafe',
        activeColor: ColorLink,
        activeClass: 'unknown',
        label: Label.SAFE,
      },
    ],
  },

  IpAddressRiskOptions: {
    label: 'common.ipRisk',
    field: 'ipAddressRisk',
    levels: [
      {
        key: UNTRUSTED,
        activeLabel: Label.UNTRUSTED,
        activeColor: ColorLink,
        activeClass: 'unknown',
        label: Label.UNTRUSTED,
      },
      {
        key: UNDETECTED,
        activeLabel: Label.UNDETECTED,
        activeColor: ColorLink,
        activeClass: 'unknown',
        label: Label.UNDETECTED,
      },
      {
        key: UNDEFINED,
        activeLabel: Label.UNDEFINED,
        activeColor: ColorLink,
        activeClass: 'unknown',
        label: Label.UNDEFINED,
      },
      {
        key: TRUSTED,
        activeLabel: Label.TRUSTED,
        activeColor: ColorLink,
        activeClass: 'unknown',
        label: Label.TRUSTED,
      },
    ],
  },

  FixupOptions: {
    label: 'common.automaticRiskReduction',
    field: 'fixup',
    levels: [
      {
        key: IN_PROGRESS,
        activeLabel: 'risk.challengeState.type.in_progress',
        activeColor: ColorLink,
        activeClass: 'unknown',
        label: 'risk.challengeState.type.in_progress',
      },
      {
        key: VALID,
        activeLabel: 'risk.challengeState.type.valid',
        activeColor: ColorLink,
        activeClass: 'unknown',
        label: 'risk.challengeState.type.valid',
      },
      {
        key: INVALID,
        activeLabel: 'risk.challengeState.type.invalid',
        activeColor: ColorLink,
        activeClass: 'unknown',
        label: 'risk.challengeState.type.invalid',
      },
      {
        key: EXPIRED,
        activeLabel: 'risk.challengeState.type.expired',
        activeColor: ColorLink,
        activeClass: 'unknown',
        label: 'risk.challengeState.type.expired',
      },
      {
        key: CANCELLED,
        activeLabel: 'risk.challengeState.type.cancelled',
        activeColor: ColorLink,
        activeClass: 'unknown',
        label: 'risk.challengeState.type.cancelled',
      },
      {
        key: NOT_APPLICABLE,
        activeLabel: 'risk.challengeState.type.not_applicable',
        activeColor: ColorLink,
        activeClass: 'unknown',
        label: 'risk.challengeState.type.not_applicable',
      },
    ],
  },

  LocationOptions: {
    label: 'common.location',
    field: 'location',
    levels: [
      {
        key: KNOWN_LOC,
        activeLabel: 'risk.location.known',
        activeColor: ColorLink,
        activeClass: 'unknown',
        label: 'risk.location.known',
      },
      {
        key: UNKNOWN_LOC,
        activeLabel: 'risk.location.unknown',
        activeColor: ColorLink,
        activeClass: 'unknown',
        label: 'risk.location.unknown',
      },
    ],
  },

  ValidOptions: undefined,

  isValidFilterType: type => {
    return !!RiskLevel.ValidOptions[type]
  },

  isValidFilterOption: (type, value) => {
    if (!type || !value) {
      return false
    }
    const options = RiskLevel.ValidOptions[type]
    return (
      options &&
      options.levels.find(level => {
        return level.key === value
      })
    )
  },

  colorOfHighestRisk: (theme, criticalCount = 0, highCount = 0, mediumCount = 0, lowCount = 0) => {
    if (criticalCount > 0) return theme.palette.bis.risk.critical
    if (highCount > 0) return theme.palette.bis.risk.high
    if (mediumCount > 0) return theme.palette.bis.risk.medium
    if (lowCount > 0) return theme.palette.bis.risk.low
    return theme.palette.bis.risk.unknown
  },

  colorOfHighestMapPin: (theme, criticalCount = 0, highCount = 0, mediumCount = 0, lowCount = 0) => {
    if (criticalCount > 0) return theme.palette.bis.risk.critical
    if (highCount > 0) return theme.palette.bis.risk.high
    if (mediumCount > 0) return theme.palette.bis.map.pin.medium
    if (lowCount > 0) return theme.palette.bis.risk.low
    return theme.palette.bis.risk.unknown
  },

  colorOfHighestMapBound: (theme, criticalCount = 0, highCount = 0, mediumCount = 0, lowCount = 0) => {
    if (criticalCount > 0) return theme.palette.bis.risk.critical
    if (highCount > 0) return theme.palette.bis.risk.high
    if (mediumCount > 0) return theme.palette.bis.map.bounds.medium
    if (lowCount > 0) return theme.palette.bis.risk.low
    return theme.palette.bis.risk.unknown
  },

  appAnomalyRiskLevel: resolveAnomalyRiskLevel,

  appAnomalyDetectionBasedRiskLevel: resolveDetectionBasedAnomalyRiskLevel,

  networkAnomalyRiskLevel: resolveAnomalyRiskLevel,

  networkAnomalyDetectionBasedRiskLevel: resolveDetectionBasedAnomalyRiskLevel,

  behavioralEngineBasedRiskLevel: (score, level, riskEngineLevels) =>
    level === RiskLevel.TRAINING
      ? RiskLevel.TRAINING
      : (score >= 0 && getEngineRiskLevel(score, riskEngineLevels)) || RiskLevel.UNKNOWN,
}

export const filterOptions = Object.freeze({
  [RiskLevel.BehaviorOptions.field]: [RiskLevel.UNKNOWN, RiskLevel.LOW, RiskLevel.MEDIUM, RiskLevel.HIGH, RiskLevel.CRITICAL],
  [RiskLevel.GeozoneOptions.field]: [RiskLevel.UNKNOWN, RiskLevel.LOW, RiskLevel.MEDIUM, RiskLevel.HIGH],
  [RiskLevel.AppAnomalyOptions.field]: [RiskLevel.AT_RISK, RiskLevel.SAFE],
  [RiskLevel.NetworkAnomalyOptions.field]: [RiskLevel.AT_RISK, RiskLevel.SAFE],
  [RiskLevel.IpAddressRiskOptions.field]: [RiskLevel.UNTRUSTED, RiskLevel.UNDETECTED, RiskLevel.UNDEFINED, RiskLevel.TRUSTED],
  [RiskLevel.FixupOptions.field]: [IN_PROGRESS, VALID, INVALID, EXPIRED, CANCELLED, NOT_APPLICABLE],
  [RiskLevel.LocationOptions.field]: [KNOWN_LOC, UNKNOWN_LOC],
})

RiskLevel.ValidOptions = {
  [RiskLevel.BehaviorOptions.field]: RiskLevel.BehaviorOptions,
  [RiskLevel.GeozoneOptions.field]: RiskLevel.GeozoneOptions,
  [RiskLevel.AppAnomalyOptions.field]: RiskLevel.AppAnomalyOptions,
  [RiskLevel.IpAddressRiskOptions.field]: RiskLevel.IpAddressRiskOptions,
  [RiskLevel.FixupOptions.field]: RiskLevel.FixupOptions,
  [RiskLevel.LocationOptions.field]: RiskLevel.LocationOptions,
}
