//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { PagableResponse, Response } from '@ues-data/shared-types'

import type { PageableSortableQueryParams } from '../types'
import type { DevicesBase, DevicesInfo, UsersBase } from './users-types'

export default interface UsersInterface {
  /**
   * Get pageable view of Users list
   * @param params The query params
   */
  readAll(
    params?: PageableSortableQueryParams<UsersBase>,
  ): Response<Partial<PagableResponse<UsersBase>> | PagableResponse<UsersBase>>

  /**
   * Get devices ids related to user
   * @param userId
   */
  readDevices(userId: string): Response<DevicesBase[]>

  /**
   * Get devices info
   * @param devicesIds devices ids
   */
  readDevicesInfo(devicesIds: string[]): Response<DevicesInfo>
}
