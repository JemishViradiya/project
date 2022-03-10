/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useCallback } from 'react'

import { Checkbox, FormControl, FormControlLabel, FormHelperText, TextField, Typography, useTheme } from '@material-ui/core'

import { FeatureName, FeaturizationApi } from '@ues-data/shared'
import { useInputFormControlStyles } from '@ues/assets'
import { ContentArea, ContentAreaPanel } from '@ues/behaviours'

import { getI18Name, useTranslation } from './i18n'
import PolicyRadio from './policyRadio'
import PolicySwitch from './policySwitch'
import { useReference } from './reference'
import { DATA_PRIVACY_FORM_SETTINGS, FORM_REFS, POLICY_WARNING_NOTIFICATION_INTERVAL } from './settings'
import useStyles from './styles'

const NeutralSettings = React.memo(({ handleChange, values, errors, writable }) => {
  const { t } = useTranslation()
  const classes = useStyles()
  const theme = useTheme()
  const { root } = useInputFormControlStyles(theme)
  const notificationControl = FeaturizationApi.isFeatureEnabled(FeatureName.MobileThreatDetectionReportingOnlyMode)
  const unsafeMsgThreatEnabled = FeaturizationApi.isFeatureEnabled(FeatureName.MobileThreatDetectionUnsafeMsgThreat)
  const addWarningMethodRequiredLabel = useCallback(
    errorName => {
      if (errors && errors[errorName] !== undefined) {
        return <FormHelperText>{t(getI18Name(`${errorName}Required`))}</FormHelperText>
      }
    },
    [t, errors],
  )
  const { setRef } = useReference()

  const addDataPrivacyElement = useCallback(
    dataPrivacyElement => {
      return (
        <div className={classes.containerColumn} key={dataPrivacyElement}>
          <FormControlLabel
            control={
              <Checkbox
                onChange={handleChange}
                name={dataPrivacyElement}
                disabled={!values.dataPrivacyEnabled || !writable}
                checked={values[dataPrivacyElement]}
              />
            }
            label={<Typography variant="body2">{t(getI18Name(dataPrivacyElement))}</Typography>}
          />
        </div>
      )
    },
    [t, handleChange, values, writable, classes],
  )

  return (
    <ContentArea>
      <ContentAreaPanel title={t(getI18Name('generalInformationLabel'))}>
        <TextField
          inputRef={el => setRef(FORM_REFS.POLICY_NAME, el)}
          fullWidth
          variant="filled"
          name="name"
          size="small"
          required
          disabled={!writable}
          label={t(getI18Name('name'))}
          id="name"
          value={values?.name}
          error={errors && errors[FORM_REFS.POLICY_NAME] !== undefined}
          helperText={
            errors && errors[FORM_REFS.POLICY_NAME] !== undefined
              ? errors[FORM_REFS.POLICY_NAME] === 1
                ? t(getI18Name('nameHelperText'))
                : t(getI18Name('nameHelperTextRequired'))
              : ''
          }
          onChange={handleChange}
          onBlur={handleChange}
          classes={{ root: root }}
        />
        <TextField
          fullWidth
          variant="filled"
          size="small"
          name="description"
          id="description"
          disabled={!writable}
          label={t(getI18Name('description'))}
          value={values?.description}
          onChange={handleChange}
          classes={{ root: root }}
        />
      </ContentAreaPanel>
      <ContentAreaPanel title={t(getI18Name('notificationInformationLabel'))}>
        {!notificationControl && (
          <div ref={el => setRef(FORM_REFS.WARNING_NOTIFCATION_INTERVAL, el)}>
            <PolicySwitch
              name="warningNotificationsEnabled"
              handleChange={handleChange}
              checked={values.warningNotificationsEnabled}
              additionalLabel
              disabled={!writable}
            />
            {values.warningNotificationsEnabled && (
              <div className={`${classes.indent} ${classes.separatorTop}`}>
                <div className={classes.containerRow}>
                  <TextField
                    value={values.warningNotificationsCount}
                    name="warningNotificationsCount"
                    id="warningNotificationsCount"
                    size="small"
                    helperText={t(getI18Name('warningNotificationsCountHelperText'))}
                    variant="filled"
                    label={t(getI18Name('warningNotificationsCount'))}
                    disabled={!values.warningNotificationsEnabled || !writable}
                    type="number"
                    InputProps={{ inputProps: { min: 1, max: 10000 } }}
                    onChange={handleChange}
                    classes={{ root: root }}
                    margin="dense"
                  />
                </div>
                <div className={classes.containerRow}>
                  <div>
                    <TextField
                      name="warningNotificationsInterval"
                      id="warningNotificationsInterval"
                      size="small"
                      label={t(getI18Name('warningNotificationsInterval'))}
                      value={values.warningNotificationsInterval}
                      variant="filled"
                      error={errors && errors['warningNotificationsInterval'] !== undefined}
                      helperText={t(getI18Name('warningNotificationsIntervalHelperText'))}
                      type="number"
                      InputProps={{ inputProps: { min: 1 } }}
                      disabled={!values.warningNotificationsEnabled || !writable}
                      onChange={handleChange}
                      classes={{ root: root }}
                      margin="dense"
                    />
                  </div>
                  <div className={`${classes.separatorLeft} ${classes.separatorThinTop}`}>
                    <PolicyRadio
                      name="warningNotificationsIntervalType"
                      value={values.warningNotificationsIntervalType}
                      disabled={!values.warningNotificationsEnabled || !writable}
                      handleChange={handleChange}
                      radioEnum={POLICY_WARNING_NOTIFICATION_INTERVAL}
                      errors={errors}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {notificationControl && (
          <div ref={el => setRef(FORM_REFS.WARNING_NOTIFCATION_INTERVAL, el)}>
            <div>
              <div className={classes.containerRow}>
                <TextField
                  value={values.warningNotificationsCount}
                  name="warningNotificationsCount"
                  id="warningNotificationsCount"
                  size="small"
                  helperText={t(getI18Name('warningNotificationsCountHelperText'))}
                  variant="filled"
                  label={t(getI18Name('warningNotificationsCount'))}
                  disabled={!writable}
                  type="number"
                  InputProps={{ inputProps: { min: 1, max: 10000 } }}
                  onChange={handleChange}
                  classes={{ root: root }}
                  margin="dense"
                />
              </div>
              <div className={classes.containerRow}>
                <div>
                  <TextField
                    name="warningNotificationsInterval"
                    id="warningNotificationsInterval"
                    size="small"
                    label={t(getI18Name('warningNotificationsInterval'))}
                    value={values.warningNotificationsInterval}
                    variant="filled"
                    error={errors && errors['warningNotificationsInterval'] !== undefined}
                    helperText={t(getI18Name('warningNotificationsIntervalHelperText'))}
                    type="number"
                    InputProps={{ inputProps: { min: 1 } }}
                    disabled={!writable}
                    onChange={handleChange}
                    classes={{ root: root }}
                    margin="dense"
                  />
                </div>
                <div className={`${classes.separatorLeft} ${classes.separatorThinTop}`}>
                  <PolicyRadio
                    name="warningNotificationsIntervalType"
                    value={values.warningNotificationsIntervalType}
                    disabled={!writable}
                    handleChange={handleChange}
                    radioEnum={POLICY_WARNING_NOTIFICATION_INTERVAL}
                    errors={errors}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </ContentAreaPanel>
      <ContentAreaPanel title={t(getI18Name('dataPrivacyInformationLabel'))}>
        <div ref={el => setRef(FORM_REFS.DATA_PRIVACY_NOT_SET, el)}>
          <PolicySwitch
            name="dataPrivacyEnabled"
            handleChange={handleChange}
            checked={values.dataPrivacyEnabled}
            additionalFormattedLabel
            disabled={!writable}
          />
          <FormControl
            component="fieldset"
            error={errors && errors['dataPrivacyEnabled'] !== undefined}
            disabled={!writable}
            focused={false}
            margin="dense"
            id="DataPrivacySettings"
          >
            {values.dataPrivacyEnabled && (
              <div className={classes.indent}>
                {Object.keys(DATA_PRIVACY_FORM_SETTINGS)
                  .filter(
                    key =>
                      unsafeMsgThreatEnabled ||
                      (key !== DATA_PRIVACY_FORM_SETTINGS.dataPrivacyMessageSenderPhoneEmail &&
                        key !== DATA_PRIVACY_FORM_SETTINGS.dataPrivacyUrl),
                  )
                  .map(dataPrivacyElement => addDataPrivacyElement(dataPrivacyElement))}
                {addWarningMethodRequiredLabel('dataPrivacyEnabled')}
              </div>
            )}
          </FormControl>
        </div>
      </ContentAreaPanel>
    </ContentArea>
  )
})

export default NeutralSettings
