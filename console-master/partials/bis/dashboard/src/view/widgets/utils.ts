import type { RiskLevelTypes, RiskTypes } from '@ues-data/bis/model'
import { ActionType, RiskLevelTypes as RiskLevels } from '@ues-data/bis/model'

const unsupportedRiskTypes = new Set<RiskTypes>(['geozoneRiskLevel'])
export const isSupportedRiskType = (riskType: RiskTypes) => unsupportedRiskTypes.has(riskType) === false

const unsupportedRiskLevels = new Set<Lowercase<RiskLevelTypes>>(['low', 'unknown'])
export const isSupportedRiskLevel = (riskLevel: Lowercase<RiskLevelTypes>) => unsupportedRiskLevels.has(riskLevel) === false

export const convertRangeBoundaryToSeconds = (boundary: string) => Math.floor(parseInt(boundary) / 1000).toString()

export const isKnownAction = action => action.type === ActionType.OverrideNetworkAccessControlPolicy
export const isAlertRiskLevel = level => level === RiskLevels.HIGH
