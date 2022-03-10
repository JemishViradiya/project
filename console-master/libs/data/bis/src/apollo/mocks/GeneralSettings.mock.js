import { OperatingMode } from '../../model'

export const GeneralSettingsQueryMock = {
  settings: {
    audit: { userName: 'Ah3kAK5AgYelfYP02D86hxk=', datetime: 1605171254507 },
    dataRetentionPeriod: 1, // must be always 1 to avoid infinite updateTimePeriod calls
    privacyMode: { mode: false },
    tenantSettings: { operatingMode: OperatingMode.Active },
  },
}

export const GeneralSettingsMutationMock = GeneralSettingsQueryMock
