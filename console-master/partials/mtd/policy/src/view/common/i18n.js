/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { useTranslation as useTranslationReact } from 'react-i18next'

const i18NameBase = 'policy'
export const i18NameSpace = ['mtd/common', 'general/form', 'profiles']

export function getI18Name(name) {
  return `mtd/common:${i18NameBase}.${name}`
}

export function getI18LabelName(name) {
  return `${getI18Name(name)}Label`
}

export function getI18HelpTextName(name) {
  return `${getI18Name(name)}HelperText`
}

export function getI18EnumName(name, key) {
  return `${getI18Name(name)}.${key}`
}

export function useTranslation() {
  return useTranslationReact(i18NameSpace)
}

export function getI18PolicyOperationError(policyOperation) {
  return `${getI18Name('serverError')}.${policyOperation}`
}

export function createMarkup(textToMarkup) {
  return { __html: textToMarkup }
}
