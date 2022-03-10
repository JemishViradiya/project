import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles, MenuItem, Switch, Typography } from '@material-ui/core'

import { Select } from '@ues-bis/shared'
import { FeatureName, useFeatures } from '@ues-data/shared'
import { BrandPersona } from '@ues/assets'

import { APPLICABLE_RISK_LEVELS, DEFAULT_RISK_LEVEL } from '../../../config/automatic-risk-reduction'
import type { AutomaticRiskReductionValue } from '../../../model'

export interface DetectionsFieldProps {
  onChange: (value: AutomaticRiskReductionValue) => void
  readOnly: boolean
  value: AutomaticRiskReductionValue
}

const CONTROL_ID = 'automatic-risk-reduction-switch'

const useStyles = makeStyles(theme => ({
  switchContainer: {
    display: 'flex',
    cursor: 'pointer',
    width: 'fit-content',
  },
  textContainer: {
    paddingLeft: theme.spacing(1),
    paddingTop: theme.spacing(2),
  },
  title: {
    paddingBottom: theme.spacing(2),
    display: 'block',
  },
  description: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.grey[600],
  },
  icon: {
    marginLeft: -theme.spacing(1),
    height: theme.spacing(5),
  },
  selectContainer: {
    paddingTop: theme.spacing(6),
    paddingLeft: theme.spacing(15),
  },
}))

export const AutomaticRiskReductionField: React.FC<DetectionsFieldProps> = ({ value, onChange, readOnly }) => {
  const { t } = useTranslation(['bis/ues', 'bis/shared'])
  const styles = useStyles()

  const handleSwitchChange = useCallback(
    event => {
      const enabled = event.target.checked

      onChange(enabled ? { enabled, minimumRiskLevel: value.minimumRiskLevel ?? DEFAULT_RISK_LEVEL } : { enabled })
    },
    [value, onChange],
  )
  const handleSelectChange = useCallback(
    event => {
      const { enabled } = value

      onChange(enabled ? { ...value, minimumRiskLevel: event.target.value } : { enabled })
    },
    [value, onChange],
  )

  return (
    <div>
      <label htmlFor={CONTROL_ID} className={styles.switchContainer}>
        <Switch disabled={readOnly} id={CONTROL_ID} onChange={handleSwitchChange} checked={value.enabled} />

        <div className={styles.textContainer}>
          <Typography variant="h3" component="span" className={styles.title}>
            {t('bis/ues:detectionPolicies.arr.title')}
          </Typography>
          <Typography variant="body2" component="span" className={styles.description}>
            <BrandPersona className={styles.icon} />
            {t('bis/ues:detectionPolicies.arr.description')}
          </Typography>
        </div>
      </label>
      <div className={styles.selectContainer} hidden={!value.enabled}>
        <Select
          label={t('bis/ues:detectionPolicies.arr.selectLabel')}
          disabled={readOnly}
          value={value.minimumRiskLevel ?? ''}
          onChange={handleSelectChange}
          size="small"
        >
          {APPLICABLE_RISK_LEVELS.map(riskLevel => (
            <MenuItem value={riskLevel}>{t(`bis/shared:risk.level.${riskLevel}`)}</MenuItem>
          ))}
        </Select>
      </div>
    </div>
  )
}
