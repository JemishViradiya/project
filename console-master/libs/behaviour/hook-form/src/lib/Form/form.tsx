//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isEqual, throttle } from 'lodash-es'
import React, { useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Box, Button, CircularProgress } from '@material-ui/core'

import { useEventHandler, usePrevious } from '@ues-behaviour/react'

import { FORM_ON_CHANGE_THROTTLED_TIMEOUT } from './constants'
import FormField from './fields'
import { useFormLayout } from './hooks/use-form-layout'
import { useFormValidationState } from './hooks/use-form-validation-state'
import useStyles from './styles'
import type { FormProps } from './types'
import { sanitizeForm } from './utils'

const Form: React.FC<FormProps> = ({
  cancelButtonLabel,
  fields,
  hideButtons = false,
  initialValues,
  isLoading,
  onCancel,
  onChange,
  onSubmit,
  submitButtonLabel,
  onValidationChange,
  validateCancelButton = false,
  layout,
  resolver,
  children,
}) => {
  const { t } = useTranslation(['general/form'])
  const classes = useStyles()
  const formInstance = useForm({
    mode: 'all',
    shouldFocusError: true,
    defaultValues: initialValues,
    resolver,
  })

  const previousInitialValues = usePrevious(initialValues)

  const visibleFields = useMemo(() => fields.filter(field => !field.hidden), [fields])

  const formLayout = useFormLayout(layout, visibleFields)

  const { isFormChanged, isFormValid } = useFormValidationState({ formInstance, onValidationChange })

  useEffect(() => {
    if (!isEqual(previousInitialValues, initialValues)) {
      resetForm()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues])

  const handleFormCancel = () => {
    if (onCancel) {
      onCancel()
    }

    resetForm()
  }

  const handleFormSubmit = useEventHandler(
    (ev: React.FormEvent<HTMLFormElement>) => {
      formInstance.handleSubmit((formValues: Record<string, unknown>) => {
        if (onSubmit) {
          onSubmit(sanitizeForm(formValues), formInstance)
        }
      })(ev)
    },
    [formInstance],
  )

  const throttledOnChange: FormProps['onChange'] = useMemo(
    () => throttle(formData => onChange(formData), FORM_ON_CHANGE_THROTTLED_TIMEOUT),
    [onChange],
  )

  const handleFormChange = () => {
    if (typeof onChange === 'function') {
      throttledOnChange({ formValues: sanitizeForm(formInstance.getValues()) })
    }
  }

  const resetForm = () => formInstance.reset(initialValues)

  return (
    <FormProvider {...formInstance}>
      <form onSubmit={handleFormSubmit} className={classes.form}>
        <Box className={formLayout}>
          {children}
          {visibleFields.map(field => (
            <FormField key={field.name} formField={field} onChange={handleFormChange} />
          ))}
        </Box>

        {hideButtons === false && (
          <div className={classes.formButtons}>
            <Button variant="outlined" onClick={handleFormCancel} disabled={(validateCancelButton && !isFormChanged) || isLoading}>
              {cancelButtonLabel ?? t('general/form:commonLabels.cancel')}
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              startIcon={isLoading && <CircularProgress size="1rem" />}
              disabled={!isFormValid || isLoading}
            >
              {submitButtonLabel ?? t('general/form:commonLabels.submit')}
            </Button>
          </div>
        )}
      </form>
    </FormProvider>
  )
}

export default Form
