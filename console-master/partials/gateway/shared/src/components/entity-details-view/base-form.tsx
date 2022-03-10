//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { omit } from 'lodash-es'
import React, { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { FormFieldInterface, FormProps } from '@ues-behaviour/hook-form'
import { Form } from '@ues-behaviour/hook-form'

import { GATEWAY_TRANSLATIONS_KEY } from '../../config'
import { EntityDetailsViewContext } from './context'
import { useIsCopyMode } from './hooks'

interface BaseEditorFormData extends Partial<Record<string, unknown>> {
  name?: string
  description?: string
}

const MIN_NAME_LENGTH = 3
const MAX_NAME_LENGTH = 250
const MAX_DESCRIPTION_LENGTH = 500
const LEADING_WHITESPACE = /^[^\s]+(?:$|.*[^\s]+$)/

interface EntityDetailsViewBaseFormProps extends Pick<FormProps, 'onChange'> {
  data: BaseEditorFormData
  extraFields?: FormFieldInterface[]
  hideDescriptionField?: boolean
  disableNameField?: boolean
}

export const EntityDetailsViewBaseForm: React.FC<EntityDetailsViewBaseFormProps> = ({
  data,
  onChange,
  extraFields = [],
  hideDescriptionField = false,
  disableNameField = false,
}) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY, 'general/form'])
  const { updateFormValidationStates, shouldDisableFormField } = useContext(EntityDetailsViewContext)
  const { isCopyMode } = useIsCopyMode()

  const fields: FormFieldInterface[] = useMemo(() => {
    return [
      {
        required: true,
        type: 'text',
        label: t(`common.name`),
        name: 'name',
        disabled: shouldDisableFormField || disableNameField,
        validationRules: {
          required: { value: true, message: t('general/form:validationErrors.required') },
          minLength: {
            value: MIN_NAME_LENGTH,
            message: t('general/form:validationErrors.minLength', { min: MIN_NAME_LENGTH }),
          },
          maxLength: {
            value: MAX_NAME_LENGTH,
            message: t('general/form:validationErrors.maxLength', { fieldName: t(`common.name`), max: MAX_NAME_LENGTH }),
          },
          pattern: {
            value: LEADING_WHITESPACE,
            message: t('general/form:validationErrors.whitespace'),
          },
        },
      },
      {
        type: 'text',
        label: t(`common.description`),
        name: 'description',
        disabled: shouldDisableFormField,
        hidden: hideDescriptionField,
        validationRules: {
          maxLength: {
            value: MAX_DESCRIPTION_LENGTH,
            message: t('common.descriptionFieldMaxLengthValidationMessage', { value: MAX_DESCRIPTION_LENGTH }),
          },
        },
      },
      ...extraFields.map(field => ({ ...field, disabled: shouldDisableFormField })),
    ]
  }, [shouldDisableFormField, extraFields, t, hideDescriptionField, disableNameField])

  return (
    <Form
      hideButtons
      initialValues={isCopyMode ? omit(data, ['name']) : data}
      fields={fields}
      onValidationChange={({ isFormValid }) => updateFormValidationStates({ isBaseFormValid: isFormValid })}
      onChange={onChange}
    />
  )
}
