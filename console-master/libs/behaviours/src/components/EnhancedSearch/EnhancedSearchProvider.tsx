//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { Dispatch } from 'react'
import React, { createContext, useContext, useMemo, useReducer } from 'react'
import { useTranslation } from 'react-i18next'

import type { EnhanceSearchAction } from './actions'
import * as enhancedSearchActions from './actions'
import { enhancedSearchReducer } from './reducer'
import type { EnhancedSearchChip, EnhancedSearchProps } from './types'
import { SearchStep } from './types'
import { prepareInitialValues } from './utils'

export const EnhancedSearchContext = createContext(null)

export const useEnhancedSearchContext = () =>
  useContext<{ state: EnhancedSearchState; dispatch: Dispatch<EnhanceSearchAction> }>(EnhancedSearchContext)

export enum StateKeys {
  SELECTED_FIELD_INDEX = 'selectedFieldIndex',
  STEP = 'step',
  OPTIONS_SHOW = 'optionsShow',
  SEARCH_VALUE = 'searchValue',
  OPTIONS = 'options',
  VALUES = 'values',
}

export type EnhancedSearchState = {
  [StateKeys.SELECTED_FIELD_INDEX]: number | null
  [StateKeys.STEP]: number
  [StateKeys.OPTIONS_SHOW]: boolean
  [StateKeys.SEARCH_VALUE]: string
  [StateKeys.OPTIONS]: unknown[]
  [StateKeys.VALUES]: EnhancedSearchChip[]
}

const initialState: EnhancedSearchState = {
  [StateKeys.SELECTED_FIELD_INDEX]: null,
  [StateKeys.STEP]: SearchStep.First,
  [StateKeys.OPTIONS_SHOW]: false,
  [StateKeys.SEARCH_VALUE]: '',
  [StateKeys.OPTIONS]: [],
  [StateKeys.VALUES]: [],
}

export const reducer = (state: EnhancedSearchState, payload: { [key: string]: EnhancedSearchState[keyof EnhancedSearchState] }) => {
  return {
    ...state,
    ...payload,
  }
}

export const EnhancedSearchProvider: React.FC<EnhancedSearchProps> = ({ fields, initialValues, children }): React.ReactElement => {
  const [state, dispatch] = useReducer(enhancedSearchReducer, {
    ...initialState,
    [StateKeys.OPTIONS]: fields,
    [StateKeys.VALUES]: initialValues ? prepareInitialValues(initialValues, fields) : [],
  })

  const value = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state, dispatch],
  )
  return <EnhancedSearchContext.Provider value={value}>{children}</EnhancedSearchContext.Provider>
}

export { enhancedSearchActions }
