/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { Response } from '@ues-data/shared'

import type { DeleteResponse, ServerSideSelectionModel } from '../../shared/types'

export default interface EndpointsInterface {
  /**
   * Deactivate device
   */
  deviceDeactivation(endpointIds: string[]): Response<{ totalCount: number; failedCount: number }>

  /**
   * Delete endpoints
   */
  deleteEndpoints(selection: ServerSideSelectionModel): Response<{ totalCount: number; failedCount: number }>
}
