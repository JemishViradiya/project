//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { flatten, uniq } from 'lodash-es'
import type { ValidateResult } from 'react-hook-form'

import type { Policy } from '@ues-data/gateway'
import { AccessControlBlockType, AccessControlType } from '@ues-data/gateway'
import { Config, Types, Utils } from '@ues-gateway/shared'

const { MAX_MOBILE_DEVICE_APP_ID_LENGTH, MAX_MOBILE_DEVICE_APP_ID_COUNT, MAX_WINDOWS_PATH_LENGTH, MAX_WINDOWS_APPS_COUNT } = Config
const { WindowsPerAppVpnItemsType } = Types

interface ValidatorsInterface extends MakeFieldValidationSchemaFnParams {
  maybeValues: string | string[]
}

type SupportedDataKey = 'applications' | 'appIds' | 'splitIpRanges' | AccessControlBlockType

const {
  isValidCIDR,
  isValidCIDRs,
  isValidDomainOrFQDN,
  isValidDomainsAndFQDNs,
  isValidIPOrRange,
  isValidIPsOrRanges,
  isPathStartWithDriveLetter,
  isPathStartWithEnvironmentVariable,
  isPathEndWithDotOrBackslash,
  isPathIncludesReservedCharacters,
  isPathIncludesConsecutiveBackslashes,
  isStringIncludeSpaces,
  isStringArrayIncludeSpaces,
} = Utils

interface MakeFieldValidationSchemaFnParams {
  rowData: Types.AccessControlListItem | Types.PolicyEditorListItem
  dataKey: SupportedDataKey
  localPolicyData: Partial<Policy>
  t: (translationKey: string, translationOptions?: Record<string, string | number>) => string
}

type MaybeValues = string | string[]

const VALIDATORS_ADD = {
  [AccessControlBlockType.Fqdns]: isValidDomainsAndFQDNs,
  [AccessControlBlockType.IpRanges]: isValidIPsOrRanges,
  splitIpRanges: isValidCIDRs,
  //TODO when appIds validation is specified update the validation function
  appIds: () => true,
}

const VALIDATORS_EDIT = {
  [AccessControlBlockType.Fqdns]: isValidDomainOrFQDN,
  [AccessControlBlockType.IpRanges]: isValidIPOrRange,
  splitIpRanges: isValidCIDR,
  //TODO when appIds validation is specified update the validation function
  appIds: () => true,
}

const VALIDATORS_ADD_MESSAGE = {
  [AccessControlBlockType.Fqdns]: 'networkServices.fqdnsValidationMessage',
  [AccessControlBlockType.IpRanges]: 'networkServices.ipRangesValidationMessage',
  splitIpRanges: 'policies.cidrsValidationMessage',
  appIds: 'policies.cidrsValidationMessage',
}

const VALIDATORS_EDIT_MESSAGE = {
  [AccessControlBlockType.Fqdns]: 'policies.fqdnValidationMessage',
  [AccessControlBlockType.IpRanges]: 'policies.ipRangeValidationMessage',
  splitIpRanges: 'policies.cidrValidationMessage',
  appIds: 'policies.cidrValidationMessage',
}

export const isTypeOfIPsOrFQDNs = (type: AccessControlBlockType): boolean =>
  [AccessControlBlockType.Fqdns, AccessControlBlockType.IpRanges].includes(type)

export const isAddModeFn = (rowData: MakeFieldValidationSchemaFnParams['rowData']): boolean => rowData === undefined

const resolveAddedEntries = (dataKey: SupportedDataKey, localPolicyData: Partial<Policy>) => {
  if (dataKey === 'splitIpRanges') {
    return localPolicyData?.splitIpRanges ?? []
  }

  if (dataKey === 'appIds') {
    return localPolicyData?.platforms?.Android?.perAppVpn?.appIds ?? []
  }

  if (dataKey === 'applications') {
    const appIds = localPolicyData?.platforms?.Windows?.perAppVpn?.appIds ?? []
    const paths = localPolicyData?.platforms?.Windows?.perAppVpn?.paths ?? []

    return [...appIds, ...paths]
  }

  return flatten(Object.values(AccessControlType).map(key => [...(localPolicyData?.[key]?.[dataKey] ?? [])]))
}

const validateRecurringEntryInEditMode = (
  value: string,
  dataKey: SupportedDataKey,
  localPolicyData: Partial<Policy>,
  rowData: MakeFieldValidationSchemaFnParams['rowData'],
) => {
  if (dataKey === 'splitIpRanges') {
    return localPolicyData.splitIpRanges[rowData.indexInParentArray] !== value
  }

  if (dataKey === 'appIds') {
    return localPolicyData?.platforms?.Android?.perAppVpn?.appIds[rowData.indexInParentArray] !== value
  }

  if (dataKey === 'applications') {
    return (
      localPolicyData?.platforms?.Windows?.perAppVpn?.[(rowData as Types.DeviceSettingsListItem).parentType][
        rowData.indexInParentArray
      ] !== value
    )
  }

  return localPolicyData[(rowData as Types.AccessControlListItem).parentType][dataKey][rowData.indexInParentArray] !== value
}

const validateRecurringEntries = (
  maybeValues: MaybeValues,
  dataKey: SupportedDataKey,
  localPolicyData: Partial<Policy>,
  rowData: MakeFieldValidationSchemaFnParams['rowData'],
) => {
  const addedEntries = resolveAddedEntries(dataKey, localPolicyData)

  const recurringEntries = uniq(flatten([maybeValues])).filter(entry => addedEntries.includes(entry))

  const hasError = isAddModeFn(rowData)
    ? recurringEntries.length > 0
    : validateRecurringEntryInEditMode(maybeValues as string, dataKey, localPolicyData, rowData) &&
      addedEntries.includes(maybeValues as string)

  const message = recurringEntries.join(', ')

  return { hasError, message }
}

const validateDefinition = (
  maybeValues: MaybeValues,
  dataKey: SupportedDataKey,
  rowData: MakeFieldValidationSchemaFnParams['rowData'],
) => {
  const hasError = isAddModeFn(rowData)
    ? !VALIDATORS_ADD[dataKey](maybeValues as string[])
    : !VALIDATORS_EDIT[dataKey](maybeValues as string)

  const message = isAddModeFn(rowData) ? VALIDATORS_ADD_MESSAGE[dataKey] : VALIDATORS_EDIT_MESSAGE[dataKey]

  return { hasError, message }
}

export const formValidators = ({ dataKey, localPolicyData, rowData, maybeValues, t }: ValidatorsInterface) => {
  const recurringEntriesValidation = validateRecurringEntries(maybeValues, dataKey, localPolicyData, rowData)

  if (recurringEntriesValidation.hasError) {
    return t('policies.recurringEntriesValidationMessage', {
      entries: recurringEntriesValidation.message,
    })
  }

  const definitionValidation = validateDefinition(maybeValues, dataKey, rowData)

  if (definitionValidation.hasError) {
    return t(definitionValidation.message)
  }
}

export const applicationIdsValidation = (
  value: unknown,
  isAddMode: boolean,
  data: Partial<Policy>,
  rowData: Types.PolicyEditorListItem,
  t: (translationKey: string, translationOptions?: Record<string, string | number>) => string,
) => {
  const currentAppIdsCount = data?.platforms?.Android?.perAppVpn?.appIds?.length ?? 0

  if (isAddMode && (value as string[])?.some(item => item.length > MAX_MOBILE_DEVICE_APP_ID_LENGTH)) {
    return t('policies.appIdFieldMaxLengthValidationMessage', {
      value: MAX_MOBILE_DEVICE_APP_ID_LENGTH,
    }) as ValidateResult
  }

  if (isAddMode && (value as string[])?.length + currentAppIdsCount > MAX_MOBILE_DEVICE_APP_ID_COUNT) {
    return t('policies.appIdsMaxAmount', { value: MAX_MOBILE_DEVICE_APP_ID_COUNT }) as ValidateResult
  }

  if (!isAddMode && (value as string)?.length > MAX_MOBILE_DEVICE_APP_ID_LENGTH) {
    return t('policies.appIdFieldMaxLengthValidationMessage', {
      value: MAX_MOBILE_DEVICE_APP_ID_LENGTH,
    }) as ValidateResult
  }

  return formValidators({
    dataKey: 'appIds',
    localPolicyData: data,
    rowData,
    maybeValues: isAddMode ? (value as string[]) : (value as string),
    t,
  })
}

const pathsAddModeValidation = (
  paths: string[],
  t: (translationKey: string, translationOptions?: Record<string, string | number>) => string,
) => {
  if (paths.some(item => !isPathStartWithDriveLetter(item) && !isPathStartWithEnvironmentVariable(item))) {
    return t('policies.windowsPathDriveLetterValidationMessage')
  }

  if (paths.some(item => isPathEndWithDotOrBackslash(item))) {
    return t('policies.windowsPathEndPeriodValidationMessage')
  }

  if (paths.some(item => isPathIncludesReservedCharacters(item))) {
    return t('policies.windowsPathReservedCharacterValidationMessage')
  }

  if (paths.some(item => isPathIncludesConsecutiveBackslashes(item))) {
    return t('policies.windowsPathConsecutiveBackslashesValidationMessage')
  }
}

const pathsEditModeValidation = (
  path: string,
  t: (translationKey: string, translationOptions?: Record<string, string | number>) => string,
) => {
  if (!isPathStartWithDriveLetter(path) && !isPathStartWithEnvironmentVariable(path)) {
    return t('policies.windowsPathDriveLetterValidationMessage')
  }

  if (isPathEndWithDotOrBackslash(path)) {
    return t('policies.windowsPathEndPeriodValidationMessage')
  }

  if (isPathIncludesReservedCharacters(path)) {
    return t('policies.windowsPathReservedCharacterValidationMessage')
  }

  if (isPathIncludesConsecutiveBackslashes(path)) {
    return t('policies.windowsPathConsecutiveBackslashesValidationMessage')
  }
}

export const applicationsValidation = ({
  value,
  isAddMode,
  localPolicyData,
  type,
  rowData,
  t,
}: {
  value: unknown
  isAddMode: boolean
  localPolicyData: Partial<Policy>
  type: Types.WindowsPerAppVpnItemsType
  rowData: Types.PolicyEditorListItem
  t: (translationKey: string, translationOptions?: Record<string, string | number>) => string
}) => {
  const applications = resolveAddedEntries('applications', localPolicyData)
  const currentApplicationsCount = applications.length ?? 0
  const recurringEntriesValidation = validateRecurringEntries(
    isAddMode ? (value as string[]) : (value as string),
    'applications',
    localPolicyData,
    rowData,
  )

  if (recurringEntriesValidation.hasError) {
    return t('policies.recurringEntriesValidationMessage', {
      entries: recurringEntriesValidation.message,
    })
  }

  if (isAddMode && (value as string[]).some(item => item.length > MAX_WINDOWS_PATH_LENGTH)) {
    return t('general/form:validationErrors.maxLength', { fieldName: 'The path', max: MAX_WINDOWS_PATH_LENGTH })
  }

  if (isAddMode && (value as string[])?.length + currentApplicationsCount > MAX_WINDOWS_APPS_COUNT) {
    return t('policies.windowsApplicationsCountMessage', { value: MAX_WINDOWS_APPS_COUNT })
  }

  if (!isAddMode && (value as string).length > MAX_WINDOWS_PATH_LENGTH) {
    return t('general/form:validationErrors.maxLength', { fieldName: 'The path', max: MAX_WINDOWS_PATH_LENGTH })
  }

  if (isAddMode && type === WindowsPerAppVpnItemsType.Paths) {
    return pathsAddModeValidation(value as string[], t)
  }

  if (!isAddMode && type === WindowsPerAppVpnItemsType.Paths) {
    return pathsEditModeValidation(value as string, t)
  }

  if (isAddMode && type === WindowsPerAppVpnItemsType.AppIds && isStringArrayIncludeSpaces(value as string[])) {
    return t('general/form:validationErrors.noSpaces')
  }

  if (!isAddMode && type === WindowsPerAppVpnItemsType.AppIds && isStringIncludeSpaces(value as string)) {
    return t('general/form:validationErrors.noSpaces')
  }
}
