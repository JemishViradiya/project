/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { BulkDeleteResponse, EntitiesPageableResponse, IDeveloperCertificate, Task } from '../../types'
import type { MtdApi, MtdApiRestrictedMock } from '../api'

export type ApiProvider = typeof MtdApi | typeof MtdApiRestrictedMock

export const ReduxSlice = 'app.mtd.restrictedDevCerts'

export enum TaskId {
  RestrictedDevCerts = 'restrictedDevCerts',
  CreateRestrictedDevCert = 'createRestrictedDevCert',
  EditRestrictedDevCert = 'editRestrictedDevCert',
  DeleteRestrictedDevCerts = 'deleteRestrictedDevCerts',
  ImportRestrictedDevCerts = 'importRestrictedDevCerts',
}

export interface RestrictedDevCertsState {
  tasks?: {
    restrictedDevCerts: Task<EntitiesPageableResponse<IDeveloperCertificate>>
    createRestrictedDevCert: Task
    editRestrictedDevCert: Task
    deleteRestrictedDevCerts: Task<BulkDeleteResponse>
    importRestrictedDevCerts: Task
  }
}

export const ActionType = {
  FetchRestrictedDeveloperCertificatesStart: `${ReduxSlice}/fetch-restricted-dev-certs-start`,
  FetchRestrictedDeveloperCertificatesError: `${ReduxSlice}/fetch-restricted-dev-certs-error`,
  FetchRestrictedDeveloperCertificatesSuccess: `${ReduxSlice}/fetch-restricted-dev-certs-success`,

  CreateRestrictedDeveloperCertificateStart: `${ReduxSlice}/create-restricted-dev-cert-start`,
  CreateRestrictedDeveloperCertificateError: `${ReduxSlice}/create-restricted-dev-cert-error`,
  CreateRestrictedDeveloperCertificateSuccess: `${ReduxSlice}/create-restricted-dev-cert-success`,

  EditRestrictedDeveloperCertificateStart: `${ReduxSlice}/edit-restricted-dev-cert-start`,
  EditRestrictedDeveloperCertificateError: `${ReduxSlice}/edit-restricted-dev-cert-error`,
  EditRestrictedDeveloperCertificateSuccess: `${ReduxSlice}/edit-restricted-dev-cert-success`,

  DeleteRestrictedDeveloperCertificatesStart: `${ReduxSlice}/delete-restricted-dev-certs-start`,
  DeleteRestrictedDeveloperCertificatesError: `${ReduxSlice}/delete-restricted-dev-certs-error`,
  DeleteRestrictedDeveloperCertificatesSuccess: `${ReduxSlice}/delete-restricted-dev-certs-success`,

  ImportRestrictedDeveloperCertificatesStart: `${ReduxSlice}/import-restricted-dev-certs-start`,
  ImportRestrictedDeveloperCertificatesError: `${ReduxSlice}/import-restricted-dev-certs-error`,
  ImportRestrictedDeveloperCertificatesSuccess: `${ReduxSlice}/import-restricted-dev-certs-success`,
}

// eslint-disable-next-line no-redeclare
export type ActionType = string
