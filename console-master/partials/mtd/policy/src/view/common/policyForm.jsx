/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { Form } from 'formik'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { Badge, Button, ButtonBase, ButtonGroup, Divider, Tooltip, Typography } from '@material-ui/core'

import { MtdPolicies } from '@ues-data/mtd'
import { FeatureName, FeaturizationApi } from '@ues-data/shared'
import { BasicEmail, BasicNotification } from '@ues/assets'
import { ContentArea, ContentAreaPanel, FormButtonPanel } from '@ues/behaviours'

import AndroidSettings from './androidSettings'
import { getI18Name, useTranslation } from './i18n'
import IosSettings from './iosSettings'
import NeutralSettings from './neutralSettings'
import { useReference } from './reference'
import { FORM_REFS, TAB } from './settings'
import useStyles from './styles'
import { useFormValidation } from './validate'

export default function PolicyForm({
  handleChange,
  values,
  errors,
  isSubmitting,
  onLeavePage,
  dirty,
  isFormDirty,
  writable,
  creatable = true,
  handleCopy = undefined,
  saveButtonLabel = undefined,
}) {
  const [tabState, setTabState] = React.useState(TAB.ANDROID)
  const classes = useStyles()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const formValidation = useFormValidation()
  const { setRef } = useReference()
  const [submitClicked, setSubmitClicked] = React.useState(false)

  useEffect(() => {
    if (dirty !== isFormDirty) {
      dispatch(MtdPolicies.SetFormDirty(dirty))
    }
  }, [dirty, dispatch, isFormDirty])

  const addDetectionHeader = () => {
    return FeaturizationApi.isFeatureEnabled(FeatureName.MobileThreatDetectionReportingOnlyMode) ? (
      <div>
        <div className={classes.separator}>
          <Tooltip title={t(getI18Name('detectionHeaderEmailTooltip'))}>
            <ButtonBase className={classes.titleItemRightDetectionEmail}>
              <BasicEmail fontSize="small" />
            </ButtonBase>
          </Tooltip>
          <Tooltip title={t(getI18Name('detectionHeaderDeviceTooltip'))}>
            <ButtonBase className={classes.titleItemRightDetectionNotify}>
              <BasicNotification fontSize="small" />
            </ButtonBase>
          </Tooltip>
          <Typography className={classes.separatorThinTop} variant="h3">
            {t(getI18Name('detectionHeader'))}
          </Typography>
        </div>
        <div className={classes.separator}>
          <Divider />
        </div>
      </div>
    ) : (
      ''
    )
  }

  const addButton = (item, index) => {
    if (submitClicked && errors[item]) {
      return (
        <Badge color="error" variant="dot">
          <Button key={index} className={tabState === item ? 'selected' : ''} onClick={() => setTabState(item)}>
            {t(getI18Name(`${item}.tabLabel`))}
          </Button>
        </Badge>
      )
    }
    return (
      <Button key={index} className={tabState === item ? 'selected' : ''} onClick={() => setTabState(item)}>
        {t(getI18Name(`${item}.tabLabel`))}
      </Button>
    )
  }

  return (
    <Form noValidate>
      <NeutralSettings handleChange={handleChange} values={values} errors={errors} writable={writable} />
      <div ref={el => setRef(FORM_REFS.SETTINGS_TAB_ANDROID, el)}>
        <div ref={el => setRef(FORM_REFS.SETTINGS_TAB_IOS, el)}>
          <ContentArea>
            <ContentAreaPanel title={t(getI18Name('deviceSettingsInformationLabel'))}>
              <ButtonGroup color="default" variant="outlined" id="deviceSettingsGroup">
                {Object.values(TAB).map((item, index) => addButton(item, index))}
              </ButtonGroup>
              {tabState === TAB.ANDROID && (
                <AndroidSettings
                  handleChange={handleChange}
                  values={values}
                  errors={errors}
                  writable={writable}
                  addDetectionHeader={addDetectionHeader}
                  submitClicked={submitClicked}
                />
              )}
              {tabState === TAB.IOS && (
                <IosSettings
                  handleChange={handleChange}
                  values={values}
                  errors={errors}
                  writable={writable}
                  addDetectionHeader={addDetectionHeader}
                  submitClicked={submitClicked}
                />
              )}
              <FormButtonPanel show={handleCopy === undefined || dirty}>
                <Button id="formCancel" variant="outlined" onClick={onLeavePage}>
                  {t(getI18Name('cancelButtonLabel'))}
                </Button>
                <Button
                  onClick={() => {
                    setSubmitClicked(true)
                    formValidation.scrollToError(errors)
                  }}
                  variant="contained"
                  color="primary"
                  type="submit"
                  id="formSubmit"
                  formNoValidate
                >
                  {saveButtonLabel ? saveButtonLabel : t(getI18Name('saveButtonLabel'))}
                </Button>
                {handleCopy !== undefined && creatable && (
                  <Button id="formCopy" variant="contained" color="primary" onClick={handleCopy}>
                    {t(getI18Name('saveAsButtonLabel'))}
                  </Button>
                )}
              </FormButtonPanel>
            </ContentAreaPanel>
          </ContentArea>
        </div>
      </div>
    </Form>
  )
}
