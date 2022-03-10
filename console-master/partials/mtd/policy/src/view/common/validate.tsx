/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import * as httpStatus from 'http-status-codes'
import React, { createContext, memo, useContext } from 'react'

import { FeaturizationApi } from '@ues-data/shared'
import { FeatureName } from '@ues-data/shared-types'
import { useSnackbar } from '@ues/behaviours'

import { getI18Name, getI18PolicyOperationError, useTranslation } from './i18n'
import { ENQUEUE_TYPE } from './notification'
import { ReferenceProvider, useReference } from './reference'
import {
  DATA_PRIVACY_FORM_SETTINGS,
  FORM_REFS,
  POLICY_WARNING_NOTIFICATION_INTERVAL,
  SERVER_POLICY_OPERATION,
  UNRESPONSIVE_AGENT_MAX_VALUE,
  UNRESPONSIVE_AGENT_MIN_VALUE,
} from './settings'

export enum CONFLICT_SUBSTATUS {
  POLICY_NAME = 1,
}

export enum PRECONDITION_SUBSTATUS {
  ASSIGNED_USER = 101,
  ASSIGNED_GROUP = 102,
  ASSIGNED_USER_AND_GROUP = 103,
}

export enum FOCUSABLE_ERRORS {
  NAME = FORM_REFS.POLICY_NAME,
}

function Validate(values: any, serverError: any, payload: any): Map<FORM_REFS, number> {
  const formError = new Map<FORM_REFS, number>()
  if (values && (!values.name || values.name.length === 0)) {
    formError[FORM_REFS.POLICY_NAME] = 2
  }
  if (
    values &&
    (FeaturizationApi.isFeatureEnabled(FeatureName.MobileThreatDetectionReportingOnlyMode) || values.warningNotificationsEnabled)
  ) {
    let cnt = values.warningNotificationsInterval
    if (values.warningNotificationsIntervalType === POLICY_WARNING_NOTIFICATION_INTERVAL.HOURS) {
      cnt = cnt * 60
    } else if (values.warningNotificationsIntervalType === POLICY_WARNING_NOTIFICATION_INTERVAL.DAYS) {
      cnt = cnt * 1440
    }
    if (cnt < 15) {
      formError[FORM_REFS.WARNING_NOTIFCATION_INTERVAL] = 1
    } else if (cnt > 524160) {
      formError[FORM_REFS.WARNING_NOTIFCATION_INTERVAL] = 2
    }
  }
  if (
    values?.dataPrivacyEnabled &&
    Object.keys(DATA_PRIVACY_FORM_SETTINGS).filter(key => isNaN(Number(key)) && values[key] === true).length === 0
  ) {
    formError[FORM_REFS.DATA_PRIVACY_NOT_SET] = 1
  }

  if (values?.androidInsecureWifiEnabled && (!values.androidInsecureWifiList || values.androidInsecureWifiList.length === 0)) {
    formError[FORM_REFS.ANDROID_INSECURE_WIFI_LIST] = 1
  }
  validateUresponsiveAgent(values, formError)
  validateSmsMsgScanOffset(values, formError)
  validateUnsupportedOs(values, formError)
  validateUnsupportedModel(values, formError)
  validateServerErrors(formError, serverError)
  validateSecurityPatch(values, formError)
  if (
    Object.keys(FORM_REFS).filter(key => FORM_REFS[key].startsWith('android') && formError[FORM_REFS[key]] !== undefined).length !==
    0
  ) {
    formError[FORM_REFS.SETTINGS_TAB_ANDROID] = 1
  }
  if (
    Object.keys(FORM_REFS).filter(key => FORM_REFS[key].startsWith('ios') && formError[FORM_REFS[key]] !== undefined).length !== 0
  ) {
    formError[FORM_REFS.SETTINGS_TAB_IOS] = 1
  }
  if (formError[FORM_REFS.POLICY_NAME] === 1 && values && payload && values.name !== payload.name) {
    delete formError[FORM_REFS.POLICY_NAME]
  }
  return formError
}

function isServerErrorValid(serverError: any): boolean {
  return serverError && serverError['response'] !== undefined && serverError.response['data'] !== undefined
}
function validateUresponsiveAgent(values: any, formError: Map<FORM_REFS, number>) {
  if (values && FeaturizationApi.isFeatureEnabled(FeatureName.MobileThreatDetectionUnresponsiveAgentThreat)) {
    if (
      !Number.isInteger(values.androidUnresponsiveThresholdHours) ||
      values.androidUnresponsiveThresholdHours < UNRESPONSIVE_AGENT_MIN_VALUE ||
      values.androidUnresponsiveThresholdHours > UNRESPONSIVE_AGENT_MAX_VALUE
    ) {
      formError[FORM_REFS.ANDROID_UNRESPONSIVE_AGENT_COUNT] = 1
    }
    if (
      !Number.isInteger(values.iosUnresponsiveThresholdHours) ||
      values.iosUnresponsiveThresholdHours < UNRESPONSIVE_AGENT_MIN_VALUE ||
      values.iosUnresponsiveThresholdHours > UNRESPONSIVE_AGENT_MAX_VALUE
    ) {
      formError[FORM_REFS.IOS_UNRESPONSIVE_AGENT_COUNT] = 1
    }
  }
}

function validateSmsMsgScanOffset(values: any, formError: Map<FORM_REFS, number>) {
  if (
    values?.androidMessageScanningEnabled &&
    FeaturizationApi.isFeatureEnabled(FeatureName.MobileThreatDetectionUnsafeMsgThreat) &&
    (!Number.isInteger(values.androidScanMsgStartTimeOffset) ||
      values.androidScanMsgStartTimeOffset < 0 ||
      values.androidScanMsgStartTimeOffset > 168)
  ) {
    formError[FORM_REFS.ANDROID_SMS_SCANNING_START_OFFSET] = 1
  }
}

function validateSecurityPatch(values: any, formError: Map<FORM_REFS, number>) {
  if (values?.androidHwAttestationSecurityPatchEnabled) {
    if (!values.androidHwAttestationSecurityPatchLevelList || values.androidHwAttestationSecurityPatchLevelList?.length === 0) {
      formError[FORM_REFS.ANDROID_SECURITY_PATCH_LIST] = 1
    } else {
      for (let i = 0; i < values.androidHwAttestationSecurityPatchLevelList.length; i++) {
        const patch = values.androidHwAttestationSecurityPatchLevelList[i]
        if (!patch.date || !patch.date.year || !patch.date.month || !patch.date.day) {
          formError[FORM_REFS.ANDROID_SECURITY_PATCH_LIST] = 1
          break
        }
      }
    }
  }
}

function validateUnsupportedOs(values: any, formError: Map<FORM_REFS, number>) {
  if (values?.androidUnsupportedOsEnabled && (!values.androidUnsupportedOsList || values.androidUnsupportedOsList.length === 0)) {
    formError[FORM_REFS.ANDROID_UNSUPPORTED_OS_LIST] = 1
  }
  if (values?.iosUnsupportedOsEnabled && (!values.iosUnsupportedOsList || values.iosUnsupportedOsList.length === 0)) {
    formError[FORM_REFS.IOS_UNSUPPORTED_OS_LIST] = 1
  }
}

function validateUnsupportedModel(values: any, formError: Map<FORM_REFS, number>) {
  if (
    values?.androidUnsupportedModelEnabled &&
    (!values.androidUnsupportedModelList || values.androidUnsupportedModelList.length === 0)
  ) {
    formError[FORM_REFS.ANDROID_UNSUPPORTED_MODEL_LIST] = 1
  }
  if (values?.iosUnsupportedModelEnabled && (!values.iosUnsupportedModelList || values.iosUnsupportedModelList.length === 0)) {
    formError[FORM_REFS.IOS_UNSUPPORTED_MODEL_LIST] = 1
  }
}

function validateServerErrors(formError: Map<FORM_REFS, number>, serverError: any): void {
  if (
    isServerErrorValid(serverError) &&
    serverError.response.status === httpStatus.CONFLICT &&
    serverError.response.data.subCode === CONFLICT_SUBSTATUS.POLICY_NAME
  ) {
    formError[FORM_REFS.POLICY_NAME] = 1
  }
}

async function ScrollToError(formError: Map<FORM_REFS, number>, notification, references) {
  const scrollableError = Object.keys(formError).filter(error => references.exists(error))[0]
  //console.log('scrollToError: ', { formError, scrollableError })
  if (scrollableError) {
    const errorRef = scrollableError as FORM_REFS
    if (references.exists(errorRef)) {
      window.scrollTo({
        left: 0,
        top: references.getRef(errorRef).offsetTop,
        behavior: 'smooth',
      })
      // If error is focusable - set focus and select in a delay to give time for "smooth" scroll
      if (Object.keys(FOCUSABLE_ERRORS).filter(key => key === scrollableError)[0] !== undefined) {
        await wait(750)
        references.focus(errorRef)
        references.select(errorRef)
      }
    }
  }
  const tabErrors: string[] = [FORM_REFS.SETTINGS_TAB_ANDROID, FORM_REFS.SETTINGS_TAB_IOS]
  const validationErrorCount = Object.keys(formError).filter(key => !tabErrors.includes(key)).length
  // show all errors
  if (validationErrorCount > 0) {
    notification(ENQUEUE_TYPE.ERROR, getI18Name('formSubmitSnackBarError'), { count: validationErrorCount })
  }
}

function ProcessServerError(serverError: any, policyOperation: SERVER_POLICY_OPERATION, notification, references): void {
  if (serverError) {
    const formError = Validate(null, serverError, null)
    console.log('ProcessServerError: ', { formError })
    if (formError && Object.keys(formError).length > 0) {
      ScrollToError(formError, notification, references)
      // force a form validate to highlight server error(s)
      references.getRef(FORM_REFS.FORMIK_BAG)?.validateForm()
    } else {
      issueServerErrorNotification(serverError, policyOperation, notification)
    }
  }
}

function issueServerErrorNotification(serverError: any, policyOperation: SERVER_POLICY_OPERATION, notification): void {
  if (policyOperation) {
    if (
      policyOperation === SERVER_POLICY_OPERATION.DELETE &&
      isServerErrorValid(serverError) &&
      serverError.response.status === httpStatus.PRECONDITION_FAILED &&
      serverError.response.data.subcode
    ) {
      switch (serverError.response.data.subcode) {
        case PRECONDITION_SUBSTATUS.ASSIGNED_USER:
          notification(ENQUEUE_TYPE.ERROR, getI18PolicyOperationError('deleteWithUsers'))
          return
        case PRECONDITION_SUBSTATUS.ASSIGNED_GROUP:
          notification(ENQUEUE_TYPE.ERROR, getI18PolicyOperationError('deleteWithGroups'))
          return
        case PRECONDITION_SUBSTATUS.ASSIGNED_USER_AND_GROUP:
          notification(ENQUEUE_TYPE.ERROR, getI18PolicyOperationError('deleteWithUsersAndGroups'))
          return
      }
    }
    notification(ENQUEUE_TYPE.ERROR, getI18PolicyOperationError(policyOperation))
  } else {
    issueServerErrorUnknownNotification(serverError, notification)
  }
}

function issueServerErrorUnknownNotification(serverError: any, notification): void {
  if (serverError.response && serverError.response.status) {
    if (serverError.response.data && serverError.response.data.subcode) {
      notification(ENQUEUE_TYPE.ERROR, getI18Name('unexpectedErrorWithHttpSubcodeMessage'), {
        status: serverError.response.status,
        subcode: serverError.response.data.subcode,
      })
    } else {
      notification(ENQUEUE_TYPE.ERROR, getI18Name('unexpectedErrorWithHttpMessage'), { status: serverError.response.status })
    }
  } else {
    notification(ENQUEUE_TYPE.ERROR, getI18Name('unexpectedErrorMessage'))
  }
}

function wait(ms: number) {
  return new Promise(r => setTimeout(r, ms))
}

function FormSubmitPreprocess(values, references) {
  if (FeaturizationApi.isFeatureEnabled(FeatureName.MobileThreatDetectionReportingOnlyMode)) {
    values['warningEmailNotificationsEnabled'] = values['warningNotificationsEnabled'] = true
  } else {
    values['warningEmailNotificationsEnabled'] = values['warningNotificationsEnabled']
  }

  // Security Patch enablement checkbox is UI only, so when disabled, clear list before sending to Policy Service.
  if (!values['androidHwAttestationSecurityPatchEnabled']) {
    delete values['androidHwAttestationSecurityPatchLevelList']
  }
  // androidUnresponsiveAgent/iosUnresponsiveAgent checkboxs are UX only, always enabled, simply remove them prior to sending payload
  delete values['androidUnresponsiveAgent']
  delete values['iosUnresponsiveAgent']
  // console.log('submitting: ', { values })
}

function ValidateApolloQuery(loading, error, data, errorKey, notification) {
  if (!loading && (error || !data)) {
    // console.log('error loading data: ', { loading: loading, error: error, data: data })
    notification(ENQUEUE_TYPE.ERROR, getI18Name(errorKey))
  }
}

const FormValidationContext = createContext({
  validate: (values: any, serverError: any, payload: any) => new Map<FORM_REFS, number>(),
  scrollToError: (formError: Map<FORM_REFS, number>) => {
    /* dummy scroll handler */
  },
  processServerError: (serverError: any, policyOperation: SERVER_POLICY_OPERATION) => {
    /* dummy error handler */
  },
  validateApolloQuery: (loading, error, data, errorKey) => {
    /* dummy validation handler */
  },
  formSubmitPreprocess: values => {
    /* dummy form handler */
  },
} as const)

const FormValidationProvider = ({ children }) => {
  const { t } = useTranslation()
  const snackbar = useSnackbar()
  const references = useReference()

  const notification = (variant: ENQUEUE_TYPE, message: string, formatArgs?: any) => {
    snackbar.enqueueMessage(formatArgs ? t(message, formatArgs) : t(message), variant)
  }

  const validate = (values: any, serverError: any, payload: any) => Validate(values, serverError, payload)
  const scrollToError = async (formError: Map<FORM_REFS, number>) => ScrollToError(formError, notification, references)
  const processServerError = (serverError: any, policyOperation: SERVER_POLICY_OPERATION) =>
    ProcessServerError(serverError, policyOperation, notification, references)
  const validateApolloQuery = (loading, error, data, errorKey) => ValidateApolloQuery(loading, error, data, errorKey, notification)
  const formSubmitPreprocess = values => FormSubmitPreprocess(values, references)

  return (
    <FormValidationContext.Provider
      value={{ validate, scrollToError, processServerError, validateApolloQuery, formSubmitPreprocess }}
    >
      {children}
    </FormValidationContext.Provider>
  )
}

export const FormProvider = memo(({ children }) => {
  return (
    <ReferenceProvider>
      <FormValidationProvider>{children}</FormValidationProvider>
    </ReferenceProvider>
  )
})

export const useFormValidation = () => useContext(FormValidationContext)
