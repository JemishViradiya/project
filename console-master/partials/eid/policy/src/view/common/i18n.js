/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { useTranslation as useTranslationReact } from 'react-i18next'

export const i18NameBase = 'policy'
export const i18CommonNameBase = 'common'
export const i18NameSpace = 'eid/common'

export function getI18Name(name) {
  return `${i18NameBase}.${name}`
}

export function getI18CommonName(name) {
  return `${i18CommonNameBase}.${name}`
}

export function getI18LabelName(name) {
  return `${getI18Name(name)}Label`
}

export function useTranslation() {
  return useTranslationReact(i18NameSpace)
}

export function getI18PolicyOperationError(policyOperation) {
  return `${getI18Name('serverError')}.${policyOperation}`
}
