//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { Response } from '@ues-data/shared'

import type { OSVersion } from './osversions-types'

export default interface OSVersionsInterface {
  /**
   * Get OS versions
   */
  readAll(osFamily?: string): Response<Array<OSVersion>>
}
