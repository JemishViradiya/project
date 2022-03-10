import { RiskLevel } from '@ues-data/shared-types'

export const APPLICABLE_RISK_LEVELS = [RiskLevel.Low, RiskLevel.Medium, RiskLevel.High] as const
export const DEFAULT_RISK_LEVEL = RiskLevel.Low
