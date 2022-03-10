/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useEffect } from 'react'

import { TextField, Typography } from '@material-ui/core'

import { queryDeviceOsVersions } from '@ues-data/mtd'
import { FeatureName, FeaturizationApi, useStatefulApolloQuery } from '@ues-data/shared'
import { TransferList } from '@ues/behaviours'

import { Busy } from './busy'
import DeviceModelSelection from './deviceModelSelection'
import { getI18Name, useTranslation } from './i18n'
import PolicyRadio from './policyRadio'
import PolicySwitch from './policySwitch'
import { useReference } from './reference'
import {
  FORM_REFS,
  MIN_OS,
  OS_FAMILY,
  POLICY_SMS_SCANNING_OPTIONS,
  UNRESPONSIVE_AGENT_MAX_VALUE,
  UNRESPONSIVE_AGENT_MIN_VALUE,
} from './settings'
import { numSort } from './sort'
import useStyles from './styles'
import { useFormValidation } from './validate'

const IosSettings = React.memo(({ handleChange, values, errors, writable, addDetectionHeader, submitClicked }) => {
  const { t } = useTranslation()
  const { data: data_deviceos, error: error_deviceos, loading: loading_deviceos } = useStatefulApolloQuery(queryDeviceOsVersions, {
    variables: { osFamily: OS_FAMILY.IOS, startOsVersion: MIN_OS.IOS },
  })
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

  if (loading_deviceos) {
    return <Busy />
  }

  return (
    <div>
      {addDetectionHeader()}
      <Typography variant="h3" className={classes.separatorThick}>
        {t(getI18Name('ios.appSecurityHeader'))}
      </Typography>
      <PolicySwitch
        name="iosSideLoadedAppEnabled"
        handleChange={handleChange}
        checked={values.iosSideLoadedAppEnabled}
        disabled={!writable}
        additionalLabel
        includeNotification
        values={values}
      />
      <Typography variant="h3" className={`${classes.separatorThick} ${classes.separatorThickTop}`}>
        {t(getI18Name('ios.deviceSecurityHeader'))}
      </Typography>
      <PolicySwitch
        name="iosPrivilegeEscalationEnabled"
        handleChange={handleChange}
        checked={values.iosPrivilegeEscalationEnabled}
        disabled={!writable}
        additionalLabel
        includeNotification
        values={values}
      />
      <PolicySwitch
        name="iosScreenLockDisabled"
        handleChange={handleChange}
        checked={values.iosScreenLockDisabled}
        disabled={!writable}
        additionalLabel
        includeNotification
        values={values}
      />
      <DeviceModelSelection
        name="iosUnsupportedModel"
        handleChange={handleChange}
        values={values}
        disabled={!writable}
        osFamily={OS_FAMILY.IOS}
        errors={errors}
        submitClicked={submitClicked}
      />
      <div ref={el => setRef(FORM_REFS.IOS_UNSUPPORTED_OS_LIST, el)}>
        <PolicySwitch
          name="iosUnsupportedOsEnabled"
          handleChange={handleChange}
          checked={values.iosUnsupportedOsEnabled}
          disabled={!writable || !data_deviceos?.deviceOsVersions}
          additionalLabel
          includeNotification
          values={values}
        />
        {values.iosUnsupportedOsEnabled && (
          <div className={`${classes.indent} ${classes.separatorTop}`}>
            <TransferList
              disabled={!data_deviceos?.deviceOsVersions || !values.iosUnsupportedOsEnabled || !writable}
              allValues={data_deviceos?.deviceOsVersions && data_deviceos?.deviceOsVersions.map(val => val.version)}
              rightValues={values[FORM_REFS.IOS_UNSUPPORTED_OS_LIST]}
              onChange={(left, right) => handleTransferListChange(FORM_REFS.IOS_UNSUPPORTED_OS_LIST, right)}
              leftLabel={t(getI18Name(`${FORM_REFS.IOS_UNSUPPORTED_OS_LIST}Left`))}
              rightLabel={t(getI18Name(`${FORM_REFS.IOS_UNSUPPORTED_OS_LIST}Right`))}
              allowRightEmpty={!submitClicked}
              sortFunction={numSort}
            />
          </div>
        )}
      </div>
      <PolicySwitch
        name="iosIntegrityCheckAttestationEnabled"
        handleChange={handleChange}
        checked={values.iosIntegrityCheckAttestationEnabled}
        disabled={!writable}
        additionalLabel
        includeNotification
        values={values}
      />
      <Typography variant="h3" className={`${classes.separatorThick} ${classes.separatorThickTop}`}>
        {t(getI18Name('ios.networkProtectionHeader'))}
      </Typography>
      <PolicySwitch
        name="iosCompromisedNetworkEnabled"
        handleChange={handleChange}
        checked={values.iosCompromisedNetworkEnabled}
        disabled={!writable}
        additionalLabel
        includeNotification
        values={values}
      />
      <Typography variant="h3" className={`${classes.separatorThick} ${classes.separatorThickTop}`}>
        {t(getI18Name('ios.safeBrowsingProtectionHeader'))}
      </Typography>
      <PolicySwitch
        name="iosMessageScanningEnabled"
        handleChange={handleChange}
        checked={values.iosMessageScanningEnabled}
        disabled={!writable}
        additionalLabel
      />
      {values.iosMessageScanningEnabled && (
        <div className={`${classes.indent} ${classes.separatorTop}`}>
          <PolicyRadio
            name="iosMessageScanningOption"
            value={values.iosMessageScanningOption}
            disabled={!values.iosMessageScanningEnabled || !writable}
            handleChange={handleChange}
            radioEnum={POLICY_SMS_SCANNING_OPTIONS}
            errors={errors}
          />
        </div>
      )}
      {FeaturizationApi.isFeatureEnabled(FeatureName.MobileThreatDetectionUnresponsiveAgentThreat) && (
        <div>
          <Typography variant="h3" className={`${classes.separatorThick} ${classes.separatorThickTop}`}>
            {t(getI18Name('ios.miscellaneousHeader'))}
          </Typography>
          <PolicySwitch
            name="iosUnresponsiveAgent"
            handleChange={handleChange}
            checked={true}
            disabled={true}
            additionalLabel
            includeNotification
            values={values}
          />
          <div ref={el => setRef(FORM_REFS.IOS_UNRESPONSIVE_AGENT_COUNT, el)}>
            <div className={`${classes.indent} ${classes.separatorTop}`}>
              <TextField
                value={values.iosUnresponsiveThresholdHours}
                name="iosUnresponsiveThresholdHours"
                id="iosUnresponsiveThresholdHours"
                error={errors && errors['iosUnresponsiveThresholdHours'] !== undefined}
                size="small"
                helperText={t(getI18Name('iosUnresponsiveThresholdHoursHelperText'))}
                variant="filled"
                label={t(getI18Name('iosUnresponsiveThresholdHours'))}
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

export default IosSettings
