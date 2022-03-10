//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import isArray from 'lodash-es/isArray'

import { FILTER_TYPES } from '../../filters'
import { COMPARISON_OPTIONS, DEFAULT_COMPARISON_OPTIONS } from './constants'
import { BLANK_OPTION } from './hooks'
import type {
  EnhancedFieldConfig,
  EnhancedSearchChip,
  EnhancedSearchFieldOption,
  EnhancedSearchInitialValue,
  EnhancedSearchOnChangeValues,
} from './types'
import { SearchStep } from './types'

type UncheckLastCheckboxFn = (
  currentField: EnhancedSearchChip,
) =>
  | {
      found: boolean
      options: EnhancedSearchFieldOption[]
    }
  | Record<string, never>
export const uncheckLastCheckbox: UncheckLastCheckboxFn = currentField => {
  return (
    currentField?.nestedOptions?.reduceRight(
      (acc, item) => {
        if (item.checked && !acc.found) {
          return {
            found: true,
            options: [{ ...item, checked: false }, ...acc.options],
          }
        }
        return {
          ...acc,
          options: [item, ...acc.options],
        }
      },
      { found: false, options: [] },
    ) || {}
  )
}

type ConvertEnhancedSearchValuesForCallbackFn = (values: EnhancedSearchChip[]) => EnhancedSearchOnChangeValues[]
export const convertEnhancedSearchValuesForCallback: ConvertEnhancedSearchValuesForCallbackFn = values =>
  values.map(item => {
    return {
      dataKey: item.dataKey,
      operator: item.comparison.value,
      value: isArray(item.value) ? item.value.map(({ value }) => value) : item.value.value,
      type: item.type,
    }
  })

type PrepareInitialValuesFn = (initialValues: EnhancedSearchInitialValue[], fields: EnhancedFieldConfig[]) => EnhancedSearchChip[]
export const prepareInitialValues: PrepareInitialValuesFn = (initialValues, fields) => {
  const defaultValues = []
  initialValues.forEach(({ dataKey, operator, value }) => {
    if (!value || (!isArray(value) && !value.value && value.value !== 0)) {
      return
    }
    const fieldConfig = fields.find(field => dataKey === field.dataKey)
    const [comparison] =
      COMPARISON_OPTIONS.filter(comparator => operator === comparator.value) ||
      fieldConfig.customOperators ||
      DEFAULT_COMPARISON_OPTIONS

    const preparedValue = isArray(value)
      ? value.map(item => ({
          value: item.value ?? item,
          label: item.label || (item.value ?? item),
          checked: true,
        }))
      : value

    if (!isArray(preparedValue) && preparedValue.value && !preparedValue.label) {
      preparedValue.label = preparedValue.value
    }

    const currentFieldData = {
      ...fieldConfig,
      comparison,
      value: preparedValue,
      nestedOptions: fieldConfig.options,
    }
    defaultValues.push(currentFieldData)
  })
  return defaultValues
}

type RemapValuesWithListPropsFn = (
  values: EnhancedSearchChip[],
  selectedFieldIndex: number,
  searchValue: string,
) => EnhancedSearchChip[]
export const remapValuesWithListProps: RemapValuesWithListPropsFn = (values, selectedFieldIndex, searchValue) => {
  return values.map((item, index) => {
    if (index === selectedFieldIndex) {
      return {
        ...item,
        listProps: {
          ...item.listProps,
          searchValue,
        },
      }
    }
    return item
  })
}

type RemoveLastComparisonFn = (args: {
  values: EnhancedSearchChip[]
  fieldIndex: number
  currentField: EnhancedSearchChip
}) => {
  newValues: EnhancedSearchChip[]
  options: EnhancedSearchFieldOption[]
}
export const removeLastComparison: RemoveLastComparisonFn = ({ values, fieldIndex, currentField }) => {
  const newValues: EnhancedSearchChip[] = values.map((item, index) => {
    if (index === fieldIndex) {
      return {
        ...item,
        comparison: BLANK_OPTION,
        value: BLANK_OPTION,
      }
    }
    return item
  })

  return {
    newValues,
    options: currentField.customOperators
      ? COMPARISON_OPTIONS.filter(operator => currentField.customOperators.includes(operator.value))
      : DEFAULT_COMPARISON_OPTIONS,
  }
}

type RemoveLastNonArrayValueFn = (args: { values: EnhancedSearchChip[]; fieldIndex: number }) => { newValues: EnhancedSearchChip[] }
export const removeLastNonArrayValue: RemoveLastNonArrayValueFn = ({ values, fieldIndex }) => {
  const newValues = values.map((item, index) => {
    if (index === fieldIndex) {
      return {
        ...item,
        value: BLANK_OPTION,
      }
    }
    return item
  })

  return { newValues }
}

type RemoveLastArrayValueFn = (args: {
  values: EnhancedSearchChip[]
  fieldIndex: number
  currentField: EnhancedSearchChip
}) => { newValues: EnhancedSearchChip[] }
export const removeLastArrayValue: RemoveLastArrayValueFn = ({ values, fieldIndex, currentField }) => {
  const currentFieldValues = (currentField.value as EnhancedSearchFieldOption[]).filter(
    (element, index) => index < (currentField.value as EnhancedSearchFieldOption[]).length - 1,
  )
  const newValues = values.reduce((acc, item, index) => {
    if (index === fieldIndex) {
      return [
        ...acc,
        {
          ...item,
          value: currentFieldValues,
        },
      ]
    }
    return [...acc, item]
  }, [])

  return { newValues }
}

type GetDataForFirstStepFn = (args: {
  values: EnhancedSearchChip[]
  details: { option: EnhancedSearchChip }
}) => { newValues: EnhancedSearchChip[]; options: EnhancedSearchFieldOption[]; step: SearchStep }
export const getDataForFirstStep: GetDataForFirstStepFn = ({ values, details }) => {
  let comparison = BLANK_OPTION
  let step = SearchStep.Second
  const options = details.option.customOperators
    ? COMPARISON_OPTIONS.filter(operator => details.option.customOperators.includes(operator.value))
    : DEFAULT_COMPARISON_OPTIONS

  if (details.option.preselectComparison) {
    step = SearchStep.Third
    if (typeof details.option.preselectComparison === 'string') {
      comparison = options.find(operator => details.option.preselectComparison === operator.value)
    }

    if (details.option.preselectComparison === true) {
      comparison = options[0]
    }
  }

  const newValues = [
    ...values,
    {
      ...details.option,
      comparison,
      value: BLANK_OPTION,
      nestedOptions: details.option?.options,
    },
  ]

  return { newValues, options, step }
}

type GetDataForSecondStepFn = (args: {
  values: EnhancedSearchChip[]
  currentField: EnhancedSearchChip
  selectedFieldIndex: number
  details: { option: EnhancedSearchChip }
}) => {
  newValues: EnhancedSearchChip[]
  valueExists: boolean
}
export const getDataForSecondStep: GetDataForSecondStepFn = ({ values, currentField, selectedFieldIndex, details }) => {
  const newValues = values.reduce((acc, item, index) => {
    if (index === selectedFieldIndex) {
      let _value = currentField.value || BLANK_OPTION
      if (currentField.type === FILTER_TYPES.NUMERIC) {
        _value = {
          value: (currentField?.value as EnhancedSearchFieldOption)?.value || currentField.min || '',
          label: (currentField?.value as EnhancedSearchFieldOption)?.label || currentField.min || '',
        }
      }
      if (currentField.type === FILTER_TYPES.NUMERIC_RANGE) {
        const [existingMinValue, existingMaxValue] = (currentField?.value as EnhancedSearchFieldOption[]) || []
        _value = [
          {
            value: existingMinValue?.value || currentField.min,
            label: existingMinValue?.value || currentField.min,
          },
          {
            value: existingMaxValue?.value || currentField.max,
            label: existingMaxValue?.value || currentField.max,
          },
        ]
      }
      return [
        ...acc,
        {
          ...currentField,
          comparison: details.option,
          nestedOptions: currentField.nestedOptions || currentField.options,
          options: [BLANK_OPTION],
          value: _value,
        },
      ]
    }
    return [...acc, item]
  }, [])

  return { newValues, valueExists: !isNoChipValue(currentField) }
}

type IsNoChipValueFn = (field: EnhancedSearchChip) => boolean
export const isNoChipValue: IsNoChipValueFn = field => {
  if (isArray(field.value)) {
    return !field.value.length
  }
  return field?.value?.value === ''
}
