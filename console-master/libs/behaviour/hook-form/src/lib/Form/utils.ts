//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { fromPairs, isArray, omitBy } from 'lodash-es'

import { FORM_MULTILINE_FIELD_VALUE_SEPARATOR } from './constants'
import type { FormFieldInterface } from './types'
import { FormFieldType } from './types'

export const makeDefaultFieldValue = (formField: FormFieldInterface) => {
  if (formField?.muiProps?.defaultValue) return formField?.muiProps?.defaultValue

  switch (formField.type) {
    case FormFieldType.MultiSelect:
    case FormFieldType.MultiLine:
      return []
    case FormFieldType.Checkbox:
    case FormFieldType.Switch:
      return false
    default:
      return ''
  }
}

export const sanitizeForm = (fieldsValues: Record<string, unknown>): Record<string, unknown> => {
  const omited = omitBy(fieldsValues, value => value === undefined || value === null)

  return fromPairs(
    Object.entries(omited).map(entry => {
      if (isArray(entry[1])) {
        return [entry[0], entry[1].filter(item => item !== '')]
      }

      return entry
    }),
  )
}

export const makeMultilineFieldValue = (value: string): string[] => value.split(FORM_MULTILINE_FIELD_VALUE_SEPARATOR)
