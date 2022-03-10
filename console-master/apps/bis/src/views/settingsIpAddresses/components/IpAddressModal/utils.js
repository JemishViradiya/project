import isIP from 'validator/lib/isIP'
import isIPRange from 'validator/lib/isIPRange'

const IP_ADDRESS_FORMAT_INVALID = 'settings.ipAddress.invalidFormat'
const IP_ADRESS_LIST_ID_KEY = 'ipAddressListId'
// eslint-disable-next-line no-useless-escape
const IPV4_RANGES_REGEX = /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]?|0)\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]?|0)\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]?|0)\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]?|0)(\-(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]?|0))$/gim
const NEWLINE_CHARACTER = '\n'
const NEWLINE_REGEX = /\r\n|\r|\n/g
const DOT_REGEX = /\./g
// eslint-disable-next-line no-useless-escape
const DASH_REGEX = /\-/g

const isInt = n => /^[+-]?\d+$/.test(n)

const getInvalidAddressList = addressList =>
  addressList.reduce((acc, currentIpAddress) => {
    if (!isIP(currentIpAddress) && !isIPRange(currentIpAddress) && !currentIpAddress.match(IPV4_RANGES_REGEX)) {
      acc.push(currentIpAddress)
    }
    return acc
  }, [])

const getInvalidRangeValueList = addressList => {
  return addressList.reduce((acc, currentIpAddress) => {
    const dotSplit = currentIpAddress.split(DOT_REGEX)
    if (dotSplit.length === 4) {
      const rangeValues = dotSplit[3].split(DASH_REGEX)
      if (
        rangeValues.length === 2 &&
        isInt(rangeValues[0]) &&
        isInt(rangeValues[1]) &&
        parseInt(rangeValues[0]) >= parseInt(rangeValues[1])
      ) {
        acc.push(currentIpAddress)
      }
    }
    return acc
  }, [])
}

export const formatIpAddressesString = addresses => addresses?.split(NEWLINE_REGEX)

const getDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) !== index)

export const checkWhetherIsWithinRange = t => ipAddressString => {
  const separateAddresses = formatIpAddressesString(ipAddressString)
  const invalidAddressList = getInvalidAddressList(separateAddresses)
  const invalidRangeValueList = getInvalidRangeValueList(separateAddresses)
  const hasDuplicates = getDuplicates(separateAddresses)
  const hasEmptyLine = separateAddresses.includes('')

  if (invalidAddressList.length || hasEmptyLine || invalidRangeValueList.length || hasDuplicates.length) {
    return t(IP_ADDRESS_FORMAT_INVALID)
  }
  return true
}

export const getIpAddressesString = ipAddresses => ipAddresses.join(NEWLINE_CHARACTER)

export const getRequestData = (values, props, isEditRequest) => {
  const input = { ...values, ...props, ipAddresses: formatIpAddressesString(props.ipAddresses) }
  const data = {
    variables: { input },
  }
  let id = null
  if (isEditRequest) {
    id = values[IP_ADRESS_LIST_ID_KEY]
    delete input[IP_ADRESS_LIST_ID_KEY]
    data.variables = { id, input }
  }
  return data
}
