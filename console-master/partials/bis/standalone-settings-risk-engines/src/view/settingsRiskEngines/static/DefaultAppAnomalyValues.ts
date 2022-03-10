import { RiskLevelTypes as RiskLevel } from '@ues-data/bis/model'

const defaultAppAnomalyValues = Object.freeze({
  riskLevel: RiskLevel.HIGH,
  range: {
    min: 80,
    max: 100,
  },
})

export default defaultAppAnomalyValues
