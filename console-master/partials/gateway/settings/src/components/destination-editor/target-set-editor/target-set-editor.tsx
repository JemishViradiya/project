//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isEmpty, isEqual, throttle } from 'lodash-es'
import React, { useCallback, useContext, useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { FormGridLayout, makeFormGridLayoutValues, useFormGridLayoutDefaultValues } from '@ues-behaviour/hook-form'
import { usePrevious } from '@ues-behaviour/react'
import { Components } from '@ues-gateway/shared'

import { FORM_GRID_ON_CHANGE_THROTTLED_TIMEOUT } from './constants'
import { useTargetSetColumns, useTargetSetInitialValues } from './hooks'
import type { TargetSetEditorProps } from './types'
import { makeNetworkServiceConfigTargetSet } from './utils'

const { EntityDetailsViewContext } = Components

const TargetSetEditor: React.FC<TargetSetEditorProps> = ({
  initialData,
  onChange,
  isSystemNetworkService,
  showConjunctionLabel,
}) => {
  const { initialValues, setsInitialLength } = useTargetSetInitialValues(initialData, isSystemNetworkService)
  const columns = useTargetSetColumns(setsInitialLength, showConjunctionLabel)
  const defaultValues = useFormGridLayoutDefaultValues(initialValues)
  const previousDefaultValues = usePrevious(defaultValues)
  const { shouldDisableFormField } = useContext(EntityDetailsViewContext)

  const formInstance = useForm({
    mode: 'all',
    shouldFocusError: true,
    defaultValues,
  })

  const formErrors = isEmpty(formInstance.formState.errors)
  const previousFormErrors = usePrevious(formErrors)

  const handleChange = useCallback(() => {
    const formGridValues = makeFormGridLayoutValues({ formValues: formInstance.getValues(), columns })

    onChange({
      formValues: makeNetworkServiceConfigTargetSet(formGridValues),
      isFormValid: isEmpty(formInstance.formState.errors),
    })
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, formInstance])

  const throttledHandleChange = useMemo(() => throttle(handleChange, FORM_GRID_ON_CHANGE_THROTTLED_TIMEOUT), [handleChange])

  useEffect(() => {
    if (!isEqual(previousDefaultValues, defaultValues)) {
      formInstance.reset(defaultValues)
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previousDefaultValues, defaultValues])

  useEffect(() => {
    if (!isEqual(previousFormErrors, formErrors)) {
      handleChange()
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previousFormErrors, formErrors])

  return (
    <FormProvider {...formInstance}>
      <form>
        <FormGridLayout
          initialValues={initialValues}
          columns={columns}
          onChange={throttledHandleChange}
          disabled={shouldDisableFormField}
        />
      </form>
    </FormProvider>
  )
}

export default TargetSetEditor
