import { OperatingMode, RiskLevelTypes } from '../../../model'
import type { GeneralSettingsOptions, RiskEnginesSettingsOptions, SettingsOptions } from '../../ues'

export const UESGeneralSettingsQueryMock: GeneralSettingsOptions = {
  generalSettings: {
    tenantSettings: { operatingMode: OperatingMode.PASSIVE },
  },
}

export const UESRiskEnginesSettingsQueryMock: RiskEnginesSettingsOptions = {
  riskEnginesSettings: {
    networkAnomalyDetection: { enabled: true, riskLevel: RiskLevelTypes.HIGH, range: { min: 80, max: 100 } },
  },
}

export const UESSettingsQueryMock: SettingsOptions = {
  ...UESGeneralSettingsQueryMock,
  ...UESRiskEnginesSettingsQueryMock,
}

export const UESSettingsMutationMock = UESGeneralSettingsQueryMock
