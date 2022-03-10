import { useClientParams } from '../../../shared'
import useEventHeaders from './useEventHeaders'

const useEventHeadersSequence = () => {
  const {
    features: { RiskScoreResponseFormat, IpAddressRisk, NetworkAnomalyDetection },
  } = useClientParams()
  const {
    appAnomalyDetection,
    behavioralRiskLevel,
    riskScore,
    geozoneRiskLevel,
    fixup,
    ipAddress,
    ipRisk,
    userInfo,
    deviceModel,
    appOrService,
    location,
    actions,
    datetime,
    networkAnomalyDetection,
  } = useEventHeaders()

  return [
    behavioralRiskLevel,
    riskScore,
    geozoneRiskLevel,
    ...(RiskScoreResponseFormat ? [appAnomalyDetection] : []),
    ...(RiskScoreResponseFormat && NetworkAnomalyDetection ? [networkAnomalyDetection] : []),
    fixup,
    ipAddress,
    ...(IpAddressRisk ? [ipRisk] : []),
    userInfo,
    deviceModel,
    appOrService,
    location,
    actions,
    datetime,
  ]
}

export default useEventHeadersSequence
