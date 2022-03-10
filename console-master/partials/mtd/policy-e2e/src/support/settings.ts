/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { FeatureName } from '@ues-data/shared-types'
import type { FORM_REFS, TAB } from '@ues-mtd/policy/mocks'
import { getI18EnumName, getI18Name } from '@ues-mtd/policy/mocks'

export const beVisible = 'be.visible'
export const beDisabled = 'be.disabled'
export const beEnabled = 'not.be.disabled'
export const beChecked = 'be.checked'
export const beUnchecked = 'not.be.checked'
export const notExist = 'not.exist'
export const haveValue = 'have.value'
export const notBeVisible = 'not.be.visible'
export const exist = 'exist'
export const notBeChecked = 'not.be.checked'
export const haveAttr = 'have.attr'
export const notHaveAttr = 'not.have.attr'

// The data is hardcoded to match against the mock list data within ecs-bff-platform
export const mockPolicyGuid = '9906e78b-4ccc-4080-8b6c-fd2367c45d02'
export const policyName = 'CyTest'
export const policyDescription = 'Desc'

export enum NEUTRAL_TOGGLE_NAMES {
  dataPrivacyEnabled,
}

export enum NEUTRAL_TEXT_NAMES {
  name,
  description,
}

export enum NEUTRAL_SPIN_NAMES {
  warningNotificationsCount,
  warningNotificationsInterval,
}

export enum ANDROID_SPIN_NAMES {
  androidMaliciousAppWifiMaxSize,
  androidMaliciousAppWifiMaxMonthly,
}

export enum ANDROID_TOGGLE_NAMES {
  androidPrivilegeEscalationEnabled,
  androidHwAttestationEnabled,
  androidSafetynetAttestationEnabled,
  androidSafetynetAttestationCtsEnabled,
  androidMaliciousAppEnabled,
  androidSideLoadedAppEnabled,
  androidMessageScanningEnabled,
  androidCompromisedNetworkEnabled,
  androidInsecureWifiEnabled,
  androidEncryptionDisabled,
  androidScreenLockDisabled,
  androidKnoxAttestationEnabled,
  androidDeveloperModeDetectionEnabled,
  androidUnsupportedOsEnabled,
}

export enum NEUTRAL_COMBOBOX_NAMES {
  warningNotificationsIntervalType,
}

export enum ANDROID_COMBOBOX_NAMES {
  androidHwAttestationSecurityLevel,
  androidMessageScanningOption,
}

export enum IOS_COMBOBOX_NAMES {
  iosMessageScanningOption,
}

export enum IOS_TOGGLE_NAMES {
  iosPrivilegeEscalationEnabled,
  iosIntegrityCheckAttestationEnabled,
  iosSideLoadedAppEnabled,
  iosMessageScanningEnabled,
  iosCompromisedNetworkEnabled,
  iosScreenLockDisabled,
  iosUnsupportedOsEnabled,
}

export enum CHECKBOX_STATE {
  CHECKED,
  UNCHECKED,
  INDETERMINATE,
}

export enum ANDROID_NOTIFY_ELEMENT {
  androidMaliciousAppEnabled,
  androidSideLoadedAppEnabled,
  androidPrivilegeEscalationEnabled,
  androidScreenLockDisabled,
  androidKnoxAttestationEnabled,
  androidDeveloperModeDetectionEnabled,
  androidEncryptionDisabled,
  androidUnsupportedOsEnabled,
  androidHwAttestationEnabled,
  androidSafetynetAttestationEnabled,
  androidHwAttestationSecurityPatchEnabled,
  androidCompromisedNetworkEnabled,
  androidMessageScanningEnabled,
  androidInsecureWifiEnabled,
  androidUnsupportedModelEnabled,
}

export enum IOS_NOTIFY_ELEMENT {
  iosUnsupportedModelEnabled,
  iosSideLoadedAppEnabled,
  iosPrivilegeEscalationEnabled,
  iosScreenLockDisabled,
  iosUnsupportedOsEnabled,
  iosIntegrityCheckAttestationEnabled,
  iosCompromisedNetworkEnabled,
}

export const getLabel = (name: string): string => {
  return I.translate(getI18Name(name))
}

export const getCheckbox = (selector: string) => {
  return I.findByRole('checkbox', { name: getLabel(selector) })
}

export const getButtonBase = (name: string) => {
  return I.findByRole('button', { name: name })
}

export const getButton = (localeName: string) => {
  return getButtonBase(getLabel(localeName))
}

export const getTabButton = (tab: TAB) => {
  return getButton(`${tab}.tabLabel`)
}

export const getTextBox = (selector: string) => {
  return I.findByRole('textbox', { name: getLabel(selector) })
}

export const getGeneric = (name: string) => {
  return I.findByRole('generic', { name: name })
}

export const getGenericLabel = (name: string) => {
  return getGeneric(getLabel(name))
}

export function getI18LabelName(name) {
  return `${getI18Name(name)}Label`
}

export const getReactSelectOption = (selector: string) => {
  return getGeneric(I.translate(getI18LabelName(selector)))
}

export const getSpinButton = (selector: string) => {
  return I.findByRole('spinbutton', { name: getLabel(selector) })
}

export const setLocalStorageState = () => {
  window.localStorage.clear()
  window.localStorage.setItem('UES_DATA_MOCK', 'true')
  window.localStorage.setItem(FeatureName.MockDataBypassMode, 'true')
  window.localStorage.setItem(FeatureName.MobileThreatDetection, 'true')
  window.localStorage.setItem(FeatureName.UESCronosNavigation, 'true')
  window.localStorage.setItem(FeatureName.MobileThreatDetectionUnsafeMsgThreat, 'true')
  window.localStorage.setItem(FeatureName.MobileThreatDetectionKnoxAttestationThreat, 'true')
  window.localStorage.setItem(FeatureName.MobileThreatDetectionDeveloperModeThreat, 'true')
  window.localStorage.setItem(FeatureName.PermissionChecksEnabled, 'true')
  window.localStorage.setItem(FeatureName.MobileThreatDetectionReportingOnlyMode, 'true')
  window.localStorage.setItem(FeatureName.MobileThreatDetectionUnresponsiveAgentThreat, 'true')
}

export const getLeftLabel = (ref: FORM_REFS): string => {
  return I.translate(`mtd/common:policy.${ref}Left`)
}

export const getRightLabel = (ref: FORM_REFS): string => {
  return I.translate(`mtd/common:${ref}Right`)
}

export const toggleSwitch = (name: string, payloadToValidate) => {
  if (payloadToValidate[name] === true) {
    getCheckbox(name).should(beChecked).should(beEnabled).uncheck().should(beUnchecked)
    payloadToValidate[name] = false // keep payload current
  } else {
    getCheckbox(name).should(beUnchecked).should(beEnabled).check().should(beChecked)
    payloadToValidate[name] = true // keep payload current
  }
}

export const copyItem = itemToCopy => {
  return JSON.parse(JSON.stringify(itemToCopy))
}

export const validateReactSelectOption = (selector: string, option: string) => {
  getReactSelectOption(selector).contains(I.translate(getI18EnumName(selector, option)) as string)
}

export const chooseReactSelectOption = (selector: string, option: string) => {
  getReactSelectOption(selector)
    .type(option + '{enter}')
    .contains(I.translate(getI18EnumName(selector, option)) as string)
}

export const getBadge = (tab: TAB) => {
  // TODO - remove this anti-pattern class lookup when proper badge support is provided
  return getTabButton(tab).parent().find('span[class*=MuiBadge-badge]')
}

export const verifyNoBadge = (tab: TAB) => {
  getBadge(tab).should(notExist)
}

export const verifyBadge = (tab: TAB) => {
  getBadge(tab).should(beVisible)
}

export const getSubmitButton = (isCreate: boolean) => {
  return isCreate ? getButton('create.addButtonLabel') : getButton('saveButtonLabel')
}

export const validate = (body, payload, element: FORM_REFS) => {
  if (body[element] !== [] && payload[element] !== undefined) {
    expect(body[element]?.sort()).to.deep.equals(payload[element]?.sort())
  }
  body[element] = payload[element] = undefined
}

export const getDialog = () => {
  return I.findByRole('dialog')
}

export const getDialogButton = (text: string) => {
  // return getDialog().find('button').findByText(text)
  return getDialog().findByRole('button', { name: text })
}

export const getDialogCheckbox = (text: string) => {
  return getDialog().findByRole('checkbox', { name: text })
}

// react-virtualized-tree has pointer-events: none, so without force: true all checkboxes under it are not clickable by cypress
export const clickVirtualizedCheckbox = (text: string): void => {
  getDialogCheckbox(text).click({ force: true })
}

export const verifyErrorMsg = (text: string) => {
  I.findByText(text)
}

export const getTable = (selector: string) => {
  return I.findByRole('table', { name: getLabel(selector) }).scrollIntoView()
}

export const getCheckboxInTable = (row: number, parentElement?: Cypress.Chainable<JQuery<HTMLElement>>) => {
  const rowName = 'select-' + (row - 1).toString()
  return (parentElement ? parentElement : I).findByRole('cell', { name: rowName }).findByRole('checkbox')
}
