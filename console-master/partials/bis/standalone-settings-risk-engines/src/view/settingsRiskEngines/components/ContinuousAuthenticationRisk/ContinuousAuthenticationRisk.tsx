import PropTypes from 'prop-types'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { Typography } from '@material-ui/core'

import { NetworkAnomalyOptions } from '@ues-bis/adaptive-response-settings'
import { useClientParams } from '@ues-bis/standalone-shared'

import AppAnomalyDetectionPath from '../../static/AppAnomalyDetectionPath'
import SwitchControlCollapseSection from '../SwitchControlCollapseSection'
import RiskTableContainer from './../RiskTableContainer/'

interface ContinuousAuthenticationRiskProps {
  canEdit: boolean
}

const ContinuousAuthenticationRisk: React.FC<ContinuousAuthenticationRiskProps> = memo(({ canEdit }) => {
  const { features: { AppAnomalyDetection = false } = {} } = useClientParams()
  const { ENABLED, RANGE, RISK_LEVEL } = AppAnomalyDetectionPath
  const { t } = useTranslation()

  return (
    <SwitchControlCollapseSection
      label={t(AppAnomalyDetection ? 'risk.common.continuousAuthAppAnomaly' : 'settings.riskEngines.continuousAuthRisk')}
      name={ENABLED}
      disabled={!canEdit}
    >
      <Typography variant="body1">
        {t(
          AppAnomalyDetection
            ? 'settings.riskEngines.continuousAuthRiskWithAnomalyText'
            : 'settings.riskEngines.continuousAuthRiskText',
        )}
      </Typography>
      {AppAnomalyDetection ? (
        <RiskTableContainer
          canEdit={canEdit}
          selectOptions={NetworkAnomalyOptions.RiskLevelOptions}
          rangePath={RANGE}
          riskLevelPath={RISK_LEVEL}
          riskFactorText={t('settings.riskEngines.continuousAuthRiskFactorText')}
        />
      ) : null}
    </SwitchControlCollapseSection>
  )
})

ContinuousAuthenticationRisk.displayName = 'ContinuousAuthenticationRisk'

ContinuousAuthenticationRisk.propTypes = {
  canEdit: PropTypes.bool,
}

export default ContinuousAuthenticationRisk
