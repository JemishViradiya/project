/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

// Old validation from UEM does not match stratos.bcp.bblabs.rim.net
// const domainName = new RegExp(
//   /^(?=.{1,254}$)((?=[a-z0-9-]{1,63}\\.)(xn--)?[a-z0-9]+(-[a-z0-9]+)*\\.)+[a-z]{2,63}$/i,
// )
// New validation from https://regexr.com/3g5j0
const domainName = new RegExp(/^(?!:\/\/)(?=.{1,255}$)((.{1,63}\.){1,127}(?![0-9]*$)[a-z0-9-]+\.?)$/i)
const minSizeMb = 1
const maxSizeMb = 2047
const minAgeDays = 1
const maxAgeDays = 9999
const minPort = 0
const maxPort = 65536
export const maxNameLength = 64
export const maxEmailLength = 255

const hostnamePattern = new RegExp(
  /^((([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\\-][a-zA-Z0-9])\\.)([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\\-]*[A-Za-z0-9]))$/i,
)
const ipv4Pattern = new RegExp(/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/i)
const ipv6Pattern = new RegExp(/^([0-9A-Fa-f]{0,4}:){2,7}([0-9A-Fa-f]{1,4}$|((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\\.|$)){4})$/i)

const emailPattern = new RegExp(
  // eslint-disable-next-line no-control-regex
  /^(?:[\w!#$%&'*+/=?^`{|}~-]+(?:\.[\w!#$%&'*+/=?^`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\])$/i,
)
const emailDomainInvalidIPPattern = new RegExp(
  /(@(25[6-9]|[3-9]{3}|\d{4,})(\.\d{1,3}){3}|(\d{1,3}\.)(25[6-9]|[3-9]{3}|\d{4,})(\.\d{1,3}){2}|(\d{1,3}\.){2}(25[6-9]|[3-9]{3}|\d{4,})(\.\d{1,3})|(\d{1,3}\.){3}(25[6-9]|[3-9]{3}|\d{4,}))$/,
)

const displayNamePattern = new RegExp('^[^\\*\\+\\?\\|\\[\\]"/=<>;:,\\\\]*$', 'i')

// allows only one spacing between the words and multiple spacing on the start and end
const spacingPattern = new RegExp(/^(\s*[^\s])([^\s]+\s{0,1})*(\s*)$/i)

export function isValidDomainName(value) {
  return domainName.test(value)
}

export function isEmpty(value) {
  return typeof value !== 'undefined' && value.length > 0
}

export function isValidHost(value) {
  return domainName.test(value) || hostnamePattern.test(value) || ipv4Pattern.test(value) || ipv6Pattern.test(value)
}

export function isValidSize(value) {
  return !isNaN(value) && minSizeMb < value < maxSizeMb
}

export function isValidPort(value) {
  return !isNaN(value) && minPort < value < maxPort
}

export function isValidAge(value) {
  return !isNaN(value) && minAgeDays < value < maxAgeDays
}

export function isValidEmail(value) {
  return emailPattern.test(value) && !emailDomainInvalidIPPattern.test(value)
}

export function isValidLength(maxLength) {
  return value => value.length <= maxLength
}

export function isValidSpacing(value) {
  return spacingPattern.test(value)
}

export function isValidDisplayName(value) {
  return displayNamePattern.test(value)
}
