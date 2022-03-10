/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { MutableRefObject } from 'react'
import React, { createContext, memo, useContext, useRef } from 'react'

import { TableSortDirection } from '@ues/behaviours'

import { FORM_REFS } from './settings'

const ReferenceContext = createContext({
  setRef: (name: FORM_REFS, ref: any) => {
    /* dummy setRef handler */
  },
  getRef: (name: FORM_REFS) => undefined,
  focus: (name: FORM_REFS) => {
    /* dummy focus handler */
  },
  select: (name: FORM_REFS) => {
    /* dummy select handler */
  },
  isDirty: () => false,
  exists: (name: string) => false,
  getValue: (name: FORM_REFS, defaultValue: string) => undefined,
} as const)

export const ReferenceProvider = memo(({ children }) => {
  const _componentRefs: MutableRefObject<[]> = useRef([])

  const setRef = (name: FORM_REFS, ref: any) => (_componentRefs.current[name] = ref)

  const getRef = (name: FORM_REFS) => _componentRefs.current[name]

  const focus = (name: FORM_REFS) => {
    if (exists(name)) {
      _componentRefs.current[name].focus()
    }
  }

  const select = (name: FORM_REFS) => {
    if (exists(name)) {
      _componentRefs.current[name].select()
    }
  }

  const isDirty = () => exists(FORM_REFS.FORMIK_BAG) && _componentRefs.current[FORM_REFS.FORMIK_BAG].dirty

  const exists = (name: string) => _componentRefs && _componentRefs.current && _componentRefs.current[name]

  const getValue = (name: FORM_REFS, defaultValue: string): string => {
    if (exists(name)) {
      return _componentRefs.current[name].value
    }
    return defaultValue
  }

  return (
    <ReferenceContext.Provider value={{ setRef, getRef, focus, select, isDirty, exists, getValue }}>
      {children}
    </ReferenceContext.Provider>
  )
})

export const useReference = () => useContext(ReferenceContext)

export function sortByKey(array, sortCol) {
  const key = sortCol?.sortBy
  return array.sort(function (a, b) {
    const x = a[key] ? a[key] : '*'
    const y = b[key] ? b[key] : '*'
    const sort = x < y ? -1 : x > y ? 1 : 0
    return sortCol?.sortDir === TableSortDirection.Asc ? sort : sort * -1
  })
}
