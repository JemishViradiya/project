/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { BulkDeleteResponse, EntitiesPageableResponse, IDeveloperCertificate, Task } from '../../types'
import type { MtdApi, MtdApiMock } from '../api'

export type ApiProvider = typeof MtdApi | typeof MtdApiMock

export const ReduxSlice = 'app.mtd.approvedDevCerts'

export enum TaskId {
  ApprovedDevCerts = 'approvedDevCerts',
  CreateApprovedDevCert = 'createApprovedDevCert',
  EditApprovedDevCert = 'editApprovedDevCert',
  DeleteApprovedDevCerts = 'deleteApprovedDevCerts',
  ImportApprovedDevCerts = 'importApprovedDevCerts',
}

export interface ApprovedDevCertsState {
  tasks?: {
    approvedDevCerts: Task<EntitiesPageableResponse<IDeveloperCertificate>>
    createApprovedDevCert: Task
    editApprovedDevCert: Task
    deleteApprovedDevCerts: Task<BulkDeleteResponse>
    importApprovedDevCerts: Task
  }
}

export const ActionType = {
  FetchApprovedDeveloperCertificatesStart: `${ReduxSlice}/fetch-approved-dev-certs-start`,
  FetchApprovedDeveloperCertificatesError: `${ReduxSlice}/fetch-approved-dev-certs-error`,
  FetchApprovedDeveloperCertificatesSuccess: `${ReduxSlice}/fetch-approved-dev-certs-success`,

  CreateApprovedDeveloperCertificateStart: `${ReduxSlice}/create-approved-dev-cert-start`,
  CreateApprovedDeveloperCertificateError: `${ReduxSlice}/create-approved-dev-cert-error`,
  CreateApprovedDeveloperCertificateSuccess: `${ReduxSlice}/create-approved-dev-cert-success`,

  EditApprovedDeveloperCertificateStart: `${ReduxSlice}/edit-approved-dev-cert-start`,
  EditApprovedDeveloperCertificateError: `${ReduxSlice}/edit-approved-dev-cert-error`,
  EditApprovedDeveloperCertificateSuccess: `${ReduxSlice}/edit-approved-dev-cert-success`,

  DeleteApprovedDeveloperCertificatesStart: `${ReduxSlice}/delete-approved-dev-certs-start`,
  DeleteApprovedDeveloperCertificatesError: `${ReduxSlice}/delete-approved-dev-certs-error`,
  DeleteApprovedDeveloperCertificatesSuccess: `${ReduxSlice}/delete-approved-dev-certs-success`,

  ImportApprovedDeveloperCertificatesStart: `${ReduxSlice}/import-approved-dev-certs-start`,
  ImportApprovedDeveloperCertificatesError: `${ReduxSlice}/import-approved-dev-certs-error`,
  ImportApprovedDeveloperCertificatesSuccess: `${ReduxSlice}/import-approved-dev-certs-success`,
}

// eslint-disable-next-line no-redeclare
export type ActionType = string
