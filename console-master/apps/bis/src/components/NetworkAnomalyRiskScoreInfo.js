import PropTypes from 'prop-types'
import { memo, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { Context as RiskEnginesSettingsContext } from '../providers/RiskEngineSettingsProvider'
import { Label, RiskLevel } from './RiskLevel'

const NetworkAnomalyRiskScoreInfo = memo(({ riskScore }) => {
  const { data } = useContext(RiskEnginesSettingsContext)
  const { t } = useTranslation()
  const riskLevel = RiskLevel.networkAnomalyRiskLevel(riskScore, data?.networkAnomalyDetection?.range)
  let messageKey
  if (riskLevel === Label.AT_RISK) {
    messageKey = 'risk.common.networkAnomalyRiskScoreAtRisk'
  } else if (riskLevel === Label.SAFE) {
    messageKey = 'risk.common.networkAnomalyRiskScoreSafe'
  }
  return messageKey ? t(messageKey, { score: Math.round(riskScore) }) : null
})

NetworkAnomalyRiskScoreInfo.displayName = 'NetworkAnomalyRiskScoreInfo'

NetworkAnomalyRiskScoreInfo.propTypes = {
  riskScore: PropTypes.number,
}

export default NetworkAnomalyRiskScoreInfo
