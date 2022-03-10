import { IpAddressListQuery, IpAddressSettingsQuery } from '@ues-data/bis'

const DEFAULT_VARIABLES = { isBlacklist: false, offset: 0, searchText: '', sortBy: 'name', sortDirection: 'ASC', limit: undefined }
const IP_ADDRESSES_LENGTH = 3

const getId = index => `ID_${index}`

const ipAddressMock = (isBlacklist, ipAddressesLength, index) => ({
  id: getId(index),
  name: `NAME_${index}`,
  ipAddresses: Array(ipAddressesLength)
    .fill()
    .map((_, index) => `192.168.1.11${index}`),
  isBlacklist,
  listType: `LIST_TYPE_${index}`,
  vendorUrl: `VENDOR_URL_${index}`,
})

const createIpAddresses = ({ isBlacklist, ipAddressesLength = 1 }) => {
  return {
    request: { query: IpAddressSettingsQuery.query, variables: { ...DEFAULT_VARIABLES, isBlacklist } },
    result: {
      data: {
        ipAddressSettings: Array(IP_ADDRESSES_LENGTH)
          .fill(null)
          .map((_, index) => ipAddressMock(isBlacklist, ipAddressesLength, index)),
      },
    },
  }
}

const createSingleIpAddresses = ({ isBlacklist, ipAddressesLength = 1, ipAddressListIndex }) => {
  return {
    request: { query: IpAddressListQuery.query, variables: { id: getId(ipAddressListIndex) } },
    result: {
      data: {
        getIpAddressList: ipAddressMock(isBlacklist, ipAddressesLength, ipAddressListIndex),
      },
    },
  }
}

export { createIpAddresses, createSingleIpAddresses }
