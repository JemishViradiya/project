import PropTypes from 'prop-types'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { Typography } from '@material-ui/core'

import { TenantLink } from '@ues-bis/standalone-shared'

import { useLinkStyles } from '../styles/common'
import SwitchControlCollapseSection from './SwitchControlCollapseSection'

const SWITCH_FIELD_NAME = 'definedGeozones.enabled'

interface DefinedGeozoneRiskProps {
  canEdit: boolean
}

const DefinedGeozoneRisk: React.FC<DefinedGeozoneRiskProps> = memo(({ canEdit }) => {
  const { t } = useTranslation()

  const linkStyles = useLinkStyles()

  return (
    <SwitchControlCollapseSection label={t('settings.riskEngines.definedGeozone')} name={SWITCH_FIELD_NAME} disabled={!canEdit}>
      <Typography variant="body1">{t('settings.riskEngines.definedGeozoneText')}</Typography>
      {canEdit && (
        <TenantLink to="/settings/geozones" className={linkStyles.link}>
          {t('settings.riskEngines.definedGeozoneLink')}
        </TenantLink>
      )}
    </SwitchControlCollapseSection>
  )
})

DefinedGeozoneRisk.displayName = 'DefinedGeozoneRisk'

DefinedGeozoneRisk.propTypes = {
  canEdit: PropTypes.bool,
}

export default DefinedGeozoneRisk
