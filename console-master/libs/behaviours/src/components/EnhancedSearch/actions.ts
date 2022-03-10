//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type {
  EnhancedFieldConfig,
  EnhancedSearchChip,
  EnhancedSearchChipValue,
  EnhancedSearchComparisonField,
  EnhancedSearchOnChangeValues,
  SearchStep,
} from './types'

export enum ActionType {
  setCurrentOptionsShow,
  setSearchValue,
  initNewChip,
  setOperator,
  setOptionValue,
  removeChip,
  removeLastValue,
  removeAllChips,
  editChip,
  resetStep,
  updateListProps,
  setSelectedFieldIndex,
  setExternalValues,
  removeOperator,
}

export interface SetCurrentOptionsShow {
  type: ActionType.setCurrentOptionsShow
  payload: {
    show: boolean
  }
}

export interface SetSearchValue {
  type: ActionType.setSearchValue
  payload: {
    value: string
  }
}

export interface InitNewChip {
  type: ActionType.initNewChip
  payload: {
    options: unknown[]
    values: EnhancedSearchChip[]
    step?: SearchStep
  }
}

export interface SetOperator {
  type: ActionType.setOperator
  payload: {
    values: EnhancedSearchChip[]
    fields: EnhancedFieldConfig[]
    valueExists: boolean
    hideOptions?: boolean
  }
}

export interface SetOptionValue {
  type: ActionType.setOptionValue
  payload: {
    values: EnhancedSearchChip[]
    newValue: EnhancedSearchChipValue
    selectedFieldIndex: number
    fields: EnhancedFieldConfig[]
    onChange: (data: EnhancedSearchOnChangeValues[], dataKey?: string) => void
    keepOptions?: boolean
    currentField: EnhancedSearchChip
  }
}

export interface RemoveChip {
  type: ActionType.removeChip
  payload: {
    fields: EnhancedFieldConfig[] | EnhancedSearchComparisonField[]
    values: EnhancedSearchChip[]
    selectedFieldIndex: number
    onChange: (data: EnhancedSearchOnChangeValues[], dataKey?: string) => void
    step: SearchStep
  }
}
export interface RemoveLastValue {
  type: ActionType.removeLastValue
  payload: {
    newValues: EnhancedSearchChip[]
    selectedFieldIndex: number
    hideOptions?: boolean
  }
}

export interface RemoveAllChips {
  type: ActionType.removeAllChips
  payload: {
    fields: EnhancedFieldConfig[]
  }
}

export interface EditChip {
  type: ActionType.editChip
  payload: {
    currentField: EnhancedSearchChip
    previousOption: EnhancedSearchChip
    selectedFieldIndex: number
    step: number
    options: unknown[]
  }
}

export interface ResetStep {
  type: ActionType.resetStep
  payload: {
    fields: EnhancedFieldConfig[]
    values: EnhancedSearchChip[]
    currentField: EnhancedSearchChip
    step: number
  }
}

export interface UpdateListProps {
  type: ActionType.updateListProps
  payload: {
    values: EnhancedSearchChip[]
    searchValue: string
    selectedFieldIndex: number
    currentField: EnhancedSearchChip
  }
}

export interface SetExternalValues {
  type: ActionType.setExternalValues
  payload: {
    fields: EnhancedFieldConfig[]
    values: EnhancedSearchChip[]
  }
}

export interface RemoveOperator {
  type: ActionType.removeOperator
  payload: {
    options: unknown[]
    values: EnhancedSearchChip[]
    step?: SearchStep
  }
}

export type EnhanceSearchAction =
  | SetCurrentOptionsShow
  | SetSearchValue
  | InitNewChip
  | SetOperator
  | SetOptionValue
  | RemoveChip
  | RemoveLastValue
  | RemoveAllChips
  | EditChip
  | ResetStep
  | UpdateListProps
  | SetExternalValues
  | RemoveOperator

export const setCurrentOptionsShow = ({ show }: SetCurrentOptionsShow['payload']): SetCurrentOptionsShow => ({
  type: ActionType.setCurrentOptionsShow,
  payload: { show },
})

export const setSearchValue = (value: string): SetSearchValue => ({
  type: ActionType.setSearchValue,
  payload: { value },
})

export const initNewChip = ({ options, values, step }: InitNewChip['payload']): InitNewChip => ({
  type: ActionType.initNewChip,
  payload: { values, options, step },
})

export const setOperator = ({ values, fields, valueExists, hideOptions }: SetOperator['payload']): SetOperator => ({
  type: ActionType.setOperator,
  payload: {
    values,
    fields,
    valueExists,
    hideOptions,
  },
})

export const setOptionValue = ({
  values,
  newValue,
  selectedFieldIndex,
  fields,
  onChange,
  keepOptions,
  currentField,
}: SetOptionValue['payload']): SetOptionValue => ({
  type: ActionType.setOptionValue,
  payload: {
    values,
    newValue,
    selectedFieldIndex,
    fields,
    onChange,
    keepOptions,
    currentField,
  },
})

export const removeChip = ({ fields, values, selectedFieldIndex, onChange, step }: RemoveChip['payload']): RemoveChip => ({
  type: ActionType.removeChip,
  payload: { fields, values, selectedFieldIndex, onChange, step },
})

export const removeLastValue = ({ newValues, selectedFieldIndex, hideOptions }: RemoveLastValue['payload']): RemoveLastValue => ({
  type: ActionType.removeLastValue,
  payload: { newValues, selectedFieldIndex, hideOptions },
})

export const removeAllChips = ({ fields }: RemoveAllChips['payload']): RemoveAllChips => ({
  type: ActionType.removeAllChips,
  payload: { fields },
})

export const editChip = ({ selectedFieldIndex, step, currentField, previousOption, options }: EditChip['payload']): EditChip => ({
  type: ActionType.editChip,
  payload: { selectedFieldIndex, step, currentField, previousOption, options },
})

export const resetStep = ({ fields, values, step, currentField }: ResetStep['payload']): ResetStep => ({
  type: ActionType.resetStep,
  payload: { fields, values, step, currentField },
})

export const updateListProps = ({
  values,
  searchValue,
  selectedFieldIndex,
  currentField,
}: UpdateListProps['payload']): UpdateListProps => ({
  type: ActionType.updateListProps,
  payload: { values, searchValue, selectedFieldIndex, currentField },
})

export const setExternalValues = ({ fields, values }: SetExternalValues['payload']): SetExternalValues => ({
  type: ActionType.setExternalValues,
  payload: {
    fields,
    values,
  },
})

export const removeOperator = ({ options, values, step }: RemoveOperator['payload']): RemoveOperator => ({
  type: ActionType.removeOperator,
  payload: { values, options, step },
})
