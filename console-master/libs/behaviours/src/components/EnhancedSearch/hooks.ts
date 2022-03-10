//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import isArray from 'lodash-es/isArray'
import type { ChangeEvent, Dispatch, RefObject } from 'react'
import { useCallback, useEffect } from 'react'

import type { AutocompleteInputChangeReason } from '@material-ui/lab'

import { FILTER_TYPES } from '../../filters'
import type { EnhanceSearchAction } from './actions'
import { COMPARISON_OPTIONS, DEFAULT_COMPARISON_OPTIONS } from './constants'
import { enhancedSearchActions, useEnhancedSearchContext } from './EnhancedSearchProvider'
import type {
  EnhancedFieldConfig,
  EnhancedSearchChip,
  EnhancedSearchChipValue,
  EnhancedSearchComparisonField,
  EnhancedSearchInitialValue,
  EnhancedSearchOnChangeValues,
} from './types'
import { Reason, SearchStep } from './types'
import {
  convertEnhancedSearchValuesForCallback,
  getDataForFirstStep,
  getDataForSecondStep,
  isNoChipValue,
  prepareInitialValues,
  removeLastArrayValue,
  removeLastComparison,
  removeLastNonArrayValue,
} from './utils'

const FORBID_SEARCH_FOR_TYPE = {
  [FILTER_TYPES.RISK]: true,
  [FILTER_TYPES.LIST]: true,
}
export const BLANK_OPTION = { value: '', label: '' }

export interface UseEnhancementSearchHook {
  fields: EnhancedFieldConfig[]
  disabled: boolean
  step: number
  dispatch: Dispatch<EnhanceSearchAction>
  onChange: (data: EnhancedSearchOnChangeValues[] | Record<string, never>, key: string) => void
  values: EnhancedSearchChip[]
  selectedFieldIndex: number
  optionRef: RefObject<HTMLDivElement>
  searchRefs: RefObject<HTMLInputElement>
  optionsShow: boolean
}

export const useEnhancementSearchHook = ({
  fields,
  disabled,
  step,
  dispatch,
  onChange,
  values,
  selectedFieldIndex,
  optionRef,
  searchRefs,
  optionsShow,
}: UseEnhancementSearchHook) => {
  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    const handleClickOutside = event => {
      if (
        !optionRef.current &&
        step === SearchStep.Second &&
        values[selectedFieldIndex]?.comparison?.value &&
        !event.target.className
      ) {
        dispatch(enhancedSearchActions.setOperator({ values, fields, valueExists: false, hideOptions: true }))
        return
      }

      if (optionRef.current && !optionRef.current.contains(event.target)) {
        if (disabled || step === SearchStep.First) {
          return
        }
        if (step === SearchStep.First || !values.length || isNoChipValue(values[selectedFieldIndex])) {
          dispatch(enhancedSearchActions.setCurrentOptionsShow({ show: false }))
          return
        }
        dispatch(enhancedSearchActions.resetStep({ fields, values, step, currentField: values[selectedFieldIndex] }))
      }
    }

    const handleBackspace = event => {
      if (event.key === 'Backspace' && !event.target.value && values.length) {
        let fieldIndex = values.length - 1
        let currentField = values[fieldIndex]

        if (selectedFieldIndex !== null && values[selectedFieldIndex]) {
          fieldIndex = selectedFieldIndex
          currentField = values[selectedFieldIndex]
        }
        if (!currentField.comparison?.value) {
          const newValues = values.filter((_, index) => index !== selectedFieldIndex)
          onChange(convertEnhancedSearchValuesForCallback(newValues), currentField.dataKey)
          dispatch(
            enhancedSearchActions.removeChip({
              fields,
              values: newValues,
              selectedFieldIndex: null,
              onChange,
              step: SearchStep.First,
            }),
          )
          return
        }

        if (isNoChipValue(currentField)) {
          const { options, newValues } = removeLastComparison({ values, fieldIndex, currentField })
          onChange(convertEnhancedSearchValuesForCallback(newValues), currentField.dataKey)
          dispatch(enhancedSearchActions.removeOperator({ options, values: newValues }))
          return
        }

        if (
          (!isArray(currentField?.value) && currentField.value?.value !== '') ||
          currentField.type === FILTER_TYPES.NUMERIC_RANGE ||
          currentField.type === FILTER_TYPES.NUMERIC ||
          currentField.type === FILTER_TYPES.RISK
        ) {
          const { newValues } = removeLastNonArrayValue({ values, fieldIndex })
          const [checkBoxValues] = newValues
          onChange(convertEnhancedSearchValuesForCallback(newValues), currentField.dataKey)
          dispatch(
            enhancedSearchActions.removeLastValue({
              newValues,
              selectedFieldIndex: fieldIndex,
              hideOptions: !(checkBoxValues?.value as EnhancedSearchChipValue[])?.length,
            }),
          )
          return
        }

        if (isArray(currentField?.value)) {
          const { newValues } = removeLastArrayValue({ values, fieldIndex, currentField })
          onChange(convertEnhancedSearchValuesForCallback(newValues), currentField.dataKey)
          dispatch(
            enhancedSearchActions.removeLastValue({
              newValues,
              selectedFieldIndex: fieldIndex,
              hideOptions: currentField.type === FILTER_TYPES.LIST ? false : optionsShow,
            }),
          )
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    searchRefs?.current?.addEventListener('keydown', handleBackspace)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      searchRefs?.current?.removeEventListener('keydown', handleBackspace)
    }
  }, [selectedFieldIndex, disabled, dispatch, fields, optionRef, onChange, step, values, searchRefs, optionsShow])

  const handleChange = useCallback(
    (event, value, reason, details) => {
      if (disabled) {
        return
      }
      if (reason === Reason.SELECT_OPTION && step === SearchStep.First) {
        const { newValues, options, step } = getDataForFirstStep({ values, details })
        dispatch(enhancedSearchActions.initNewChip({ options, values: newValues, step }))
      }
      if (reason === Reason.SELECT_OPTION && step === SearchStep.Second) {
        const currentField = values[selectedFieldIndex]
        const { newValues, valueExists } = getDataForSecondStep({ values, currentField, selectedFieldIndex, details })
        if (!isNoChipValue(currentField)) {
          onChange(convertEnhancedSearchValuesForCallback(newValues), currentField.dataKey)
        }
        dispatch(enhancedSearchActions.setOperator({ values: newValues, fields, valueExists }))
      }
    },
    [disabled, step, dispatch, values, selectedFieldIndex, fields, onChange],
  )

  const handleDeleteChip = useCallback(
    key => () => {
      if (disabled) {
        return
      }
      const previousField = values[selectedFieldIndex]
      const currentField = values[key]

      const isPreviousFieldInPendingState = !previousField?.comparison?.value || isNoChipValue(previousField)
      const newValues = values.filter((_, index) => index !== key)
      if (selectedFieldIndex !== null && selectedFieldIndex !== key && isPreviousFieldInPendingState) {
        onChange(convertEnhancedSearchValuesForCallback(newValues), currentField.dataKey)

        const comparisonOptions: EnhancedSearchComparisonField[] = previousField.customOperators
          ? COMPARISON_OPTIONS.filter(operator => previousField.customOperators.includes(operator.value))
          : DEFAULT_COMPARISON_OPTIONS
        dispatch(
          enhancedSearchActions.removeChip({
            fields: step === SearchStep.Second ? comparisonOptions : [],
            values: newValues,
            selectedFieldIndex: key < selectedFieldIndex ? selectedFieldIndex - 1 : selectedFieldIndex,
            onChange,
            step: step === SearchStep.Second ? SearchStep.Second : SearchStep.Third,
          }),
        )
        return
      }

      onChange(convertEnhancedSearchValuesForCallback(newValues), currentField.dataKey)
      dispatch(
        enhancedSearchActions.removeChip({
          fields,
          values: newValues,
          selectedFieldIndex: null,
          onChange,
          step: SearchStep.First,
        }),
      )
    },
    [disabled, values, selectedFieldIndex, onChange, dispatch, fields, step],
  )

  const handleEditChip = useCallback(
    (index: number, step: SearchStep) => () => {
      if (disabled) {
        return
      }

      const currentField = values[index]
      const previousField = values[selectedFieldIndex]
      const isPreviousFieldInPendingState = !previousField?.comparison?.value || isNoChipValue(previousField)

      if (selectedFieldIndex !== null && index !== selectedFieldIndex && isPreviousFieldInPendingState) {
        return
      }

      let options = currentField.options
      if (step === SearchStep.Second) {
        options = currentField.customOperators
          ? COMPARISON_OPTIONS.filter(operator => currentField.customOperators.includes(operator.value))
          : DEFAULT_COMPARISON_OPTIONS
      }

      dispatch(
        enhancedSearchActions.editChip({
          selectedFieldIndex: index,
          step,
          currentField: values[index],
          previousOption: values[selectedFieldIndex],
          options,
        }),
      )
    },
    [selectedFieldIndex, disabled, dispatch, values],
  )

  const handleSearch = useCallback(
    ({
      event,
      reason,
      step,
      type,
    }: {
      event: ChangeEvent<{ value: string }>
      reason: AutocompleteInputChangeReason
      step: SearchStep
      type?: FILTER_TYPES
    }) => {
      if (FORBID_SEARCH_FOR_TYPE[type] && step === SearchStep.Third) {
        return
      }
      if (reason === Reason.INPUT) {
        dispatch(enhancedSearchActions.setSearchValue(event.target.value.replace(/[*\\]/g, '')))
      }

      if (reason === Reason.CLEAR) {
        dispatch(enhancedSearchActions.setSearchValue(''))
      }
    },
    [dispatch],
  )

  const handleClose = useCallback(() => {
    if (disabled || step === SearchStep.Third) {
      return
    }

    const currentField = values[selectedFieldIndex]

    if (step === SearchStep.First || !values.length || isNoChipValue(currentField)) {
      dispatch(enhancedSearchActions.setCurrentOptionsShow({ show: false }))
      return
    }
    dispatch(enhancedSearchActions.resetStep({ fields, values, step, currentField: values[selectedFieldIndex] }))
  }, [selectedFieldIndex, disabled, dispatch, fields, step, values])

  const handleDeleteAllChips = useCallback(() => {
    if (disabled) {
      return
    }

    onChange({}, '')

    dispatch(enhancedSearchActions.removeAllChips({ fields }))
  }, [disabled, dispatch, fields, onChange])

  const handleOptionValueChange = useCallback(
    (newValue, keepOptions = false) => {
      if (disabled) {
        return
      }

      const currentField = values[selectedFieldIndex]
      const newValues = [...values]

      newValues[selectedFieldIndex] = { ...newValues[selectedFieldIndex], value: newValue }

      onChange(convertEnhancedSearchValuesForCallback(newValues), currentField.dataKey)

      dispatch(
        enhancedSearchActions.setOptionValue({
          values: newValues,
          newValue,
          selectedFieldIndex,
          fields,
          onChange,
          keepOptions: isArray(newValue) || keepOptions,
          currentField,
        }),
      )
    },
    [selectedFieldIndex, disabled, dispatch, fields, onChange, values],
  )

  return {
    handleChange,
    handleDeleteChip,
    handleEditChip,
    handleSearch,
    handleClose,
    handleDeleteAllChips,
    handleOptionValueChange,
  }
}

export const useOptionsInputBackspaceEventHandler = (optionsInputRef: React.RefObject<HTMLInputElement>) => {
  const {
    state: { values: allValues, selectedFieldIndex },
    dispatch,
  } = useEnhancedSearchContext()

  useEffect(() => {
    const handleBackspace = event => {
      event.stopPropagation()
      const currentField = allValues[selectedFieldIndex]
      if (event.key === 'Backspace' && !event.target.value) {
        if (isNoChipValue(currentField)) {
          const { options, newValues } = removeLastComparison({
            values: allValues,
            fieldIndex: selectedFieldIndex,
            currentField: allValues[selectedFieldIndex],
          })
          dispatch(enhancedSearchActions.removeOperator({ options, values: newValues }))
          optionsInputRef?.current?.blur()
        } else {
          const { newValues } = removeLastArrayValue({ values: allValues, fieldIndex: selectedFieldIndex, currentField })
          dispatch(
            enhancedSearchActions.removeLastValue({
              newValues,
              selectedFieldIndex,
              hideOptions: true,
            }),
          )
        }
      }
    }

    const optionsInputRefCurrent = optionsInputRef?.current

    optionsInputRefCurrent?.addEventListener('keydown', handleBackspace)

    return () => {
      optionsInputRefCurrent?.removeEventListener('keydown', handleBackspace)
    }
  }, [allValues, dispatch, selectedFieldIndex, optionsInputRef])
}

/**
 * useExternalValues hook updates EnhancedSearch state with values from the external store.
 * @param {EnhancedSearchInitialValue[]} externalValues Values from the external store.
 * @param {EnhancedFieldConfig[]} fields EnhancedSearch config props.
 * @param {function} dispatch The method returned from the useReducer React hook.
 */
export const useExternalValues = (
  externalValues: EnhancedSearchInitialValue[],
  fields: EnhancedFieldConfig[],
  dispatch: Dispatch<EnhanceSearchAction>,
) => {
  useEffect(() => {
    if (externalValues) {
      const values = prepareInitialValues(externalValues, fields)

      dispatch(enhancedSearchActions.setExternalValues({ values, fields }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalValues])
}
