/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { MutableRefObject } from 'react'
import React, { useRef } from 'react'

let componentRefs: MutableRefObject<[]>

export const ReferenceProvider = ({ children }): JSX.Element => {
  const _componentRefs: MutableRefObject<[]> = useRef([])
  React.useEffect(() => {
    componentRefs = _componentRefs
  }, [_componentRefs])
  return children
}

export enum FORM_REFS {
  FORMIK_BAG = 'formikBag',
  NAME = 'domain',
  WARNING_METHOD = 'warningMethod',
  WARNING_NOTIFCATION_COUNT = 'warningNotificationsCount',
}

export function setRef(name: FORM_REFS, ref: unknown): any {
  componentRefs.current[name] = ref
}

export function getRef(name: FORM_REFS) {
  return componentRefs.current[name]
}

export function focus(name: FORM_REFS) {
  if (exists(name)) {
    componentRefs.current[name].focus()
  }
}

export function select(name: FORM_REFS) {
  if (exists(name)) {
    componentRefs.current[name].select()
  }
}

export function isDirty(): boolean {
  return exists(FORM_REFS.FORMIK_BAG) && componentRefs.current[FORM_REFS.FORMIK_BAG].dirty
}

export function exists(name: string): boolean {
  return componentRefs && componentRefs.current && componentRefs.current[name]
}

export function getValue(name: FORM_REFS, defaultValue: string): string {
  if (exists(name)) {
    return componentRefs.current[name].value
  }
  return defaultValue
}
