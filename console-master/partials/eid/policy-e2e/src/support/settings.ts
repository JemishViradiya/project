import { FeatureName } from '@ues-data/shared-types'

export const beVisible = 'be.visible'
export const beDisabled = 'be.disabled'
export const beEnabled = 'not.be.disabled'
export const beChecked = 'be.checked'
export const beUnchecked = 'not.be.checked'
export const notExist = 'not.exist'
export const haveValue = 'have.value'
export const notBeVisible = 'not.be.visible'
export const exist = 'exist'

export const mockPolicyGuid = '9906e78b-4ccc-4080-8b6c-fd2367c45d02'

export const setLocalStorageState = () => {
  window.localStorage.clear()
  window.localStorage.setItem('UES_DATA_MOCK', 'true')
  window.localStorage.setItem(FeatureName.MockDataBypassMode, 'true')
  window.localStorage.setItem(FeatureName.UESCronosNavigation, 'true')
  // Default posture for testcases - mst be explicitly called out as we don't want testcase failures when/if production features are changed
  window.localStorage.setItem(FeatureName.PermissionChecksEnabled, 'true')
  window.localStorage.setItem(FeatureName.PolicyAuthenticationBrowserFirstSeen, 'false')
  window.localStorage.setItem(FeatureName.PolicyAuthenticationException, 'true')
}

const i18NameBase = 'policy'
const i18CommonNameBase = 'common'

function getI18Name(name) {
  return `${i18NameBase}.${name}`
}

function getI18CommonName(name) {
  return `${i18CommonNameBase}.${name}`
}

export const getCommonLabel = (name: string): string => {
  return I.translate(getI18CommonName(name))
}

export const getLabel = (name: string): string => {
  return I.translate(getI18Name(name))
}
export const getButtonBase = (name: string) => {
  return I.findByRole('button', { name: name })
}

export const getButton = (localeName: string) => {
  return getButtonBase(getLabel(localeName))
}

export const getButtons = (localeName: string) => {
  return I.findAllByRole('button', { name: getLabel(localeName) })
}

export const getTextBox = (selector: string) => {
  return I.findByRole('textbox', { name: selector })
}

export const getTextBoxLabel = (selector: string) => {
  return I.findByRole('textbox', { name: getLabel(selector) })
}

export const getSubmitButton = (isCreate: boolean) => {
  return getButtonBase(getCommonLabel('save'))
}

export const getSaveAsButton = () => {
  return getButtonBase(getCommonLabel('saveAs'))
}
