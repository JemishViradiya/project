import PropTypes from 'prop-types'
import { memo, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { Context as RiskEnginesSettingsProviderContext } from '../providers/RiskEngineSettingsProvider'
import { RiskLevel } from './RiskLevel'

const NetworkAnomalyRiskLevel = memo(({ riskScore }) => {
  const { data } = useContext(RiskEnginesSettingsProviderContext)
  const { t } = useTranslation()
  const riskLevel = RiskLevel.networkAnomalyRiskLevel(riskScore, data?.networkAnomalyDetection?.range)
  return riskLevel ? t(riskLevel) : null
})

NetworkAnomalyRiskLevel.displayName = 'NetworkAnomalyRiskLevel'

NetworkAnomalyRiskLevel.propTypes = {
  riskScore: PropTypes.number,
}

export default NetworkAnomalyRiskLevel
