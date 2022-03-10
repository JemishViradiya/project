//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isEmpty } from 'lodash-es'
import { useEffect } from 'react'

import { usePrevious } from '@ues-behaviour/react'

import type { FormInstance, FormProps } from '../types'

type UseFormValidationStateFn = (args: {
  formInstance: FormInstance
  onValidationChange: FormProps['onValidationChange']
}) => { isFormValid: boolean; previousIsFormValid: boolean; isFormChanged: boolean }

export const useFormValidationState: UseFormValidationStateFn = ({ formInstance, onValidationChange }) => {
  const { isDirty: isFormChanged, errors: formErrors, isValid } = formInstance.formState

  const isFormValid = isEmpty(formErrors) && isValid
  const previousIsFormValid = usePrevious(isFormValid)

  const handleValidationChange = () => {
    if (onValidationChange) {
      onValidationChange({ isFormValid: isFormValid, isFormChanged })
    }
  }

  useEffect(() => {
    handleValidationChange()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isFormValid !== previousIsFormValid) {
      handleValidationChange()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFormValid, previousIsFormValid])

  return { isFormValid, previousIsFormValid, isFormChanged }
}
