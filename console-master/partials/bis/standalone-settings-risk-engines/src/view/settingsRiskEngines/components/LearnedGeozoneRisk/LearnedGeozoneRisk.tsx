import PropTypes from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Typography } from '@material-ui/core'

import SwitchControlCollapseSection from '../SwitchControlCollapseSection'
import { GEOZONE_DISTANCE_SETTINGS, SWITCH_FIELD_NAME } from './consts'
import LearnedGeozoneRiskDistance from './LearnedGeozoneRiskDistance'

interface LearnedGeozoneRiskProps {
  canEdit: boolean
}

const LearnedGeozoneRisk: React.FC<LearnedGeozoneRiskProps> = ({ canEdit }) => {
  const { t } = useTranslation()

  return (
    <SwitchControlCollapseSection label={t('settings.riskEngines.learnedGeozone')} name={SWITCH_FIELD_NAME} disabled={!canEdit}>
      <Typography variant="body1">{t('settings.riskEngines.learnedGeozoneText')}</Typography>
      <LearnedGeozoneRiskDistance settings={GEOZONE_DISTANCE_SETTINGS(t)} disabled={!canEdit} />
    </SwitchControlCollapseSection>
  )
}

LearnedGeozoneRisk.displayName = 'LearnedGeozoneRisk'

LearnedGeozoneRisk.propTypes = {
  canEdit: PropTypes.bool,
}

export default LearnedGeozoneRisk
