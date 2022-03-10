/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { BulkDeleteResponse, EntitiesPageableResponse, Task } from '../../types'
import type { IWebAddress, MtdApi, MtdApiApprovedForDomainMock } from '../api'

export type ApiProvider = typeof MtdApi | typeof MtdApiApprovedForDomainMock

export const ReduxSlice = 'app.mtd.approvedDomains'

export enum TaskId {
  ApprovedDomains = 'approvedDomains',
  CreateApprovedDomain = 'createApprovedDomain',
  EditApprovedDomain = 'editApprovedDomain',
  DeleteApprovedDomain = 'deleteApprovedDomain',
  DeleteMultipleApprovedDomains = 'deleteMultipleApprovedDomains',
  ImportApprovedDomains = 'importApprovedDomains',
}

export interface ApprovedDomainsState {
  tasks?: {
    approvedDomains: Task<EntitiesPageableResponse<IWebAddress>>
    createApprovedDomain: Task
    editApprovedDomain: Task
    deleteApprovedDomain: Task
    deleteMultipleApprovedDomains: Task<BulkDeleteResponse>
    importApprovedDomains: Task
    exportApprovedDomains: Task
  }
}

export const ActionType = {
  FetchApprovedDomainsStart: `${ReduxSlice}/fetch-approved-domains-start`,
  FetchApprovedDomainsError: `${ReduxSlice}/fetch-approved-domains-error`,
  FetchApprovedDomainsSuccess: `${ReduxSlice}/fetch-approved-domains-success`,

  CreateApprovedDomainStart: `${ReduxSlice}/create-approved-domain-start`,
  CreateApprovedDomainError: `${ReduxSlice}/create-approved-domain-error`,
  CreateApprovedDomainSuccess: `${ReduxSlice}/create-approved-domain-success`,

  EditApprovedDomainStart: `${ReduxSlice}/edit-approved-domain-start`,
  EditApprovedDomainError: `${ReduxSlice}/edit-approved-domain-error`,
  EditApprovedDomainSuccess: `${ReduxSlice}/edit-approved-domain-success`,

  DeleteApprovedDomainStart: `${ReduxSlice}/delete-approved-domain-start`,
  DeleteApprovedDomainError: `${ReduxSlice}/delete-approved-domain-error`,
  DeleteApprovedDomainSuccess: `${ReduxSlice}/delete-approved-domain-success`,

  DeleteMultipleApprovedDomainsStart: `${ReduxSlice}/delete-multiple-approved-domains-start`,
  DeleteMultipleApprovedDomainsError: `${ReduxSlice}/delete-multiple-approved-domains-error`,
  DeleteMultipleApprovedDomainsSuccess: `${ReduxSlice}/delete-multiple-approved-domains-success`,

  ImportApprovedDomainsStart: `${ReduxSlice}/import-approved-domains-start`,
  ImportApprovedDomainsError: `${ReduxSlice}/import-approved-domains-error`,
  ImportApprovedDomainsSuccess: `${ReduxSlice}/import-approved-domains-success`,

  ExportApprovedDomainsStart: `${ReduxSlice}/export-approved-domains-start`,
  ExportApprovedDomainsError: `${ReduxSlice}/export-approved-domains-error`,
  ExportApprovedDomainsSuccess: `${ReduxSlice}/export-approved-domains-success`,
}

// eslint-disable-next-line no-redeclare
export type ActionType = string
