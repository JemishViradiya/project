/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

/* eslint-disable sonarjs/cognitive-complexity*/
import { Form } from 'formik'
import React, { memo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Badge, Button, ButtonGroup, useTheme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'

import type { Exception, ExceptionBase } from '@ues-data/eid'
import { FeatureName, FeaturizationApi } from '@ues-data/shared'
import { useInputFormControlStyles } from '@ues/assets'
import type { UseControlledDialogProps } from '@ues/behaviours'
import { ContentArea, ContentAreaPanel, FormButtonPanel } from '@ues/behaviours'

import ExceptionSelector from '../applicationException/ExceptionSelector'
import { Authenticator } from '../authenticators/useAuthenticatorList'
import { useReference } from '../reference'
import { FORM_REFS } from '../reference/types'
import { filterPolicyForCreate } from './filter'
import { DIALOG_TYPE, MODE_PARAM_VALUE, QUERY_STRING_PARM, VALIDATE_OPERATION } from './settings'
import { hasAuthenticationError, useFormValidation } from './validate'

const enableExceptions = FeaturizationApi.isFeatureEnabled(FeatureName.PolicyAuthenticationException)

// TODO: These will be deprecated when moving to common form pattern
const useStyles = makeStyles(theme => ({
  separator3: {
    paddingBottom: theme.spacing(3),
  },
  separator2: {
    paddingBottom: theme.spacing(2),
  },
  separator8: {
    paddingBottom: theme.spacing(8),
  },
}))

export default function PolicyForm({
  handleChange,
  values,
  errors,
  isSubmitting,
  onLeavePage,
  setIsFormDirty,
  dirty,
  writable = true,
  dataAuthenticators,
  dataTemplates,
  dataApps,
  originalPayload,
  isUpdate = false,
  creatable = true,
  canValidate = false,
  setCanValidate,
}) {
  const { t } = useTranslation(['eid/common', 'general/form'])
  const { setRef } = useReference()
  const formValidation = useFormValidation()
  const classes = useStyles()
  const theme = useTheme()
  const { root } = useInputFormControlStyles(theme)
  const references = useReference()
  const [dialogStateId, setDialogStateId] = React.useState<UseControlledDialogProps['dialogId']>()
  const [appExceptions, setAppExceptions] = React.useState<Exception[]>()
  const [availableAppExceptions, setAvailableAppExceptions] = React.useState<ExceptionBase[]>()
  const [manualValidateState, setManualValidateState] = React.useState<number>(0)
  const [selectedTabIndex, setSelectedTabIndex] = React.useState(0)
  const [originalAuthenticatiorsString, setOriginalAuthenticatiorsString] = React.useState<string>()
  const [originalRiskFactorsString, setOriginalRiskFactorsString] = React.useState<string>()
  const [originalExceptionString, setOriginalExceptionString] = React.useState<string>()
  const navigate = useNavigate()

  useEffect(() => {
    setOriginalAuthenticatiorsString(JSON.stringify(originalPayload?.authenticators))
    setOriginalRiskFactorsString(JSON.stringify(originalPayload?.risk_factors))
    setOriginalExceptionString(JSON.stringify(originalPayload?.exceptions))
  }, [originalPayload])

  // When authenticator data is loaded configure state for active payload
  useEffect(() => {
    if (dataAuthenticators && dataTemplates && dataApps) {
      // define available app exceptions
      const availableExceptions: ExceptionBase[] = []
      dataTemplates?.forEach(el => {
        // if is_display_as_authorized_software is false - do not include app
        // also, can only add exceptions if auth sw check can be skipped or auth record exists
        if (
          (el.is_static && el.is_display_as_authorized_software && (el.skip_authorized_software_check || hasAuthSoftware(el.id))) ||
          (!el.is_static && hasAuthSoftware(el.id))
        ) {
          availableExceptions.push({ software_id: el.id, name: el.name })
        }
      })
      setAvailableAppExceptions(availableExceptions)
      // Load active app exceptions from the current policy
      setAppExceptions(values?.exceptions)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataAuthenticators, dataTemplates, dataApps])

  // checks if auth software entry exists for the tenant
  const hasAuthSoftware = software_id => {
    return Boolean(dataApps?.find(el => el.software_id === software_id))
  }

  const manualValidate = (validateOperation: VALIDATE_OPERATION) => {
    let isEqual = true
    switch (validateOperation) {
      case VALIDATE_OPERATION.AUTHENTICATOR_LIST_CHANGE:
        isEqual =
          (!originalPayload.authenticators && !values?.authenticators) ||
          originalAuthenticatiorsString === JSON.stringify(values?.authenticators)
        break
      case VALIDATE_OPERATION.RISK_FACTORS_CHANGE:
        isEqual =
          (!originalPayload.risk_factors && !values?.risk_factors) ||
          originalRiskFactorsString === JSON.stringify(values?.risk_factors)
        break
      case VALIDATE_OPERATION.EXCEPTIONS_CHANGE:
        isEqual =
          (!originalPayload.exceptions && !values?.exceptions) || originalExceptionString === JSON.stringify(values?.exceptions)
        break
    }
    const bit = 1 << validateOperation
    const update = !isEqual ? manualValidateState | bit : manualValidateState & ~bit
    if (update !== manualValidateState) {
      setManualValidateState(update)
      setIsFormDirty(update !== 0)
    }
    references.getRef(FORM_REFS.FORMIK_BAG).validateForm()
  }

  const onConfirm = (applicationExceptions: string[]) => {
    // keep existing exceptions that match
    const updatedAppExceptions = appExceptions?.filter(({ name }) => applicationExceptions.includes(name)) || []
    const existingAppsSet: string[] = updatedAppExceptions.map(el => el.name)
    const appsToAdd = applicationExceptions?.filter(name => !existingAppsSet?.includes(name))
    appsToAdd?.forEach(name => {
      const appToAdd = availableAppExceptions?.find(el => el.name === name)
      if (appToAdd) {
        updatedAppExceptions.push({ ...appToAdd, authenticators: null })
      }
    })
    setAppExceptions(updatedAppExceptions)
    values.exceptions = updatedAppExceptions
    setDialogStateId(undefined)
    references.getRef(FORM_REFS.FORMIK_BAG).validateForm()
    manualValidate(VALIDATE_OPERATION.EXCEPTIONS_CHANGE)
  }

  const onCancel = () => {
    setDialogStateId(undefined)
  }

  const SaveAsButton = memo(() => {
    return (
      creatable &&
      isUpdate && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            const selectedCopy = references.getRef(FORM_REFS.FORMIK_BAG).values
            filterPolicyForCreate(selectedCopy)
            window.history.pushState({ urlPath: '#/list/enterpriseIdentity' }, '', '#/list/enterpriseIdentity')
            navigate(`/enterpriseIdentity/create?${QUERY_STRING_PARM.MODE}=${MODE_PARAM_VALUE.COPY}`, { state: selectedCopy })
          }}
        >
          {t('eid/common:common.saveAs')}
        </Button>
      )
    )
  })

  function onTabClick(event, index) {
    setSelectedTabIndex(index)
  }

  const validateNameField = () => {
    let error = ''

    if (canValidate && errors && errors[FORM_REFS.POLICY_NAME] !== undefined) {
      if (errors[FORM_REFS.POLICY_NAME] === 1) {
        error = t('eid/common:policy.nameHelperText')
      } else if (errors[FORM_REFS.POLICY_NAME] === 2) {
        error = t('eid/common:policy.nameHelperTextRequired')
      } else {
        error = t('general/form:validationErrors.whitespace')
      }
    }

    return error
  }

  const addButton = (el, index) => {
    if (hasAuthenticationError(errors, index)) {
      return (
        <Badge color="error" variant="dot">
          <Button key={index} className={selectedTabIndex === index ? 'selected' : ''} onClick={event => onTabClick(event, index)}>
            {el.name}
          </Button>
        </Badge>
      )
    }
    return (
      <Button key={index} className={selectedTabIndex === index ? 'selected' : ''} onClick={event => onTabClick(event, index)}>
        {el.name}
      </Button>
    )
  }

  return (
    <Form noValidate>
      <ContentArea>
        <ContentAreaPanel title={t('eid/common:policy.generalInformationLabel')}>
          <TextField
            inputRef={el => setRef(FORM_REFS.POLICY_NAME, el)}
            fullWidth
            size="small"
            required
            variant="filled"
            name="name"
            id={t('eid/common:policy.name')}
            type="text"
            label={t('eid/common:policy.name')}
            value={values?.name}
            error={canValidate && errors && errors[FORM_REFS.POLICY_NAME] !== undefined}
            disabled={!writable}
            className={classes.separator3}
            helperText={validateNameField()}
            onChange={handleChange}
            classes={{ root: root }}
          />
          <TextField
            fullWidth
            variant="filled"
            name="description"
            id={t('eid/common:policy.description')}
            size="small"
            type="text"
            disabled={!writable}
            label={t('eid/common:policy.description')}
            value={values?.description}
            onChange={handleChange}
            classes={{ root: root }}
          />
        </ContentAreaPanel>
      </ContentArea>
      <ContentArea>
        <ContentAreaPanel title={t('eid/common:policy.authenticationRulesLabel')}>
          <div ref={el => setRef(FORM_REFS.AUTHENTICATOR_LIST, el)}>
            <Authenticator
              values={values}
              dataAuthenticators={dataAuthenticators}
              errors={errors}
              canValidate={canValidate}
              handleChange={handleChange}
              writable={writable}
              manualValidate={manualValidate}
            />
          </div>
        </ContentAreaPanel>
      </ContentArea>
      {enableExceptions && (
        <ContentArea>
          <ContentAreaPanel title={t('eid/common:policy.applicationExceptionLabel')}>
            <p>{t('eid/common:policy.applicationExceptionDescription')}</p>
            {writable && (
              <div className={classes.separator8}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setDialogStateId(Symbol(DIALOG_TYPE.MANAGED_EXCEPTION_SELECT))}
                >
                  {t('eid/common:policy.applicationExceptionButton')}
                </Button>
              </div>
            )}
            <div ref={el => setRef(FORM_REFS.EXCEPTION_LIST, el)}>
              <div className={classes.separator2}>
                <ButtonGroup
                  style={{ flexWrap: 'wrap' }}
                  color="default"
                  variant="outlined"
                  aria-label={t('eid/common:policy.applicationExceptionButtonGroup')}
                >
                  {appExceptions?.map((el, index) => addButton(el, index))}
                </ButtonGroup>
              </div>
              {appExceptions?.map((el, index) => (
                <Authenticator
                  values={values?.exceptions[index]}
                  dataAuthenticators={dataAuthenticators}
                  visible={index === selectedTabIndex}
                  errors={errors}
                  canValidate={canValidate}
                  handleChange={handleChange}
                  writable={writable}
                  manualValidate={manualValidate}
                  exceptionIndex={index}
                />
              ))}
            </div>
          </ContentAreaPanel>
        </ContentArea>
      )}
      <FormButtonPanel show={!isUpdate || dirty || manualValidateState !== 0}>
        <Button
          variant="outlined"
          onClick={() => {
            onLeavePage()
          }}
          id="formCancel"
        >
          {t('eid/common:common.cancel')}
        </Button>
        <Button
          onClick={() => {
            setCanValidate(true)
            formValidation.scrollToError(errors)
          }}
          variant="contained"
          color="primary"
          type="submit"
          disabled={isSubmitting || (!dirty && manualValidateState === 0)}
        >
          {t('eid/common:common.save')}
        </Button>
        <SaveAsButton />
      </FormButtonPanel>
      <ExceptionSelector
        id={dialogStateId}
        appExceptions={appExceptions}
        availableAppExceptions={availableAppExceptions}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    </Form>
  )
}
