import React, { memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FormControl, FormControlLabel, FormGroup, FormHelperText, Switch, Typography, useTheme } from '@material-ui/core'

import { RiskReduction } from '@ues-data/bis/model'
import { useSwitchHelperTextStyles, useSwitchLabelStyles } from '@ues/assets'

import { useStyles } from './styles'

const RiskReductionSwitch = memo(({ checked, onChange, readOnly = false }) => {
  const { t } = useTranslation('bis/ues')
  const theme = useTheme()
  const styles = useStyles()
  const labelClasses = useSwitchLabelStyles(theme)
  const helperTextClasses = useSwitchHelperTextStyles(theme)
  const [turnOn, setTurnOn] = useState(checked)

  useEffect(() => {
    setTurnOn(checked)
  }, [checked])

  const handleSwitchChange = () => {
    setTurnOn(!turnOn)
    onChange(!turnOn ? RiskReduction.HIGH : RiskReduction.NONE)
  }

  return (
    <FormControl component="fieldset" className={styles.automaticRiskReduction}>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch checked={turnOn} onChange={handleSwitchChange} name="automaticRiskReductionSwitch" disabled={readOnly} />
          }
          label={<Typography variant="body2">{t('risk.common.automaticRiskReduction')}</Typography>}
          classes={labelClasses}
        />
      </FormGroup>
      <FormHelperText classes={helperTextClasses}>{t('risk.common.automaticRiskReductionDescription')}</FormHelperText>
    </FormControl>
  )
})

export default RiskReductionSwitch
