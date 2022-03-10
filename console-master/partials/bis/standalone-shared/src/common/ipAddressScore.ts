import { RiskLevelTypes as RiskLevel, TrustLevel } from '@ues-data/bis/model'

import { getEngineRiskLevel } from './riskUtils'

const IpAddressSettingsScore = Object.freeze({
  [TrustLevel.UNTRUSTED]: 'scoreIfBlacklisted',
  [TrustLevel.UNDETECTED]: 'scoreIfNoIPAddress',
  [TrustLevel.UNDEFINED]: 'scoreIfNotInLists',
  [TrustLevel.TRUSTED]: 'scoreIfWhitelisted',
})

export const IpAddressScore = {
  [RiskLevel.CRITICAL]: 100,
  [RiskLevel.HIGH]: 60,
  [RiskLevel.MEDIUM]: 30,
  [RiskLevel.LOW]: 0,

  ipRiskLevels: (ipAddressSettings = { riskLevels: [] }) => {
    const { riskLevels } = ipAddressSettings
    return Object.entries(IpAddressSettingsScore).reduce((acc, [ipRiskLevel, ipAddressSettingsKey]) => {
      const riskLevel = getEngineRiskLevel(ipAddressSettings[ipAddressSettingsKey], riskLevels)
      if (riskLevel) {
        acc[riskLevel] = [...(acc[riskLevel] ?? []), ipRiskLevel]
      }
      return acc
    }, [])
  },
}
