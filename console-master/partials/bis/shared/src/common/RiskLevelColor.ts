import { RiskLevelTypes } from '@ues-data/bis/model'
import { RiskLevel } from '@ues-data/shared-types'
import type { UesTheme } from '@ues/assets'

import { useStandalone as isStandalone } from '../hooks'

const standalone = isStandalone()

export enum StandaloneRiskLevelColor {
  HIGH = 'var(--mui-palette-bis-risk-high)',
  CRITICAL = 'var(--mui-palette-bis-risk-critical)',
  LOW = 'var(--mui-palette-bis-risk-low)',
  UNKNOWN = 'var(--mui-palette-bis-risk-unknown)',
  MEDIUM = 'var(--mui-palette-bis-risk-medium)',
}

export const getColorByRiskLevel = (riskLevel: RiskLevel, theme?) => {
  const {
    palette: { chipAlert },
  } = theme as UesTheme
  switch (riskLevel) {
    case RiskLevel.High:
      return chipAlert.high
    case RiskLevel.Medium:
      return chipAlert.medium
    case RiskLevel.Low:
      return chipAlert.low
    case RiskLevel.Secured:
      return chipAlert.secure
    default:
      return chipAlert.info
  }
}

export const getRiskLevelColor = (riskLevel: RiskLevelTypes, theme?) => {
  if (standalone) {
    return StandaloneRiskLevelColor[riskLevel]
  }
  const {
    palette: { chipAlert },
  } = theme as UesTheme
  switch (riskLevel) {
    case RiskLevelTypes.CRITICAL:
      return chipAlert.critical
    case RiskLevelTypes.HIGH:
      return chipAlert.high
    case RiskLevelTypes.MEDIUM:
      return chipAlert.medium
    case RiskLevelTypes.LOW:
      return chipAlert.low
    case RiskLevelTypes.UNKNOWN:
    default:
      return chipAlert.info
  }
}
