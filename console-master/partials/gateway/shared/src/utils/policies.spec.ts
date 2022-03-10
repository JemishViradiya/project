//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isAndroidEnabled } from './policies'

import type { Policy } from '@ues-data/gateway'

describe('isAndroidEnabled', () => {
  const policy: Partial<Policy> = {
    name: 'Test Policy',
    platforms: {},
  }

  it('should return false when the Android is empty', () => {
    policy.platforms.Android = {}
    expect(isAndroidEnabled(policy)).toStrictEqual(false)
  })

  it('should return false when the Android is null', () => {
    policy.platforms.Android = null
    expect(isAndroidEnabled(null)).toStrictEqual(false)
  })

  it('should return true when the Android is defined', () => {
    policy.platforms.Android = { perAppVpn: { type: 'inclusive' } }
    expect(isAndroidEnabled(policy)).toStrictEqual(true)
  })
})
