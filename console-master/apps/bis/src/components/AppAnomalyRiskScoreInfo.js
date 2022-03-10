import PropTypes from 'prop-types'
import { memo, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { Context as RiskEnginesSettingsContext } from '../providers/RiskEngineSettingsProvider'
import { Label, RiskLevel } from './RiskLevel'

const AppAnomalyRiskScoreInfo = memo(({ riskScore }) => {
  const { data } = useContext(RiskEnginesSettingsContext)
  const { t } = useTranslation()
  const riskLevel = RiskLevel.appAnomalyRiskLevel(riskScore, data?.appAnomalyDetection?.range)
  let messageKey
  if (riskLevel === Label.AT_RISK) {
    messageKey = 'risk.common.appAnomalyRiskScoreAtRisk'
  } else if (riskLevel === Label.SAFE) {
    messageKey = 'risk.common.appAnomalyRiskScoreSafe'
  }
  return messageKey ? t(messageKey, { score: Math.round(riskScore) }) : null
})

AppAnomalyRiskScoreInfo.displayName = 'AppAnomalyRiskScoreInfo'

AppAnomalyRiskScoreInfo.propTypes = {
  riskScore: PropTypes.number,
}

export default AppAnomalyRiskScoreInfo
