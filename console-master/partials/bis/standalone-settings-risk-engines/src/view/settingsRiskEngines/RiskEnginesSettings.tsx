import PropTypes from 'prop-types'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Card, Typography } from '@material-ui/core'

import { useClientParams } from '@ues-bis/standalone-shared'

import BehavioralPatternRisk from './components/BehavioralPatternRisk'
import ContinuousAuthenticationRisk from './components/ContinuousAuthenticationRisk/'
import DefinedGeozoneRisk from './components/DefinedGeozoneRisk'
import IpAddressRisk from './components/IpAddressRisk/'
import LearnedGeozoneRisk from './components/LearnedGeozoneRisk'
import NetworkAnomalyDetectionRisk from './components/NetworkAnomalyDetectionRisk'

interface RiskEnginesSettingsProps {
  editable: boolean
}

const RiskEnginesSettings: React.FC<RiskEnginesSettingsProps> = memo(({ editable }) => {
  const { t } = useTranslation()
  const { features: { IpAddressRisk: IpAddressRiskFeature = false, NetworkAnomalyDetection = false } = {} } = useClientParams()
  return (
    <Card>
      <Typography variant="body1" paragraph align="justify">
        {t('settings.riskEngines.sectionTitle')}
      </Typography>
      <Box mb={2}>
        <Typography variant="h3">{t('risk.common.identityRisk')}</Typography>
        <BehavioralPatternRisk canEdit={editable} />
        {IpAddressRiskFeature && <IpAddressRisk canEdit={editable} />}
        <ContinuousAuthenticationRisk canEdit={editable} />
        {NetworkAnomalyDetection && <NetworkAnomalyDetectionRisk canEdit={editable} />}
      </Box>
      <Box mb={2}>
        <Typography variant="h3">{t('common.geozoneRisk')}</Typography>
        <DefinedGeozoneRisk canEdit={editable} />
        <LearnedGeozoneRisk canEdit={editable} />
      </Box>
    </Card>
  )
})

RiskEnginesSettings.displayName = 'RiskEnginesSettings'

RiskEnginesSettings.propTypes = {
  editable: PropTypes.bool,
}

export default RiskEnginesSettings
