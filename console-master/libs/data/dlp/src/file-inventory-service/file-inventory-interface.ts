//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { PagableResponse, Response } from '@ues-data/shared-types'

import type { PageableSortableFileInventoryQueryParams } from '../types'
import type { FileInventoryBase, FileInventoryDetails, MetadataItem, UserDeviceCountsItem } from './file-inventory-types'

export default interface FileInventaryInterface {
  /**
   * Get pageable view of FileInventory list
   * @param params The query params
   */
  readAll(
    params?: PageableSortableFileInventoryQueryParams<FileInventoryBase>,
  ): Response<Partial<PagableResponse<FileInventoryBase>> | PagableResponse<FileInventoryBase>>

  /**
   * Get users and devices counts from Risk score service
   * @param hashes FileInventory hashes
   */
  readUserAndDeviceCounts(hashes: string[]): Response<Partial<UserDeviceCountsItem> | UserDeviceCountsItem>

  /**
   * Get FileInventory metadata
   * @param hashes FileInventory hashes
   */
  readMetadata(hashes: string[]): Response<Partial<MetadataItem> | MetadataItem>

  /**
   * Get detailed FileInventory view
   * @param fileHash The hash of particular file
   */
  read(eventUUID: string): Response<Partial<FileInventoryDetails> | FileInventoryDetails>
}
