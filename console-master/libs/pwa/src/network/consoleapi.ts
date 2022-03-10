/**
 * For reference:
 * https://cylance.atlassian.net/browse/CCP-1546
 * https://cylance.atlassian.net/browse/CCP-1492
 * https://cylance.atlassian.net/browse/DOSD-12877
 * https://cylance.atlassian.net/wiki/spaces/~877135206/pages/650838722/Venue+Region+Cheatsheet
 * https://cylance.atlassian.net/wiki/spaces/ATS/pages/161992155/Resource+Templating+and+Routing+for+Microservices
 *
 */
import flow from 'lodash/flow'
import isEmpty from 'lodash/isEmpty'

const isDev = process.env.NODE_ENV === 'development'
const isLocalhost = isDev && /https?:\/\/localhost:[0-9]+/.test(globalThis.origin)

type StrOrNull = string | null

const apiDomain = 'consoleapi.cylance.com'
const defaultVenueDomain = 'protect.cylance.com'
const defaultUesDomain = 'ues.cylance.com'
const defautRegion = 'use1'

/**
 * Extract string between defined start position
 * and end position
 * @param str string extract the string between start and end
 * @param a string for start position
 * @param b string for end position
 */
const getStrBetweenLastMatch = (str: string, a: string, b: string): string =>
  str.substring(str.lastIndexOf(a) + 1, str.lastIndexOf(b))

const getStrBetweenFirstMatch = (str: string, a: string, b: string): string => str.substring(str.indexOf(a) + 1, str.indexOf(b))
/**
 * Decide if uses the dev (localhost)
 * or domain being visited for endpoint calls
 * @param formattedDomain
 */
const getDomain = (formattedDomain: string): string => (isLocalhost ? `http://localhost:3000` : formattedDomain)

const getHost = (location: typeof globalThis.location) => {
  if (isDev) {
    return location.host.replace(/^local-([^-]+)-(.*):([0-9]+)$/, (_, env, base, port) => {
      switch (env) {
        case 'dev':
          return `r00-${base}`
        case 'staging':
          return `qa2-${base}`
        default:
          return `${env}-${base}:${port}`
      }
    })
  }

  if (!location) return null

  return location.host
}

/**
 * Check if domain is default (https://protect.cylance.com)
 * no env no region and returns default region
 */
const isDefaultDomain = (): StrOrNull => {
  const windowLocation = globalThis.location
  const host = getHost(windowLocation)
  if (host === defaultVenueDomain || host === defaultUesDomain) {
    return `${defautRegion}`
  }

  return null
}

/**
 * Use defaultRegion when exists
 * otherwise try to use environment
 * if available in the domain
 * @param defaultRegion region
 */
const getEnv = (defaultRegion: StrOrNull): StrOrNull => {
  // in case domain is default
  // we don't need to use env
  if (defaultRegion) return defaultRegion

  const windowLocation = globalThis.location
  if (!windowLocation) return null

  const host = getHost(windowLocation)
  const env = getStrBetweenLastMatch(host, '://', host.indexOf('protect') === -1 ? '-ues' : '-protect')

  if (isEmpty(env)) {
    return null
  }

  return env
}

/**
 * Use env when exists
 * otherwise try to use region
 * if available in the domain
 * @param env environment
 */
const getRegion = (env: StrOrNull): StrOrNull => {
  // in case env exists no region is required
  if (env) return env

  const windowLocation = globalThis.location
  if (!windowLocation) return null

  const region = getStrBetweenFirstMatch(getHost(windowLocation), '-', '.cylance.com')

  // not clean region extraction
  if (region.includes('.')) return null

  return region
}

/**
 * Use envOrRegion when exists
 * otherwise try to use gov
 * if available in the domain
 * @param envOrRegion environment or region
 */
const getGov = (envOrRegion: StrOrNull): StrOrNull => {
  // in case env or region exists no gov is required
  if (envOrRegion) return envOrRegion

  const windowLocation = globalThis.location
  if (!windowLocation) return null
  const host = getHost(windowLocation)
  const gov = host.substring(host.indexOf('.') + 1, host.indexOf('.cylance.com'))

  // not clean gov extraction
  if (gov.includes('.')) return null

  return gov
}

/**
 * Use envOrRegionOrGov when exists
 * otherwise use default region (us)
 * to format the endpoint api
 * @param envOrRegion environment or region
 */
const formatendpointDomain = (envOrRegionOrGov: StrOrNull): string => {
  const windowLocation = globalThis.location
  const protocol = windowLocation.protocol

  const domain = envOrRegionOrGov && envOrRegionOrGov !== defautRegion ? `${envOrRegionOrGov}-${apiDomain}` : `${apiDomain}`
  return `${protocol}//${domain}/`
}

const apiResolver = () => flow(isDefaultDomain, getEnv, getRegion, getGov, formatendpointDomain, getDomain)()

export { apiResolver, isDefaultDomain, getEnv, getRegion, getGov, formatendpointDomain, getDomain }
