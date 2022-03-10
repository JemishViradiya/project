/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React from 'react'

import { Checkbox, FormControlLabel, FormGroup, FormHelperText, Switch, Typography, useTheme } from '@material-ui/core'

import { FeaturizationApi } from '@ues-data/shared'
import { FeatureName } from '@ues-data/shared-types'
import { useSwitchFormGroupStyles, useSwitchHelperTextStyles, useSwitchLabelStyles } from '@ues/assets'

import { createMarkup, getI18LabelName, getI18Name, useTranslation } from './i18n'
import { NOTIFY_SUFFIX } from './settings'
import useStyles from './styles'

type PolicySwitchProps = {
  name: string
  handleChange: () => void
  checked?: boolean
  disabled?: boolean
  additionalLabel?: boolean
  additionalFormattedLabel?: boolean
  includeNotification?: boolean
  includeEmailNotification?: boolean
  includeDeviceNotification?: boolean
  values?: any
}

const PolicySwitch: React.FC<PolicySwitchProps> = ({
  name,
  handleChange,
  checked,
  disabled,
  additionalLabel,
  additionalFormattedLabel,
  includeNotification = false,
  includeEmailNotification = true,
  includeDeviceNotification = true,
  values = undefined,
}) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const labelClasses = useSwitchLabelStyles(theme)
  const helperTextClasses = useSwitchHelperTextStyles(theme)
  const formGroupClasses = useSwitchFormGroupStyles(theme)
  const classes = useStyles()

  const addFormLabel = () => {
    if (additionalLabel) {
      return <FormHelperText classes={helperTextClasses}>{t(getI18LabelName(name))}</FormHelperText>
    } else if (additionalFormattedLabel) {
      return (
        <FormHelperText classes={helperTextClasses}>
          <div dangerouslySetInnerHTML={createMarkup(t(getI18LabelName(name)))} />
        </FormHelperText>
      )
    }
  }

  return (
    <div>
      {checked && includeNotification && FeaturizationApi.isFeatureEnabled(FeatureName.MobileThreatDetectionReportingOnlyMode) && (
        <div>
          {includeEmailNotification && (
            <Checkbox
              onChange={handleChange}
              name={`${name}${NOTIFY_SUFFIX.EmailNotify}`}
              disabled={!checked}
              checked={values[`${name}${NOTIFY_SUFFIX.EmailNotify}`]}
              className={classes.titleItemRight}
              title={t(getI18Name(`${name}${NOTIFY_SUFFIX.EmailNotify}`))}
            />
          )}
          {includeDeviceNotification && (
            <Checkbox
              onChange={handleChange}
              name={`${name}${NOTIFY_SUFFIX.DeviceNotify}`}
              disabled={!checked}
              checked={values[`${name}${NOTIFY_SUFFIX.DeviceNotify}`]}
              className={classes.titleItemRight}
              title={t(getI18Name(`${name}${NOTIFY_SUFFIX.DeviceNotify}`))}
            />
          )}
        </div>
      )}
      <FormGroup classes={formGroupClasses}>
        <FormControlLabel
          key={`${name}-key`}
          control={<Switch name={name} onChange={handleChange} checked={checked} disabled={disabled} />}
          label={<Typography variant="body2">{t(getI18Name(name))}</Typography>}
          classes={labelClasses}
        />
      </FormGroup>
      {addFormLabel()}
    </div>
  )
}

export default PolicySwitch
