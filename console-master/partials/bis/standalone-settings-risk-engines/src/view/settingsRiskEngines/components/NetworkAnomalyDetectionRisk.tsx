import PropTypes from 'prop-types'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { Typography } from '@material-ui/core'

import { NetworkAnomalyOptions } from '@ues-bis/adaptive-response-settings'

import NetworkAnomalyDetectionPath from '../static/NetworkAnomalyDetectionPath'
import RiskTableContainer from './RiskTableContainer/'
import SwitchControlCollapseSection from './SwitchControlCollapseSection'

interface NetworkAnomalyDetectionRiskProps {
  canEdit: boolean
}

const NetworkAnomalyDetectionRisk: React.FC<NetworkAnomalyDetectionRiskProps> = memo(({ canEdit }) => {
  const { ENABLED, RANGE, RISK_LEVEL } = NetworkAnomalyDetectionPath
  const { t } = useTranslation()

  return (
    <SwitchControlCollapseSection label={t('risk.common.continuousAuthNetworkAnomaly')} name={ENABLED} disabled={!canEdit}>
      <Typography variant="body1">{t('settings.riskEngines.networkAnomalyText')}</Typography>
      <RiskTableContainer
        canEdit={canEdit}
        selectOptions={NetworkAnomalyOptions.RiskLevelOptions}
        rangePath={RANGE}
        riskLevelPath={RISK_LEVEL}
        riskFactorText={t('settings.riskEngines.networkAnomalyRiskFactorText')}
      />
    </SwitchControlCollapseSection>
  )
})

NetworkAnomalyDetectionRisk.displayName = 'NetworkAnomalyDetectionRisk'

NetworkAnomalyDetectionRisk.propTypes = {
  canEdit: PropTypes.bool,
}

export default NetworkAnomalyDetectionRisk
