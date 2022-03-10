import type { TFunction } from 'i18next'
import { useMemo } from 'react'
import type { RegisterOptions } from 'react-hook-form'

import { PolicyFormField } from '../../../model'

const MAX_INPUT_CHARS = 250
const NON_WHITESPACE_CHAR_REQUIRED_REGEX = /.*\S.*/

export const usePolicyFormFieldsValidationRules = (t: TFunction) =>
  useMemo(
    (): Partial<Record<PolicyFormField, RegisterOptions>> => ({
      [PolicyFormField.Name]: {
        required: {
          value: true,
          message: t('general/form:validationErrors.required'),
        },
        pattern: {
          value: NON_WHITESPACE_CHAR_REQUIRED_REGEX,
          message: t('general/form:validationErrors.invalid'),
        },
        maxLength: {
          value: MAX_INPUT_CHARS,
          message: t('general/form:validationErrors.maxLength', {
            fieldName: t('bis/ues:policies.form.labels.name'),
            max: MAX_INPUT_CHARS,
          }),
        },
      },
      [PolicyFormField.Description]: {
        maxLength: {
          value: MAX_INPUT_CHARS,
          message: t('general/form:validationErrors.maxLength', {
            fieldName: t('bis/ues:policies.form.labels.description'),
            max: MAX_INPUT_CHARS,
          }),
        },
      },
      [PolicyFormField.PolicyData]: {
        required: true,
      },
    }),
    [t],
  )
