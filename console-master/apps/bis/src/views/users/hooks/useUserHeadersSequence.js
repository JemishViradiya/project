import { useClientParams } from '../../../shared'
import useEventHeaders from '../../events/hooks/useEventHeaders'

const user = t => ({
  section: 'common.user',
  columnName: 'common.user',
  dataKey: 'info',
  disableSort: true,
  dataFormatter: data => data.displayName,
  width: 120,
  visible: true,
  defaultVisible: true,
})

const appliedPolicy = t => ({
  section: 'user.appliedPolicies',
  columnName: 'usersEvents.assignedPolicy',
  dataKey: 'appliedPolicy',
  disableSort: true,
  cellDataGetter: data => (data.sisActions ? data.sisActions.policyName : null),
  width: 180,
  visible: false,
  defaultVisible: false,
})

const useEventHeadersSequence = () => {
  const {
    features: { RiskScoreResponseFormat, IpAddressRisk, NetworkAnomalyDetection },
  } = useClientParams()
  const {
    appAnomalyDetection,
    networkAnomalyDetection,
    behavioralRiskLevel,
    riskScore,
    geozoneRiskLevel,
    fixup,
    ipAddress,
    ipRisk,
    deviceModel,
    location,
    actions,
    datetime,
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
    user,
    deviceModel,
    location,
    actions,
    appliedPolicy,
    datetime,
  ]
}

export default useEventHeadersSequence
