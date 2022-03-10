/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { BulkDeleteResponse, EntitiesPageableResponse, Task } from '../../types'
import type { MtdApi, MtdApiMock } from '../api'
import type { IWebAddress } from '../api/web-addresses/web-addresses-api-types'

export type ApiProvider = typeof MtdApi | typeof MtdApiMock

export const ReduxSlice = 'app.mtd.approvedIpAddresses'

export enum TaskId {
  ApprovedIpAddresses = 'approvedIpAddresses',
  CreateApprovedIpAddress = 'createApprovedIpAddress',
  EditApprovedIpAddress = 'editApprovedIpAddress',
  DeleteApprovedIpAddresses = 'deleteApprovedIpAddresses',
  ImportApprovedIpAddresses = 'importApprovedIpAddresses',
  ExportApprovedIpAddresses = 'exportApprovedIpAddresses',
}

export interface ApprovedIpAddressesState {
  tasks?: {
    approvedIpAddresses: Task<EntitiesPageableResponse<IWebAddress>>
    createApprovedIpAddress: Task
    editApprovedIpAddress: Task
    deleteApprovedIpAddresses: Task<BulkDeleteResponse>
    importApprovedIpAddresses: Task
    exportApprovedIpAddresses: Task
  }
}

export const ActionType = {
  FetchApprovedIpAddressesStart: `${ReduxSlice}/fetch-approved-ip-addresses-start`,
  FetchApprovedIpAddressesError: `${ReduxSlice}/fetch-approved-ip-addresses-error`,
  FetchApprovedIpAddressesSuccess: `${ReduxSlice}/fetch-approved-ip-addresses-success`,

  CreateApprovedIpAddressStart: `${ReduxSlice}/create-approved-ip-address-start`,
  CreateApprovedIpAddressError: `${ReduxSlice}/create-approved-ip-address-error`,
  CreateApprovedIpAddressSuccess: `${ReduxSlice}/create-approved-ip-address-success`,

  EditApprovedIpAddressStart: `${ReduxSlice}/edit-approved-ip-address-start`,
  EditApprovedIpAddressError: `${ReduxSlice}/edit-approved-ip-address-error`,
  EditApprovedIpAddressSuccess: `${ReduxSlice}/edit-approved-ip-address-success`,

  DeleteApprovedIpAddressesStart: `${ReduxSlice}/delete-approved-ip-addresses-start`,
  DeleteApprovedIpAddressesError: `${ReduxSlice}/delete-approved-ip-addresses-error`,
  DeleteApprovedIpAddressesSuccess: `${ReduxSlice}/delete-approved-ip-addresses-success`,

  ImportApprovedIpAddressesStart: `${ReduxSlice}/import-approved-ip-addresses-start`,
  ImportApprovedIpAddressesError: `${ReduxSlice}/import-approved-ip-addresses-error`,
  ImportApprovedIpAddressesSuccess: `${ReduxSlice}/import-approved-ip-addresses-success`,

  ExportApprovedIpAddressesStart: `${ReduxSlice}/export-approved-ip-addresses-start`,
  ExportApprovedIpAddressesError: `${ReduxSlice}/export-approved-ip-addresses-error`,
  ExportApprovedIpAddressesSuccess: `${ReduxSlice}/export-approved-ip-addresses-success`,
}

// eslint-disable-next-line no-redeclare
export type ActionType = string
