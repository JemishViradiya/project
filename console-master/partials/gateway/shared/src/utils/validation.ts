//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { Address4, Address6 } from 'ip-address'
import ipaddr from 'ipaddr.js'
import isValidDomain from 'is-valid-domain'
import type { BigInteger } from 'jsbn'
import { isEmpty, isNil } from 'lodash-es'
import validator from 'validator'

import { ALLOWED_ENVIRONMENT_VARIABLES, MAX_WINDOWS_PATH_LENGTH, WINDOWS_PATH_RESERVED_CHARACTERS } from '../config'

export enum IPType {
  IPv4 = 'ipv4',
  IPv6 = 'ipv6',
  Invalid = 'Invalid IP address',
}

export const HTTP_PROTOCOLS = ['http', 'https']

export const MIN_PORT_NUMBER = 0
export const MAX_PORT_NUMBER = 65535

// eslint-disable-next-line no-control-regex
const DOMAIN_REGEX = /[\u0000-\u002c\u002f\u003a-\u0040\u005b-\u005f\u007b-\u007f]|\.\./g
const STARTS_WITH_DRIVE_LETTER_REGEX = /^[a-zA-Z]:(\\)/g
const BACKSLASH_REGEX = /\\/g
const TWO_BACKSLASHES_REGEX = /\\\\/g
const WHITESPACE_REGEX = /\s/g

const hasDuplicates = (ipsArray: string[]): boolean => new Set(ipsArray).size !== ipsArray.length

export const isValidDNSDomain = (value: string): boolean => !value.match(DOMAIN_REGEX)?.length

export const getArrayFromRange = (range: string): string[] => range?.split('-').map(item => item.trim()) || []

export const isValidDNSDomains = (values: string[]): boolean => !hasDuplicates(values) && values.every(isValidDNSDomain)

export const isValidDomainOrFQDN = (value: string): boolean => isValidDomain(value, { subdomain: true, wildcard: true })

export const isValidDomainsAndFQDNs = (values: string[]): boolean => !hasDuplicates(values) && values.every(isValidDomainOrFQDN)

export const isIPRange = (range: string): boolean => getArrayFromRange(range).length > 1

export const getIPType = (ipAddress: string): IPType => {
  try {
    const addr = ipaddr.parse(ipAddress)
    return addr.kind() as IPType
  } catch {
    return IPType.Invalid
  }
}

export const isIPv6DualAddress = (ipAddress: string): boolean =>
  getIPType(ipAddress) !== IPType.IPv6 ? false : ipAddress.split(':').some(ipaddr.IPv4.isValidFourPartDecimal)

export const isValidIPAddress = (ipAddress: string): boolean => {
  const ipType = getIPType(ipAddress)
  return ipType === IPType.IPv4
    ? ipaddr.IPv4.isValidFourPartDecimal(ipAddress)
    : ipaddr.IPv6.isValid(ipAddress) && !isIPv6DualAddress(ipAddress)
}

export const isCIDR = (value: string): boolean => {
  try {
    ipaddr.parseCIDR(value)
    return true
  } catch {
    return false
  }
}

export const isValidCIDR = (value: string): boolean => {
  if (!isCIDR(value)) {
    return false
  }
  const [ip] = value.split('/')
  return isValidIPAddress(ip)
}

export const isValidIPV4CIDR = (value: string, maxSuffix?: number): boolean => {
  if (!isCIDR(value)) {
    return false
  }

  const [ipAddress, suffix] = value.split('/')
  const isValidIPV4 = ipaddr.IPv4.isValidFourPartDecimal(ipAddress)

  return isNil(maxSuffix) ? isValidIPV4 : isValidIPV4 && Number(suffix) <= maxSuffix
}

export const isValidCIDRs = (values: string[]): boolean =>
  !isEmpty(values) && !hasDuplicates(values) && values.map(item => isValidCIDR(item)).every(Boolean)

export const isValidIPRange = (range: string): boolean => {
  const ipsArr = getArrayFromRange(range)
  const ipTypeStart = getIPType(ipsArr[0])
  const ipTypeEnd = getIPType(ipsArr[1])
  const areTypesMatch = ipTypeStart === ipTypeEnd

  try {
    if (areTypesMatch && ipsArr[0] !== ipsArr[1]) {
      const [start, end] = ipsArr.map(value =>
        getIPType(value) === IPType.IPv4 ? new Address4(value).bigInteger() : new Address6(value).bigInteger(),
      )
      return start <= end
    }
  } catch (e) {
    // Failed to generate address (AddressError)
    console.warn(`Failed to validate ip range `, e)
  }
  return false
}

// Validate IP address, CIDR range or range list,
// eg. 127.0.0.1, 127.0.0.1/24, 2001:db8:1234::1-2001:db8:1234::5
export const isValidIPOrRange = (value: string): boolean =>
  isIPRange(value) ? isValidIPRange(value) : isValidCIDR(value) || isValidIPAddress(value)

// Validate array of IP address, CIDR range or range list as array of strings
// eg. [127.0.0.1, 127.0.0.1/24, 2001:db8:1234::1-2001:db8:1234::5]
export const isValidIPsOrRanges = (values: string[]): boolean =>
  !hasDuplicates(values) && values.map(item => isValidIPOrRange(item)).every(Boolean)

// Validate array of IP addresses
// eg. [127.0.0.1, 122.1.1.1]
export const isValidIPAddresses = (values: string[]): boolean =>
  !hasDuplicates(values) && values.map(item => isValidIPAddress(item)).every(Boolean)

export const isValidUrl = (url: string): boolean => {
  return validator.isURL(url, { require_protocol: true, protocols: HTTP_PROTOCOLS, require_valid_protocol: true })
}

export const isIPHost = (url: string): boolean => {
  const parsedURL = new URL(url)
  return parsedURL && isValidIPAddress(parsedURL.hostname)
}

const makeIPBigIntegerValue = (value: string, type: IPType): BigInteger =>
  type === IPType.IPv4 ? new Address4(value).bigInteger() : new Address6(value).bigInteger()

export const isIPInTarget = (sourceIP: string, target: string): boolean => {
  const parsedValue = ipaddr.parse(sourceIP) as any
  const sourceIPType = getIPType(sourceIP)

  if (isCIDR(target)) {
    return parsedValue.match(ipaddr.parseCIDR(target))
  }

  if (isIPRange(target)) {
    const ipsArr = getArrayFromRange(target)
    const startRangeValue = makeIPBigIntegerValue(ipsArr[0], sourceIPType)[0]
    const endRangeValue = makeIPBigIntegerValue(ipsArr[1], sourceIPType)[0]
    const dnsServerBigIntegerValue = makeIPBigIntegerValue(sourceIP, sourceIPType)[0]

    return dnsServerBigIntegerValue >= startRangeValue && dnsServerBigIntegerValue <= endRangeValue
  }

  return target === sourceIP.trim()
}

export const isIPInTargetArray = (sourceIP: string, target: string[]): boolean =>
  target
    .map(item => isIPInTarget(sourceIP, item))
    .filter(item => !isNil(item))
    .some(Boolean)

export const isValidPort = (port: string): boolean => Number(port) >= MIN_PORT_NUMBER && Number(port) <= MAX_PORT_NUMBER

export const isPathStartWithDriveLetter = (path: string) => path.match(STARTS_WITH_DRIVE_LETTER_REGEX)
export const isPathStartWithEnvironmentVariable = (path: string) => {
  const backslashSplit = path.split(BACKSLASH_REGEX)

  return backslashSplit.length > 1 && ALLOWED_ENVIRONMENT_VARIABLES.includes(backslashSplit[0])
}

export const isPathEndWithDotOrBackslash = (path: string) => {
  const trimmedPath = path.trim()

  return ['.', '\\'].includes(trimmedPath[trimmedPath.length - 1])
}

export const isPathIncludesReservedCharacters = (path: string) => {
  const [_driveLetterOrEnvironmentVariable, ...rest] = path.split(BACKSLASH_REGEX)

  return (
    rest
      .join('')
      .split('')
      .filter(item => WINDOWS_PATH_RESERVED_CHARACTERS.includes(item)).length > 0
  )
}

export const isPathIncludesConsecutiveBackslashes = (path: string) => path.match(TWO_BACKSLASHES_REGEX)

export const isPathValid = (path: string) =>
  (isPathStartWithDriveLetter(path) || isPathStartWithEnvironmentVariable(path)) &&
  !isPathEndWithDotOrBackslash(path) &&
  !isPathIncludesReservedCharacters(path) &&
  !isPathIncludesConsecutiveBackslashes(path) &&
  path.length < MAX_WINDOWS_PATH_LENGTH

export const isPathsValid = (paths: string[]) => paths.every(isPathValid)

export const isStringIncludeSpaces = (value: string) => value.match(WHITESPACE_REGEX)

export const isStringArrayIncludeSpaces = (values: string[]) => values.some(isStringIncludeSpaces)
