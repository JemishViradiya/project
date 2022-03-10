import { RiskLevelTypes } from '@ues-data/bis/model'

export const RiskLevelOptions = [
  {
    key: RiskLevelTypes.CRITICAL,
    text: 'risk.label.critical',
  },
  {
    key: RiskLevelTypes.HIGH,
    text: 'risk.label.high',
  },
]

export const DefaultValues = Object.freeze({
  riskLevel: RiskLevelTypes.HIGH,
  range: {
    min: 80,
    max: 100,
  },
})
