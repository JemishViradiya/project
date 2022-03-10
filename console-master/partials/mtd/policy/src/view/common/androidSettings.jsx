/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

/* eslint-disable sonarjs/cognitive-complexity*/
import React, { useEffect } from 'react'

import { TextField, Typography, useTheme } from '@material-ui/core'

import { queryDeviceOsVersions, queryWifiTypes } from '@ues-data/mtd'
import { FeatureName, FeaturizationApi, useStatefulApolloQuery } from '@ues-data/shared'
import { useInputFormControlStyles } from '@ues/assets'
import { TransferList } from '@ues/behaviours'

import AndroidSecurityPatch from './androidSecurityPatch'
import { Busy } from './busy'
import DeviceModelSelection from './deviceModelSelection'
import { getI18HelpTextName, getI18Name, useTranslation } from './i18n'
import PolicyForm from './policyForm'
import PolicyRadio from './policyRadio'
import PolicySwitch from './policySwitch'
import { useReference } from './reference'
import {
  FORM_REFS,
  MIN_OS,
  OS_FAMILY,
  POLICY_HW_ATTESTATION_SECURITY_LEVEL,
  POLICY_SMS_SCANNING_OPTIONS,
  UNRESPONSIVE_AGENT_MAX_VALUE,
  UNRESPONSIVE_AGENT_MIN_VALUE,
} from './settings'
import { alphaAscendingSort, numSort } from './sort'
import useStyles from './styles'
import { useFormValidation } from './validate'

const AndroidSettings = React.memo(({ handleChange, values, errors, writable, addDetectionHeader, submitClicked }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const { root } = useInputFormControlStyles(theme)
  const { data: data_deviceos, error: error_deviceos, loading: loading_deviceos } = useStatefulApolloQuery(queryDeviceOsVersions, {
    variables: { osFamily: OS_FAMILY.ANDROID, startOsVersion: MIN_OS.ANDROID },
  })
  const { data: data_wifi, error: error_wifi, loading: loading_wifi } = useStatefulApolloQuery(queryWifiTypes, {})
  const formValidation = useFormValidation()
  const { setRef, getRef } = useReference()
  const classes = useStyles()

  const handleTransferListChange = (name, values) => {
    getRef(FORM_REFS.FORMIK_BAG).setFieldValue('hidden', values, true)
    getRef(FORM_REFS.FORMIK_BAG).setFieldValue(name, [...values], true)
  }

  useEffect(() => {
    formValidation.validateApolloQuery(
      loading_deviceos,
      error_deviceos,
      data_deviceos?.deviceOsVersions,
      'deviceOsVersionLoadingErrorMessage',
    )
  }, [data_deviceos, error_deviceos, loading_deviceos, formValidation])

  useEffect(() => {
    formValidation.validateApolloQuery(loading_wifi, error_wifi, data_wifi?.wifiTypes, 'wifiSettingsLoadingErrorMessage')
  }, [data_wifi, error_wifi, loading_wifi, formValidation])

  if (loading_deviceos || loading_wifi) {
    return <Busy />
  }

  return (
    <div>
      {addDetectionHeader()}
      <Typography variant="h3" className={classes.separatorThick}>
        {t(getI18Name('android.appSecurityHeader'))}
      </Typography>
      <PolicySwitch
        name="androidMaliciousAppEnabled"
        handleChange={handleChange}
        checked={values.androidMaliciousAppEnabled}
        disabled={!writable}
        additionalLabel
        includeNotification
        values={values}
      />
      {values.androidMaliciousAppEnabled && (
        <div className={classes.indent}>
          <PolicySwitch
            name="androidMaliciousAppAlwaysAllowApprovedList"
            handleChange={handleChange}
            checked={values.androidMaliciousAppEnabled && values.androidMaliciousAppAlwaysAllowApprovedList}
            disabled={!values.androidMaliciousAppEnabled || !writable}
          />
          <PolicySwitch
            name="androidMaliciousAppAlwaysBlockRestrictList"
            handleChange={handleChange}
            checked={values.androidMaliciousAppEnabled && values.androidMaliciousAppAlwaysBlockRestrictList}
            disabled={!values.androidMaliciousAppEnabled || !writable}
          />
          <PolicySwitch
            name="androidMaliciousAppScanSystem"
            handleChange={handleChange}
            checked={values.androidMaliciousAppEnabled && values.androidMaliciousAppScanSystem}
            disabled={!values.androidMaliciousAppEnabled || !writable}
          />
          <PolicySwitch
            name="androidMaliciousAppUploadOverWifi"
            handleChange={handleChange}
            checked={values.androidMaliciousAppEnabled && values.androidMaliciousAppUploadOverWifi}
            disabled={!values.androidMaliciousAppEnabled || !writable}
          />
          {values.androidMaliciousAppUploadOverWifi && (
            <div className={classes.indent}>
              <div className={classes.containerRow}>
                <TextField
                  name="androidMaliciousAppWifiMaxSize"
                  id="androidMaliciousAppWifiMaxSize"
                  label={t(getI18Name('androidMaliciousAppWifiMaxSize'))}
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  variant="filled"
                  helperText={t(getI18HelpTextName('androidMaliciousAppWifiMaxSize'))}
                  disabled={!values.androidMaliciousAppEnabled || !values.androidMaliciousAppUploadOverWifi || !writable}
                  value={values.androidMaliciousAppWifiMaxSize}
                  onChange={handleChange}
                  size="small"
                  classes={{ root: root }}
                  margin="dense"
                  aria-label={t(getI18Name('androidMaliciousAppUploadOverWifi'))}
                />
              </div>
              <div className={classes.containerRow}>
                <TextField
                  name="androidMaliciousAppWifiMaxMonthly"
                  id="androidMaliciousAppWifiMaxMonthly"
                  label={t(getI18Name('androidMaliciousAppWifiMaxMonthly'))}
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  variant="filled"
                  helperText={t(getI18HelpTextName('androidMaliciousAppWifiMaxMonthly'))}
                  disabled={!values.androidMaliciousAppEnabled || !values.androidMaliciousAppUploadOverWifi || !writable}
                  value={values.androidMaliciousAppWifiMaxMonthly}
                  onChange={handleChange}
                  size="small"
                  classes={{ root: root }}
                  margin="dense"
                  aria-label={t(getI18Name('androidMaliciousAppUploadOverWifi'))}
                />
              </div>
            </div>
          )}
          <PolicySwitch
            name="androidMaliciousAppUploadOverMobile"
            handleChange={handleChange}
            disabled={!values.androidMaliciousAppEnabled || !writable}
            checked={values.androidMaliciousAppUploadOverMobile}
          />
          {values.androidMaliciousAppUploadOverMobile && (
            <div className={classes.indent}>
              <div className={classes.containerRow}>
                <TextField
                  name="androidMaliciousAppMobileMaxSize"
                  id="androidMaliciousAppMobileMaxSize"
                  label={t(getI18Name('androidMaliciousAppMobileMaxSize'))}
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  helperText={t(getI18HelpTextName('androidMaliciousAppMobileMaxSize'))}
                  variant="filled"
                  disabled={!values.androidMaliciousAppEnabled || !values.androidMaliciousAppUploadOverMobile || !writable}
                  value={values.androidMaliciousAppMobileMaxSize}
                  onChange={handleChange}
                  size="small"
                  classes={{ root: root }}
                  margin="dense"
                  aria-label={t(getI18Name('androidMaliciousAppUploadOverMobile'))}
                />
              </div>
              <div className={classes.containerRow}>
                <TextField
                  name="androidMaliciousAppMobileMaxMonthly"
                  id="androidMaliciousAppMobileMaxMonthly"
                  label={t(getI18Name('androidMaliciousAppMobileMaxMonthly'))}
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  helperText={t(getI18Name('androidMaliciousAppMobileMaxMonthlyHelperText'))}
                  variant="filled"
                  disabled={!values.androidMaliciousAppEnabled || !values.androidMaliciousAppUploadOverMobile || !writable}
                  onChange={handleChange}
                  size="small"
                  value={values.androidMaliciousAppMobileMaxMonthly}
                  classes={{ root: root }}
                  margin="dense"
                  aria-label={t(getI18Name('androidMaliciousAppUploadOverMobile'))}
                />
              </div>
            </div>
          )}
        </div>
      )}
      <PolicySwitch
        name="androidSideLoadedAppEnabled"
        handleChange={handleChange}
        checked={values.androidSideLoadedAppEnabled}
        disabled={!writable}
        additionalLabel
        includeNotification
        values={values}
      />
      <Typography variant="h3" className={`${classes.separatorThick} ${classes.separatorThickTop}`}>
        {t(getI18Name('android.deviceSecurityHeader'))}
      </Typography>
      <PolicySwitch
        name="androidPrivilegeEscalationEnabled"
        handleChange={handleChange}
        checked={values.androidPrivilegeEscalationEnabled}
        disabled={!writable}
        additionalLabel
        includeNotification
        values={values}
      />
      <PolicySwitch
        name="androidEncryptionDisabled"
        handleChange={handleChange}
        checked={values.androidEncryptionDisabled}
        disabled={!writable}
        additionalLabel
        includeNotification
        values={values}
      />
      <PolicySwitch
        name="androidScreenLockDisabled"
        handleChange={handleChange}
        checked={values.androidScreenLockDisabled}
        disabled={!writable}
        additionalLabel
        includeNotification
        values={values}
      />
      {FeaturizationApi.isFeatureEnabled(FeatureName.MobileThreatDetectionKnoxAttestationThreat) && (
        <PolicySwitch
          name="androidKnoxAttestationEnabled"
          handleChange={handleChange}
          checked={values.androidKnoxAttestationEnabled}
          disabled={!writable}
          additionalLabel
          includeNotification
          values={values}
        />
      )}
      {FeaturizationApi.isFeatureEnabled(FeatureName.MobileThreatDetectionDeveloperModeThreat) && (
        <PolicySwitch
          name="androidDeveloperModeDetectionEnabled"
          handleChange={handleChange}
          checked={values.androidDeveloperModeDetectionEnabled}
          disabled={!writable}
          additionalLabel
          includeNotification
          values={values}
        />
      )}
      <DeviceModelSelection
        name="androidUnsupportedModel"
        handleChange={handleChange}
        values={values}
        disabled={!writable}
        osFamily={OS_FAMILY.ANDROID}
        errors={errors}
        submitClicked={submitClicked}
      />
      <div ref={el => setRef(FORM_REFS.ANDROID_UNSUPPORTED_OS_LIST, el)}>
        <PolicySwitch
          name="androidUnsupportedOsEnabled"
          handleChange={handleChange}
          checked={values.androidUnsupportedOsEnabled}
          disabled={!writable || !data_deviceos?.deviceOsVersions}
          additionalLabel
          includeNotification
          values={values}
        />
        {values.androidUnsupportedOsEnabled && (
          <div className={`${classes.indent} ${classes.separatorTop}`}>
            <TransferList
              disabled={!data_deviceos?.deviceOsVersions || !values.androidUnsupportedOsEnabled || !writable}
              allValues={data_deviceos?.deviceOsVersions?.map(val => val.version)}
              rightValues={values[FORM_REFS.ANDROID_UNSUPPORTED_OS_LIST]}
              onChange={(left, right) => handleTransferListChange(FORM_REFS.ANDROID_UNSUPPORTED_OS_LIST, right)}
              leftLabel={t(getI18Name(`${FORM_REFS.ANDROID_UNSUPPORTED_OS_LIST}Left`))}
              rightLabel={t(getI18Name(`${FORM_REFS.ANDROID_UNSUPPORTED_OS_LIST}Right`))}
              allowRightEmpty={!submitClicked}
              sortFunction={numSort}
            />
          </div>
        )}
      </div>
      <PolicySwitch
        name="androidSafetynetAttestationEnabled"
        handleChange={handleChange}
        checked={values.androidSafetynetAttestationEnabled}
        disabled={!writable}
        additionalLabel
        includeNotification
        values={values}
      />
      {values.androidSafetynetAttestationEnabled && (
        <div className={classes.indent}>
          <PolicySwitch
            name="androidSafetynetAttestationCtsEnabled"
            handleChange={handleChange}
            checked={values.androidSafetynetAttestationCtsEnabled}
            disabled={!writable}
          />
        </div>
      )}
      <PolicySwitch
        name="androidHwAttestationEnabled"
        handleChange={handleChange}
        checked={values.androidHwAttestationEnabled}
        disabled={!writable}
        additionalLabel
        includeNotification
        values={values}
      />
      {values.androidHwAttestationEnabled && (
        <div className={`${classes.indent} ${classes.separatorTop}`}>
          <PolicyRadio
            name="androidHwAttestationSecurityLevel"
            value={values.androidHwAttestationSecurityLevel}
            disabled={!values.androidHwAttestationEnabled || !writable}
            handleChange={handleChange}
            radioEnum={POLICY_HW_ATTESTATION_SECURITY_LEVEL}
            errors={errors}
          />
          <AndroidSecurityPatch
            values={values}
            writable={writable}
            handleChange={handleChange}
            errors={errors}
            submitClicked={submitClicked}
          />
        </div>
      )}
      <Typography variant="h3" className={`${classes.separatorThick} ${classes.separatorThickTop}`}>
        {t(getI18Name('android.networkProtectionHeader'))}
      </Typography>
      <PolicySwitch
        name="androidCompromisedNetworkEnabled"
        handleChange={handleChange}
        checked={values.androidCompromisedNetworkEnabled}
        disabled={!writable}
        additionalLabel
        includeNotification
        values={values}
      />
      <div ref={el => setRef(FORM_REFS.ANDROID_INSECURE_WIFI_LIST, el)}>
        <PolicySwitch
          name="androidInsecureWifiEnabled"
          handleChange={handleChange}
          checked={values.androidInsecureWifiEnabled}
          disabled={!data_wifi?.wifiTypes || !writable}
          additionalLabel
          includeNotification
          values={values}
        />
        {values.androidInsecureWifiEnabled && (
          <div className={`${classes.indent} ${classes.separatorTop}`}>
            <TransferList
              disabled={!data_wifi?.wifiTypes || !values.androidInsecureWifiEnabled || !writable}
              allValues={data_wifi?.wifiTypes.slice()}
              rightValues={values[FORM_REFS.ANDROID_INSECURE_WIFI_LIST]}
              onChange={(left, right) => handleTransferListChange(FORM_REFS.ANDROID_INSECURE_WIFI_LIST, right)}
              leftLabel={t(getI18Name(`${FORM_REFS.ANDROID_INSECURE_WIFI_LIST}Left`))}
              rightLabel={t(getI18Name(`${FORM_REFS.ANDROID_INSECURE_WIFI_LIST}Right`))}
              allowRightEmpty={!submitClicked}
              sortFunction={alphaAscendingSort}
            />
          </div>
        )}
      </div>
      <Typography variant="h3" className={`${classes.separatorThick} ${classes.separatorThickTop}`}>
        {t(getI18Name('android.safeBrowsingProtectionHeader'))}
      </Typography>
      <PolicySwitch
        name="androidMessageScanningEnabled"
        handleChange={handleChange}
        checked={values.androidMessageScanningEnabled}
        disabled={!writable}
        additionalLabel
        includeNotification
        values={values}
      />
      {values.androidMessageScanningEnabled && (
        <div className={`${classes.indent} ${classes.separatorTop}`}>
          <PolicyRadio
            name="androidMessageScanningOption"
            value={values.androidMessageScanningOption}
            disabled={!values.androidMessageScanningEnabled || !writable}
            handleChange={handleChange}
            radioEnum={POLICY_SMS_SCANNING_OPTIONS}
            errors={errors}
          />
        </div>
      )}
      {values.androidMessageScanningEnabled && FeaturizationApi.isFeatureEnabled(FeatureName.MobileThreatDetectionUnsafeMsgThreat) && (
        <div className={`${classes.indent}`}>
          <div ref={el => setRef(FORM_REFS.ANDROID_SMS_SCANNING_START_OFFSET, el)}>
            <div className={classes.containerRow}>
              <div>
                <TextField
                  name="androidScanMsgStartTimeOffset"
                  id="androidScanMsgStartTimeOffset"
                  size="small"
                  label={t(getI18Name('androidScanMsgStartTimeOffset'))}
                  value={values?.androidScanMsgStartTimeOffset ?? '0'}
                  variant="filled"
                  error={errors && errors[FORM_REFS.ANDROID_SMS_SCANNING_START_OFFSET] !== undefined}
                  helperText={t(getI18Name('androidScanMsgStartTimeOffsetHelperText'))}
                  type="number"
                  InputProps={{ inputProps: { min: 0, max: 168 } }}
                  disabled={!values.androidMessageScanningEnabled || !writable}
                  onChange={handleChange}
                  classes={{ root: root }}
                  margin="dense"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {FeaturizationApi.isFeatureEnabled(FeatureName.MobileThreatDetectionUnresponsiveAgentThreat) && (
        <div>
          <Typography variant="h3" className={`${classes.separatorThick} ${classes.separatorThickTop}`}>
            {t(getI18Name('android.miscellaneousHeader'))}
          </Typography>
          <PolicySwitch
            name="androidUnresponsiveAgent"
            handleChange={handleChange}
            checked={true}
            disabled={true}
            additionalLabel
            includeNotification
            includeDeviceNotification={false}
            values={values}
          />
          <div ref={el => setRef(FORM_REFS.ANDROID_UNRESPONSIVE_AGENT_COUNT, el)}>
            <div className={`${classes.indent} ${classes.separatorTop}`}>
              <TextField
                value={values.androidUnresponsiveThresholdHours}
                name="androidUnresponsiveThresholdHours"
                id="androidUnresponsiveThresholdHours"
                error={errors && errors['androidUnresponsiveThresholdHours'] !== undefined}
                size="small"
                helperText={t(getI18Name('androidUnresponsiveThresholdHoursHelperText'))}
                variant="filled"
                label={t(getI18Name('androidUnresponsiveThresholdHours'))}
                type="number"
                InputProps={{ inputProps: { min: UNRESPONSIVE_AGENT_MIN_VALUE, max: UNRESPONSIVE_AGENT_MAX_VALUE } }}
                onChange={handleChange}
                classes={{ root: root }}
                margin="dense"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
})

export default AndroidSettings
