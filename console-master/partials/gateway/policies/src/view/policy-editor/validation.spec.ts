//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { useTranslation } from 'react-i18next'

import { renderHook } from '@testing-library/react-hooks'

import { gatewayAppPolicyMock } from '@ues-data/gateway'
import { Config, Types } from '@ues-gateway/shared'

import { applicationIdsValidation, applicationsValidation } from './validation'

const {
  ALLOWED_ENVIRONMENT_VARIABLES,
  MAX_MOBILE_DEVICE_APP_ID_LENGTH,
  MAX_MOBILE_DEVICE_APP_ID_COUNT,
  MAX_WINDOWS_PATH_LENGTH,
  MAX_WINDOWS_APPS_COUNT,
  GATEWAY_TRANSLATIONS_KEY,
  WINDOWS_PATH_RESERVED_CHARACTERS,
} = Config

describe('Validate', () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation(GATEWAY_TRANSLATIONS_KEY))
  const androidRowDataName = gatewayAppPolicyMock[0].platforms.Android.perAppVpn.appIds[0]
  const editAndroidRowData = { indexInParentArray: 0, name: androidRowDataName, value: androidRowDataName }

  const getWindowsRowData = (parentType: Types.WindowsPerAppVpnItemsType) => {
    const windowsRowDataName = gatewayAppPolicyMock[0].platforms.Windows.perAppVpn[parentType][0]

    return {
      indexInParentArray: 0,
      name: windowsRowDataName,
      value: windowsRowDataName,
      parentType,
    }
  }

  const getWindowsApplicationData = ({
    isAddMode,
    type,
    value,
  }: {
    isAddMode: boolean
    type: Types.WindowsPerAppVpnItemsType
    value: string | string[]
  }) => {
    return {
      value,
      isAddMode,
      type,
      rowData: isAddMode ? undefined : getWindowsRowData(type),
      localPolicyData: gatewayAppPolicyMock[0],
      t,
    }
  }

  describe('App Ids', () => {
    describe('should return ValidationResult when', () => {
      const TOO_LONG_APP_ID = `${'app.id.test.com'.repeat(32)}1`

      it(`app id length is longer than ${MAX_MOBILE_DEVICE_APP_ID_LENGTH}`, () => {
        expect(applicationIdsValidation([TOO_LONG_APP_ID], true, gatewayAppPolicyMock[0], undefined, t)).toBe(
          'policies.appIdFieldMaxLengthValidationMessage',
        )

        expect(applicationIdsValidation(TOO_LONG_APP_ID, false, gatewayAppPolicyMock[0], editAndroidRowData, t)).toBe(
          'policies.appIdFieldMaxLengthValidationMessage',
        )
      })

      it(`app ids count is higher than ${MAX_MOBILE_DEVICE_APP_ID_COUNT}`, () => {
        const APP_IDS = Array.from({ length: MAX_MOBILE_DEVICE_APP_ID_COUNT }).map((_, index) => `app.test.com${index}`)

        expect(applicationIdsValidation(APP_IDS, true, gatewayAppPolicyMock[0], undefined, t)).toBe('policies.appIdsMaxAmount')
      })

      it('app id is empty', () => {
        const TOO_LONG_APP_ID = `${'app.id.test.com '.repeat(200)}\n`

        expect(applicationIdsValidation([TOO_LONG_APP_ID], true, gatewayAppPolicyMock[0], undefined, t)).toBe(
          'policies.appIdFieldMaxLengthValidationMessage',
        )

        expect(applicationIdsValidation(TOO_LONG_APP_ID, false, gatewayAppPolicyMock[0], editAndroidRowData, t)).toBe(
          'policies.appIdFieldMaxLengthValidationMessage',
        )
      })

      it('app id already exists', () => {
        const existingAppId = gatewayAppPolicyMock[0].platforms.Android.perAppVpn.appIds[1]

        expect(applicationIdsValidation([existingAppId], true, gatewayAppPolicyMock[0], undefined, t)).toBe(
          'policies.recurringEntriesValidationMessage',
        )

        expect(applicationIdsValidation(existingAppId, false, gatewayAppPolicyMock[0], editAndroidRowData, t)).toBe(
          'policies.recurringEntriesValidationMessage',
        )
      })
    })

    describe('should return no error when', () => {
      const CORRECT_APP_ID = 'app.id33.com'

      it(`app id not exists`, () => {
        expect(applicationIdsValidation([CORRECT_APP_ID], true, gatewayAppPolicyMock[0], undefined, t)).toBe(undefined)

        expect(applicationIdsValidation(CORRECT_APP_ID, false, gatewayAppPolicyMock[0], editAndroidRowData, t)).toBe(undefined)
      })
    })
  })

  describe('Applications', () => {
    describe('should return ValidationResult when', () => {
      it(`application length is longer than ${MAX_WINDOWS_PATH_LENGTH}`, () => {
        const TOO_LONG_APP_ID = `${'app.id.test.com'.repeat(32)}1`
        const TOO_LONG_PATH = `C:\\custom\\${'subFolder\\'.repeat(32)}app.exe`

        const addAppIdValidationData = getWindowsApplicationData({
          value: [TOO_LONG_APP_ID],
          isAddMode: true,
          type: Types.WindowsPerAppVpnItemsType.AppIds,
        })
        const editAppIdValidationData = getWindowsApplicationData({
          value: TOO_LONG_APP_ID,
          isAddMode: false,
          type: Types.WindowsPerAppVpnItemsType.AppIds,
        })
        const addPathValidationData = getWindowsApplicationData({
          value: [TOO_LONG_PATH],
          isAddMode: true,
          type: Types.WindowsPerAppVpnItemsType.Paths,
        })
        const editPathValidationData = getWindowsApplicationData({
          value: TOO_LONG_PATH,
          isAddMode: false,
          type: Types.WindowsPerAppVpnItemsType.Paths,
        })

        expect(applicationsValidation(addPathValidationData)).toBe('general/form:validationErrors.maxLength')
        expect(applicationsValidation(editPathValidationData)).toBe('general/form:validationErrors.maxLength')

        expect(applicationsValidation(addAppIdValidationData)).toBe('general/form:validationErrors.maxLength')
        expect(applicationsValidation(editAppIdValidationData)).toBe('general/form:validationErrors.maxLength')
      })

      it(`applications count is higher than ${MAX_WINDOWS_APPS_COUNT}`, () => {
        const APP_IDS = Array.from({ length: MAX_WINDOWS_APPS_COUNT }).map((_, index) => `app.test.com${index}`)
        const validationData = getWindowsApplicationData({
          value: APP_IDS,
          isAddMode: true,
          type: Types.WindowsPerAppVpnItemsType.AppIds,
        })

        expect(applicationsValidation(validationData)).toBe('policies.windowsApplicationsCountMessage')
      })

      it('application already exists', () => {
        const ERROR_MESSAGE = 'policies.recurringEntriesValidationMessage'
        const existingAppId = gatewayAppPolicyMock[0].platforms.Windows.perAppVpn.appIds[1]
        const existingPath = gatewayAppPolicyMock[0].platforms.Windows.perAppVpn.paths[1]

        const addAppIdsValidationData = getWindowsApplicationData({
          value: [existingAppId],
          isAddMode: true,
          type: Types.WindowsPerAppVpnItemsType.AppIds,
        })
        const editAppIdsValidationData = getWindowsApplicationData({
          value: existingAppId,
          isAddMode: false,
          type: Types.WindowsPerAppVpnItemsType.AppIds,
        })
        const addPathsValidationData = getWindowsApplicationData({
          value: [existingPath],
          isAddMode: true,
          type: Types.WindowsPerAppVpnItemsType.Paths,
        })
        const editPathsValidationData = getWindowsApplicationData({
          value: existingPath,
          isAddMode: false,
          type: Types.WindowsPerAppVpnItemsType.Paths,
        })

        expect(applicationsValidation(addAppIdsValidationData)).toBe(ERROR_MESSAGE)
        expect(applicationsValidation(editAppIdsValidationData)).toBe(ERROR_MESSAGE)

        expect(applicationsValidation(addPathsValidationData)).toBe(ERROR_MESSAGE)
        expect(applicationsValidation(editPathsValidationData)).toBe(ERROR_MESSAGE)
      })

      it('path not start with the drive letter and an environment variable', () => {
        const INCORRECT_PATH = 'path:\\folder'
        const addPathValidationData = getWindowsApplicationData({
          value: [INCORRECT_PATH],
          isAddMode: true,
          type: Types.WindowsPerAppVpnItemsType.Paths,
        })
        const editPathValidationData = getWindowsApplicationData({
          value: INCORRECT_PATH,
          isAddMode: false,
          type: Types.WindowsPerAppVpnItemsType.Paths,
        })

        expect(applicationsValidation(addPathValidationData)).toBe('policies.windowsPathDriveLetterValidationMessage')
        expect(applicationsValidation(editPathValidationData)).toBe('policies.windowsPathDriveLetterValidationMessage')
      })

      it('path end with a period or a backslash', () => {
        const INCORRECT_PATH_WITH_DOT = 'C:\\folder.'
        const INCORRECT_PATH_WITH_BACKSLASH = 'C:\\folder\\'

        const addPathWithDotValidationData = getWindowsApplicationData({
          value: [INCORRECT_PATH_WITH_DOT],
          isAddMode: true,
          type: Types.WindowsPerAppVpnItemsType.Paths,
        })
        const editPathWithDotValidationData = getWindowsApplicationData({
          value: INCORRECT_PATH_WITH_DOT,
          isAddMode: false,
          type: Types.WindowsPerAppVpnItemsType.Paths,
        })
        const addPathWithBackslashValidationData = getWindowsApplicationData({
          value: [INCORRECT_PATH_WITH_BACKSLASH],
          isAddMode: true,
          type: Types.WindowsPerAppVpnItemsType.Paths,
        })
        const editPathWithBackslashValidationData = getWindowsApplicationData({
          value: INCORRECT_PATH_WITH_BACKSLASH,
          isAddMode: false,
          type: Types.WindowsPerAppVpnItemsType.Paths,
        })

        expect(applicationsValidation(addPathWithDotValidationData)).toBe('policies.windowsPathEndPeriodValidationMessage')
        expect(applicationsValidation(editPathWithDotValidationData)).toBe('policies.windowsPathEndPeriodValidationMessage')
        expect(applicationsValidation(addPathWithBackslashValidationData)).toBe('policies.windowsPathEndPeriodValidationMessage')
        expect(applicationsValidation(editPathWithBackslashValidationData)).toBe('policies.windowsPathEndPeriodValidationMessage')
      })

      it('path includes a reserved character', () => {
        const INCORRECT_PATH = `C:\\folder${WINDOWS_PATH_RESERVED_CHARACTERS[1]}`

        const addPathValidationData = getWindowsApplicationData({
          value: [INCORRECT_PATH],
          isAddMode: true,
          type: Types.WindowsPerAppVpnItemsType.Paths,
        })
        const editPathValidationData = getWindowsApplicationData({
          value: INCORRECT_PATH,
          isAddMode: false,
          type: Types.WindowsPerAppVpnItemsType.Paths,
        })

        expect(applicationsValidation(addPathValidationData)).toBe('policies.windowsPathReservedCharacterValidationMessage')
        expect(applicationsValidation(editPathValidationData)).toBe('policies.windowsPathReservedCharacterValidationMessage')
      })

      it('path have two consecutive backslashes', () => {
        const INCORRECT_PATH = 'C:\\folder\\\\subFolder'

        const addPathValidationData = getWindowsApplicationData({
          value: [INCORRECT_PATH],
          isAddMode: true,
          type: Types.WindowsPerAppVpnItemsType.Paths,
        })
        const editPathValidationData = getWindowsApplicationData({
          value: INCORRECT_PATH,
          isAddMode: false,
          type: Types.WindowsPerAppVpnItemsType.Paths,
        })

        expect(applicationsValidation(addPathValidationData)).toBe('policies.windowsPathConsecutiveBackslashesValidationMessage')
        expect(applicationsValidation(editPathValidationData)).toBe('policies.windowsPathConsecutiveBackslashesValidationMessage')
      })

      it('app id include spaces', () => {
        const INCORRECT_APP_ID = 'com.blackberry .bbm'
        const addAppIdValidationData = getWindowsApplicationData({
          value: [INCORRECT_APP_ID],
          isAddMode: true,
          type: Types.WindowsPerAppVpnItemsType.AppIds,
        })
        const editAppIdValidationData = getWindowsApplicationData({
          value: INCORRECT_APP_ID,
          isAddMode: false,
          type: Types.WindowsPerAppVpnItemsType.AppIds,
        })

        expect(applicationsValidation(addAppIdValidationData)).toBe('general/form:validationErrors.noSpaces')
        expect(applicationsValidation(editAppIdValidationData)).toBe('general/form:validationErrors.noSpaces')
      })
    })

    describe('should return no error when', () => {
      it(`app id is valid`, () => {
        const CORRECT_APP_ID = 'com.blackberry.bbm'
        const addAppIdsValidationData = getWindowsApplicationData({
          value: [CORRECT_APP_ID],
          isAddMode: true,
          type: Types.WindowsPerAppVpnItemsType.AppIds,
        })
        const editAppIdsValidationData = getWindowsApplicationData({
          value: CORRECT_APP_ID,
          isAddMode: false,
          type: Types.WindowsPerAppVpnItemsType.AppIds,
        })

        expect(applicationsValidation(addAppIdsValidationData)).toBe(undefined)
        expect(applicationsValidation(editAppIdsValidationData)).toBe(undefined)
      })

      it(`path is valid and start with the drive letter`, () => {
        const CORRECT_PATH_WITH_DRIVE_LETTER = 'C:\\folder\\subFolder\\app.exe'
        const CORRECT_PATH_WITH_ENVIRONMENT = `${ALLOWED_ENVIRONMENT_VARIABLES[0]}\\folder\\subFolder\\app.exe`

        const addPathsValidationDataWithDriveLetter = getWindowsApplicationData({
          value: [CORRECT_PATH_WITH_DRIVE_LETTER],
          isAddMode: true,
          type: Types.WindowsPerAppVpnItemsType.Paths,
        })
        const editPathsValidationDataWithDriveLetter = getWindowsApplicationData({
          value: CORRECT_PATH_WITH_DRIVE_LETTER,
          isAddMode: false,
          type: Types.WindowsPerAppVpnItemsType.Paths,
        })
        const addPathsValidationDataWithEnvironmentVariable = getWindowsApplicationData({
          value: [CORRECT_PATH_WITH_ENVIRONMENT],
          isAddMode: true,
          type: Types.WindowsPerAppVpnItemsType.Paths,
        })
        const editPathsValidationDataWithEnvironmentVariable = getWindowsApplicationData({
          value: CORRECT_PATH_WITH_ENVIRONMENT,
          isAddMode: false,
          type: Types.WindowsPerAppVpnItemsType.Paths,
        })

        expect(applicationsValidation(addPathsValidationDataWithDriveLetter)).toBe(undefined)
        expect(applicationsValidation(editPathsValidationDataWithDriveLetter)).toBe(undefined)
        expect(applicationsValidation(addPathsValidationDataWithEnvironmentVariable)).toBe(undefined)
        expect(applicationsValidation(editPathsValidationDataWithEnvironmentVariable)).toBe(undefined)
      })
    })
  })
})
