/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { createContext, useContext } from 'react'

import { resolveOverrideEnvironmentValue, resolveOverrideEnvironmentVariable } from '../shared/overrideEnvironmentVariable'

const hasGlobalOverride = (): true | undefined => {
  // build-time override
  const { enabled, src } = resolveOverrideEnvironmentVariable('UES_DATA_MOCK')
  if (
    (enabled && src === 'env') ||
    // test environment
    process.env.NODE_CONFIG_ENV === 'test' ||
    // isReviewApp
    window.location.origin.includes('ues-console-sites.sw.rim.net')
  ) {
    return true
  }
  if (enabled) {
    return true
  }
  return undefined
}

export const GLOBAL_OVERRIDE: true | undefined = hasGlobalOverride()

const MockContext = createContext<true | undefined>(GLOBAL_OVERRIDE)

export const MockProvider = MockContext.Provider

const isMockOverride = (mockOverrideId?: string): boolean => {
  return mockOverrideId ? String(true) === resolveOverrideEnvironmentValue(mockOverrideId).value : false
}

export const useMock = (
  override: { mock?: boolean; mockOverrideId?: string } = {},
  override2: { mock?: boolean; mockOverrideId?: string } = {},
): boolean => {
  const mockCtx = useContext(MockContext)

  if (isMockOverride(override.mockOverrideId) || isMockOverride(override2.mockOverrideId)) {
    return false
  }

  // hierarchy is anything that is true
  if (GLOBAL_OVERRIDE || mockCtx || override.mock || override2.mock) {
    return true
  }

  if (mockCtx !== undefined) {
    return mockCtx
  }

  return false
}
