import { RiskReduction } from '@ues-data/bis/model'

export const DefaultFixUp = Object.freeze({
  enabled: false,
  minimumBehavioralRiskLevel: RiskReduction.HIGH,
  actionPauseDuration: 7200,
})

export const DefaultIpAddressPolicy = Object.freeze({
  ipAddressListIds: [],
  allBlackLists: true,
  allWhiteLists: true,
})
