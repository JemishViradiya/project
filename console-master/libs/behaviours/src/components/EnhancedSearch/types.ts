//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { RiskLevel } from '@ues-data/shared'

import type { FILTER_TYPES, NumericFilterUnits } from '../../filters'
import type { RiskSliderProps } from '../Risk'
import type { FilterOptions } from '../Table'

export enum EnhancedSearchComparisonType {
  Contains = '=',
  DoesNotContain = '!=',
  StartsWith = '[--',
  EndsWith = '--]',
  Greater = '>',
  GreaterOrEqual = '>=',
  Less = '<',
  LessOrEqual = '<=',
}

export interface EnhancedSearchComparisonField {
  label?: string
  value?: EnhancedSearchComparisonType | string
}

export enum SearchStep {
  First = 0,
  Second = 1,
  Third = 2,
}

export enum Reason {
  DELETE = 'delete',
  EDIT = 'edit',
  CLEAR = 'clear',
  INPUT = 'input',
  SELECT_OPTION = 'select-option',
}

export interface EnhancedSearchStyleProps {
  condensed: boolean
  isStandardList: boolean
}

export interface EnhancedSearchFieldOption extends FilterOptions {
  checked?: boolean
  disabled?: boolean
}

export interface ChipValueRendererProps<T = EnhancedSearchChipValue> {
  field: {
    value: T
    unit?: NumericFilterUnits
  }
  separator?: string
}

export type EnhancedSearchRiskFieldProps = Pick<RiskSliderProps, 'withSecured'>

export interface EnhancedSearchListFieldProps extends EnhancedSearchAsyncFieldProps {
  onFetchMore?: (args: { offset: number; searchValue?: string }) => void
  onSearch?: (searchValue?: string) => void
}

export interface EnhancedSearchAsyncFieldProps {
  loading: boolean
  options: EnhancedSearchFieldOption[]
  total?: number
}

export interface EnhancedSearchOnChangeValues {
  operator: EnhancedSearchComparisonType | string
  value: string | number | (string | number)[]
  dataKey: string
  type?: FILTER_TYPES | `${FILTER_TYPES}`
}

export interface EnhancedSearchInitialValue {
  operator: EnhancedSearchComparisonType | string
  value: EnhancedSearchChipValue | RiskLevel[]
  dataKey: string
}

export interface EnhancedSearchProps {
  disabled?: boolean
  fields: EnhancedFieldConfig[]
  condensed?: boolean
  showChipSeparator?: boolean
  onChange?: (data: EnhancedSearchOnChangeValues[], key: string) => void
  asyncFieldsProps?: Record<string, EnhancedSearchAsyncFieldProps>
  initialValues?: EnhancedSearchInitialValue[]
  placeholder?: string
  autoFocus?: boolean
  min?: number
  max?: number
  unit?: NumericFilterUnits
  externalValues?: EnhancedSearchInitialValue[]
}
export type EnhancedSearchChipValue = EnhancedSearchFieldOption | EnhancedSearchFieldOption[]

export interface EnhancedFieldConfig {
  allowDuplicate?: boolean
  preselectComparison?: boolean | EnhancedSearchComparisonType
  customOperators?: EnhancedSearchComparisonType[] | string[]
  dataKey: string
  label: string
  nestedOptions?: EnhancedSearchFieldOption[]
  options?: EnhancedSearchFieldOption[]
  type: FILTER_TYPES | `${FILTER_TYPES}`
  min?: number
  max?: number
  unit?: NumericFilterUnits
  riskProps?: EnhancedSearchRiskFieldProps
  listProps?: Pick<EnhancedSearchListFieldProps, 'onFetchMore' | 'onSearch'> & { searchValue?: string }
}

export interface EnhancedSearchChip extends EnhancedFieldConfig {
  comparison: EnhancedSearchComparisonField
  value: EnhancedSearchChipValue
}
