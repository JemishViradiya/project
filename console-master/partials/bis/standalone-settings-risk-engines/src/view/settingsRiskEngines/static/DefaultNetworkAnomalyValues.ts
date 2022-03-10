import { RiskLevelTypes as RiskLevel } from '@ues-data/bis/model'

const defaultNetworkAnomalyValues = Object.freeze({
  riskLevel: RiskLevel.HIGH,
  range: {
    min: 80,
    max: 100,
  },
})

export default defaultNetworkAnomalyValues
