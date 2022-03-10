import { swapObjectKeysAndValues } from './util'

export const TrustLevel = {
  UNTRUSTED: 'UNTRUSTED',
  UNDETECTED: 'UNDETECTED',
  UNDEFINED: 'UNDEFINED',
  TRUSTED: 'TRUSTED',
}

const IpAddressSourceType = {
  TRUSTED: 'whitelist',
  UNTRUSTED: 'blacklist',
  VENDOR: 'vendor',
  NOIPADDRESS: 'noIPAddress',
  NOTINLISTS: 'notInLists',
}

const IpAddressSourceTypeToRiskLevel = {
  [IpAddressSourceType.UNTRUSTED]: TrustLevel.UNTRUSTED,
  [IpAddressSourceType.NOIPADDRESS]: TrustLevel.UNDETECTED,
  [IpAddressSourceType.NOTINLISTS]: TrustLevel.UNDEFINED,
  [IpAddressSourceType.TRUSTED]: TrustLevel.TRUSTED,
  // we do not want to handle IpAddressSourceType.VENDOR on purpose
}

const RiskLevelToAddressSourceType = swapObjectKeysAndValues(IpAddressSourceTypeToRiskLevel)

export const getIpAddressRisk = ipAddressSource => IpAddressSourceTypeToRiskLevel[ipAddressSource]

export const getIpAddressSource = ipAddressRisk => RiskLevelToAddressSourceType[ipAddressRisk]

export const ipAddressSourceMap = {
  [IpAddressSourceType.UNTRUSTED]: 'scoreIfBlacklisted',
  [IpAddressSourceType.TRUSTED]: 'scoreIfWhitelisted',
  [IpAddressSourceType.NOIPADDRESS]: 'scoreIfNoIPAddress',
  [IpAddressSourceType.NOTINLISTS]: 'scoreIfNotInLists',
}

export const getIpAddressType = (ipAddressMappings, t) => {
  let ipAddressType
  const source = ipAddressMappings?.mappings?.source

  if (source === IpAddressSourceType.UNTRUSTED) {
    ipAddressType = t('common.ipAddressMapping.untrusted')
  } else if (source === IpAddressSourceType.NOIPADDRESS) {
    ipAddressType = t('common.ipAddressMapping.undetected')
  } else if (source === IpAddressSourceType.NOTINLISTS) {
    ipAddressType = t('common.ipAddressMapping.undefined')
  } else if (source === IpAddressSourceType.TRUSTED) {
    ipAddressType = t('common.ipAddressMapping.trusted')
    // if its the vendor then just show the score as a percent
    // however we hide it for now as we don't support this feature yet
    // } else if (source === IpAddressSourceType.VENDOR && ipAddressMappings?.riskScore !== undefined) {
    //   ipAddressType = `${Math.round(ipAddressMappings?.riskScore)}%`
  }
  return ipAddressType
}
