import PropTypes from 'prop-types'
import { memo, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { Context as RiskEnginesSettingsProviderContext } from '../providers/RiskEngineSettingsProvider'
import { RiskLevel } from './RiskLevel'

const AppAnomalyRiskLevel = memo(({ riskScore }) => {
  const { data } = useContext(RiskEnginesSettingsProviderContext)
  const { t } = useTranslation()
  const riskLevel = RiskLevel.appAnomalyRiskLevel(riskScore, data?.appAnomalyDetection?.range)
  return riskLevel ? t(riskLevel) : null
})

AppAnomalyRiskLevel.displayName = 'AppAnomalyRiskLevel'

AppAnomalyRiskLevel.propTypes = {
  riskScore: PropTypes.number,
}

export default AppAnomalyRiskLevel
