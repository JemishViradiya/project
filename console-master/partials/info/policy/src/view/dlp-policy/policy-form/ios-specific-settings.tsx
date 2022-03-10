import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { Divider, MenuItem, TextField } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'

import { PolicyData } from '@ues-data/dlp'
import { Select } from '@ues/behaviours'

import { usePoliciesPermissions } from '../usePoliciesPermission'
import { policyStyles } from './styles'

const supportedMobileOsType = 'OPERATING_SYSTEM_TYPE_IOS'
const supportedMobileActivityType = 'ACTIVITY_TYPE_SCREEN_CAPTURE'

const MAX_SCREENSHOTS_INTERVAL_VALUE = 14
const numberOfScreenshotsProps = [2, 3, 4, 5, 6, 7, 8, 9, 10] // always is the same

const IosSpecificSettings = () => {
  const { t } = useTranslation('dlp/policy')
  const { specificSettingsWrapper } = policyStyles()
  const localPolicyData = useSelector(PolicyData.getLocalPolicyData)
  const dispatch = useDispatch()
  const { canUpdate } = usePoliciesPermissions()

  // load settings
  const numberOfScreenshots = localPolicyData?.numberOfScreenshots?.[supportedMobileOsType]

  const intervalForScreenshots = localPolicyData?.intervalForScreenshots?.[supportedMobileOsType]
  const iosMobilePolicyRule = localPolicyData?.policyRules?.find(
    i => i.osType === supportedMobileOsType && i.activity === supportedMobileActivityType,
  )

  const setHelperText = () => {
    let helpeText = null
    if (!intervalForScreenshots) {
      helpeText = t('policy.sections.requiredInput')
    }
    if (intervalForScreenshots < 0 || intervalForScreenshots > MAX_SCREENSHOTS_INTERVAL_VALUE) {
      helpeText = t('policy.sections.iosSpecificSettings.rangeText')
    }
    return helpeText
  }

  const onChange = e => {
    let key = e.target.name
    let value = e.target.value
    if (key === 'mobilePolicyRule') {
      key = 'policyRules'
      value = { ...iosMobilePolicyRule, action: e.target.value }
      dispatch(PolicyData.updateLocalPolicyData({ [key]: [value] }))
    } else {
      if (value && !Number(value)) {
        return
      }
      dispatch(PolicyData.updateLocalPolicyData({ [key]: { [supportedMobileOsType]: value } }))
    }
  }

  return (
    <>
      <Divider />
      <Typography variant="h3">{t('policy.sections.iosSpecificSettings.title')}</Typography>
      <div>
        <Select
          label={t(`policy.sections.actions.policyRules.${iosMobilePolicyRule?.activity}`)}
          name="mobilePolicyRule"
          size="small"
          variant="filled"
          onChange={onChange}
          value={iosMobilePolicyRule?.action || 'ACTION_TYPE_NONE'}
          disabled={!canUpdate}
        >
          <MenuItem aria-label="action-type-alert" value="ACTION_TYPE_ALERT">
            {t(`policy.sections.actions.policyRules.ACTION_TYPE_ALERT`)}
          </MenuItem>
          <MenuItem aria-label="action-type-none" value="ACTION_TYPE_NONE">
            {t('policy.sections.actions.policyRules.ACTION_TYPE_NONE')}
          </MenuItem>
        </Select>
        <div className={specificSettingsWrapper}>
          <span>{t('policy.sections.iosSpecificSettings.allowText')}</span>
          <Select
            name="numberOfScreenshots"
            size="small"
            value={numberOfScreenshots || 2}
            variant="filled"
            aria-label="numberOfScreenshots"
            onChange={onChange}
            disabled={!canUpdate}
          >
            {numberOfScreenshotsProps?.map((numberOfScreenshots, idx) => {
              return (
                <MenuItem key={idx} value={numberOfScreenshots} aria-label={`option-${numberOfScreenshots}`}>
                  {numberOfScreenshots}
                </MenuItem>
              )
            })}
          </Select>
          <span>{t('policy.sections.iosSpecificSettings.screenshotsInText')}</span>
          <TextField
            className="no-label"
            name="intervalForScreenshots"
            size="small"
            type="number"
            value={intervalForScreenshots}
            onChange={onChange}
            margin="none"
            inputProps={{ maxLength: 2, 'aria-label': 'intervalForScreenshots' }}
            error={!intervalForScreenshots || intervalForScreenshots < 0 || intervalForScreenshots > MAX_SCREENSHOTS_INTERVAL_VALUE}
            helperText={setHelperText()}
            disabled={!canUpdate}
          />
          <span>{t('policy.sections.iosSpecificSettings.intervalText')}</span>
        </div>
      </div>
    </>
  )
}

export default IosSpecificSettings
