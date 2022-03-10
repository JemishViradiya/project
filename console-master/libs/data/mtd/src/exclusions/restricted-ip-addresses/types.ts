/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { BulkDeleteResponse, EntitiesPageableResponse, Task } from '../../types'
import type { IWebAddress, MtdApi, MtdApiMock } from '../api'

export type ApiProvider = typeof MtdApi | typeof MtdApiMock

export const ReduxSlice = 'app.mtd.restrictedIpAddresses'

export enum TaskId {
  RestrictedIpAddresses = 'restrictedIpAddresses',
  CreateRestrictedIpAddress = 'createRestrictedIpAddress',
  EditRestrictedIpAddress = 'editRestrictedIpAddress',
  DeleteRestrictedIpAddresses = 'deleteRestrictedIpAddresses',
  ImportRestrictedIpAddresses = 'importRestrictedIpAddresses',
}

export interface RestrictedIpAddressesState {
  tasks?: {
    restrictedIpAddresses: Task<EntitiesPageableResponse<IWebAddress>>
    createRestrictedIpAddress: Task
    editRestrictedIpAddress: Task
    deleteRestrictedIpAddresses: Task<BulkDeleteResponse>
    importRestrictedIpAddresses: Task
  }
}

export const ActionType = {
  FetchRestrictedIpAddressesStart: `${ReduxSlice}/fetch-restricted-ip-addresses-start`,
  FetchRestrictedIpAddressesError: `${ReduxSlice}/fetch-restricted-ip-addresses-error`,
  FetchRestrictedIpAddressesSuccess: `${ReduxSlice}/fetch-restricted-ip-addresses-success`,

  CreateRestrictedIpAddressStart: `${ReduxSlice}/create-restricted-ip-address-start`,
  CreateRestrictedIpAddressError: `${ReduxSlice}/create-restricted-ip-address-error`,
  CreateRestrictedIpAddressSuccess: `${ReduxSlice}/create-restricted-ip-address-success`,

  EditRestrictedIpAddressStart: `${ReduxSlice}/edit-restricted-ip-address-start`,
  EditRestrictedIpAddressError: `${ReduxSlice}/edit-restricted-ip-address-error`,
  EditRestrictedIpAddressSuccess: `${ReduxSlice}/edit-restricted-ip-address-success`,

  DeleteRestrictedIpAddressesStart: `${ReduxSlice}/delete-restricted-ip-addresses-start`,
  DeleteRestrictedIpAddressesError: `${ReduxSlice}/delete-restricted-ip-addresses-error`,
  DeleteRestrictedIpAddressesSuccess: `${ReduxSlice}/delete-restricted-ip-addresses-success`,

  ImportRestrictedIpAddressesStart: `${ReduxSlice}/import-restricted-ip-addresses-start`,
  ImportRestrictedIpAddressesError: `${ReduxSlice}/import-restricted-ip-addresses-error`,
  ImportRestrictedIpAddressesSuccess: `${ReduxSlice}/import-restricted-ip-addresses-success`,
}

// eslint-disable-next-line no-redeclare
export type ActionType = string
