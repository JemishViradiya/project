import merge from 'lodash-es/merge'

import type { InMemoryCacheConfig } from '@apollo/client'
import { InMemoryCache } from '@apollo/client'

import { BIS_CACHE_CONFIG } from './bis'
import { DASHBOARD_CACHE_CONFIG } from './dashboard'
import { GATEWAY_CACHE_CONFIG } from './gateway'
import { MTD_CACHE_CONFIG } from './mtd'
import { PLATFORM_CACHE_CONFIG } from './platform'

const customConfigurations = [
  DASHBOARD_CACHE_CONFIG,
  GATEWAY_CACHE_CONFIG,
  MTD_CACHE_CONFIG,
  BIS_CACHE_CONFIG,
  PLATFORM_CACHE_CONFIG,
]

const combinedConfigurations = customConfigurations.reduce<InMemoryCacheConfig>((acc, config) => merge(acc, config), {})

export const customizedCache = new InMemoryCache({
  ...combinedConfigurations,
  addTypename: false,
})
