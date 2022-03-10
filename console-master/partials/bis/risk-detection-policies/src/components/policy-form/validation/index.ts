import type { TFunction } from 'i18next'
import { useMemo } from 'react'
import type { RegisterOptions } from 'react-hook-form'

import type { PolicyFormValues } from '../../../model'

const MAX_INPUT_CHARS = 250
const NON_WHITESPACE_CHAR_REQUIRED_REGEX = /.*\S.*/

export const usePolicyFormFieldsValidationRules = (t: TFunction) =>
  useMemo(
    (): Partial<Record<keyof PolicyFormValues, RegisterOptions>> => ({
      name: {
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
            fieldName: t('bis/ues:detectionPolicies.form.labels.name'),
            max: MAX_INPUT_CHARS,
          }),
        },
      },
      description: {
        maxLength: {
          value: MAX_INPUT_CHARS,
          message: t('general/form:validationErrors.maxLength', {
            fieldName: t('bis/ues:detectionPolicies.form.labels.description'),
            max: MAX_INPUT_CHARS,
          }),
        },
      },
    }),
    [t],
  )
