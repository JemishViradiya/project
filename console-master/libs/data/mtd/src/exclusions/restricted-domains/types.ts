/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { BulkDeleteResponse, EntitiesPageableResponse, Task } from '../../types'
import type { IWebAddress, MtdApi, MtdApiApprovedForDomainMock } from '../api'

export type ApiProvider = typeof MtdApi | typeof MtdApiApprovedForDomainMock

export const ReduxSlice = 'app.mtd.restrictedDomains'

export enum TaskId {
  RestrictedDomains = 'restrictedDomains',
  CreateRestrictedDomain = 'createRestrictedDomain',
  EditRestrictedDomain = 'editRestrictedDomain',
  DeleteRestrictedDomain = 'deleteRestrictedDomain',
  DeleteMultipleRestrictedDomains = 'deleteMultipleRestrictedDomains',
  ImportRestrictedDomains = 'importRestrictedDomains',
}

export interface RestrictedDomainsState {
  tasks?: {
    restrictedDomains: Task<EntitiesPageableResponse<IWebAddress>>
    createRestrictedDomain: Task
    editRestrictedDomain: Task
    deleteRestrictedDomain: Task
    deleteMultipleRestrictedDomains: Task<BulkDeleteResponse>
    importRestrictedDomains: Task
  }
}

export const ActionType = {
  FetchRestrictedDomainsStart: `${ReduxSlice}/fetch-restricted-domains-start`,
  FetchRestrictedDomainsError: `${ReduxSlice}/fetch-restricted-domains-error`,
  FetchRestrictedDomainsSuccess: `${ReduxSlice}/fetch-restricted-domains-success`,

  CreateRestrictedDomainStart: `${ReduxSlice}/create-restricted-domain-start`,
  CreateRestrictedDomainError: `${ReduxSlice}/create-restricted-domain-error`,
  CreateRestrictedDomainSuccess: `${ReduxSlice}/create-restricted-domain-success`,

  EditRestrictedDomainStart: `${ReduxSlice}/edit-restricted-domain-start`,
  EditRestrictedDomainError: `${ReduxSlice}/edit-restricted-domain-error`,
  EditRestrictedDomainSuccess: `${ReduxSlice}/edit-restricted-domain-success`,

  DeleteRestrictedDomainStart: `${ReduxSlice}/delete-restricted-domain-start`,
  DeleteRestrictedDomainError: `${ReduxSlice}/delete-restricted-domain-error`,
  DeleteRestrictedDomainSuccess: `${ReduxSlice}/delete-restricted-domain-success`,

  DeleteMultipleRestrictedDomainsStart: `${ReduxSlice}/delete-multiple-restricted-domains-start`,
  DeleteMultipleRestrictedDomainsError: `${ReduxSlice}/delete-multiple-restricted-domains-error`,
  DeleteMultipleRestrictedDomainsSuccess: `${ReduxSlice}/delete-multiple-restricted-domains-success`,

  ImportRestrictedDomainsStart: `${ReduxSlice}/import-restricted-domains-start`,
  ImportRestrictedDomainsError: `${ReduxSlice}/import-restricted-domains-error`,
  ImportRestrictedDomainsSuccess: `${ReduxSlice}/import-restricted-domains-success`,
}

// eslint-disable-next-line no-redeclare
export type ActionType = string
