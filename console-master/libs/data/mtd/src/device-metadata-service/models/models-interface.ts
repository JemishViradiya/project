//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { Response } from '@ues-data/shared'

import type { Model } from './models-types'

export default interface ModelsInterface {
  /**
   * Get device models
   */
  readAll(osFamily?: string): Response<Array<Model>>
}
