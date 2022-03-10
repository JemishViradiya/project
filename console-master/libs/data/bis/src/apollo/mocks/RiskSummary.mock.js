import { RiskLevelTypes } from '../../model/RiskLevelTypes'

export const RiskSummaryQueryMock = {
  riskSummary: [
    { bucket: 'Critical identity risk', count: 14, key: 'behavioralRiskLevel', value: RiskLevelTypes.CRITICAL },
    { bucket: 'High identity risk', count: 10, key: 'behavioralRiskLevel', value: RiskLevelTypes.HIGH },
    { bucket: 'High geozone risk', count: 20, key: 'geozoneRiskLevel', value: RiskLevelTypes.HIGH },
    { bucket: 'Medium geozone risk', count: 12, key: 'geozoneRiskLevel', value: RiskLevelTypes.MEDIUM },
  ],
}
