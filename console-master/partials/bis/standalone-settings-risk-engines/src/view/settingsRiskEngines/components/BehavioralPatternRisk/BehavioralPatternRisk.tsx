import memoizeOne from 'memoize-one'
import PropTypes from 'prop-types'
import React, { memo, useCallback } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Typography } from '@material-ui/core'

import { RiskLevelLabel, RiskLevelTypes as RiskLevel, StandaloneRiskLevelColor } from '@ues-data/bis/model'

import SwitchControlCollapseSection from '../SwitchControlCollapseSection'
import BehaviorRiskSlider from './BehaviorRiskSlider'

const SWITCH_FIELD_NAME = 'behavioral.enabled'
const RISK_LEVELS_FIELD_NAME = 'behavioral.riskLevels'

const SLIDER_SETTINGS = memoizeOne(t => [
  {
    key: RiskLevel.LOW,
    text: t(RiskLevelLabel.LOW),
    color: StandaloneRiskLevelColor[RiskLevel.LOW],
  },
  {
    key: RiskLevel.MEDIUM,
    text: t(RiskLevelLabel.MEDIUM),
    color: StandaloneRiskLevelColor[RiskLevel.MEDIUM],
  },
  {
    key: RiskLevel.HIGH,
    text: t(RiskLevelLabel.HIGH),
    color: StandaloneRiskLevelColor[RiskLevel.HIGH],
  },
  {
    key: RiskLevel.CRITICAL,
    text: t(RiskLevelLabel.CRITICAL),
    color: StandaloneRiskLevelColor[RiskLevel.CRITICAL],
  },
])

interface BehavioralPatterRiskProps {
  canEdit: boolean
}

const BehavioralPatternRisk: React.FC<BehavioralPatterRiskProps> = memo(({ canEdit }) => {
  const { t } = useTranslation()
  const { control } = useFormContext()

  const renderBehaviorRiskSlider = useCallback(
    ({ value, onChange }) => (
      <BehaviorRiskSlider
        disabled={!canEdit}
        name={RISK_LEVELS_FIELD_NAME}
        onChange={onChange}
        settings={SLIDER_SETTINGS(t)}
        value={value}
      />
    ),
    [canEdit, t],
  )

  return (
    <SwitchControlCollapseSection label={t('risk.common.behavioralPatternRisk')} name={SWITCH_FIELD_NAME} disabled={!canEdit}>
      <>
        <Typography variant="body1" align="justify">
          {t('settings.riskEngines.behavioralPatternText')}
        </Typography>

        <Controller render={renderBehaviorRiskSlider} name={RISK_LEVELS_FIELD_NAME} control={control} />
      </>
    </SwitchControlCollapseSection>
  )
})

export default BehavioralPatternRisk
