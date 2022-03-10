type RestrictionType = 'APPROVED' | 'RESTRICTED'
type WebAddressType = 'IP' | 'HOST'

export interface IWebAddress {
  guid?: string
  name?: string
  tenantGuid?: string
  type: RestrictionType
  addressType: WebAddressType
  value: string
  description?: string
  created?: string
}
