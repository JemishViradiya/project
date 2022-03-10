//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { Response } from '@ues-data/shared'

import type { Brand } from './brands-types'

export default interface BrandsInterface {
  /**
   * Get device brands
   */
  readAll(osFamily?: string): Response<Array<Brand>>
}
