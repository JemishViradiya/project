import flow from 'lodash/flow'

import { getEnv, getGov, getRegion, isDefaultDomain } from './consoleapi'

export enum Environment {
  STAGING = 'STAGING',
  DEV = 'DEV',
  PRODUCTION = 'PRODUCTION',
}

export enum Region {
  // production
  use1 = 'US1',
  euc1 = 'EU1',
  apne1 = 'JP1',
  au = 'AU1',
  sae1 = 'BR1',
  us = 'GC1',
  // staging
  lt = 'LT',
  qa2 = 'QA2',
  // dev
  r00 = 'R00',
  r01 = 'R01',
  r02 = 'R02',
}

const RegionAlias = {
  'local-staging': Region.qa2,
  'local-dev': Region.r00,
}

const getLocalRegion = (envOrRegionOrGov: string | null): string | null => {
  if (envOrRegionOrGov) return envOrRegionOrGov
}

const getUesRegion = (envOrRegionOrGov: string | null): Region => {
  if (envOrRegionOrGov) {
    const key = envOrRegionOrGov.toLowerCase().replace(/^swap-/gi, '')
    if (key === 'swap') return Region.use1
    return Region[key] || RegionAlias[key] || Region.use1
  }

  return undefined
}

export const UES_REGION = flow(isDefaultDomain, getEnv, getRegion, getGov, getLocalRegion, getUesRegion)()

export const getUesEnv = (): Environment => {
  switch (UES_REGION) {
    case Region.qa2:
    case Region.lt:
      return Environment.STAGING
    case Region.r00:
    case Region.r01:
    case Region.r02:
      return Environment.DEV
    default:
      return Environment.PRODUCTION
  }
}

export const UES_ENV = getUesEnv()
