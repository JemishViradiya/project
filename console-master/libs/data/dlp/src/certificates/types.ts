/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { PagableResponse } from '@ues-data/shared-types'

import type { Certificate, CertificatesApi, CertificatesMockApi } from '../certificate-service'
import type { Task } from '../types'

export type ApiProvider = typeof CertificatesApi | typeof CertificatesMockApi

export const CertificatesReduxSlice = 'app.dlp.certificates'

export enum TaskId {
  Certificates = 'certificates',
  CreateCertificate = 'createCertificate',
  DeleteCertificate = 'deleteCertificate',
}

export interface CertificateState {
  tasks?: {
    certificates: Task<PagableResponse<Certificate>>
    createCertificate: Task<Certificate>
    deleteCertificate: Task<Certificate>
  }
}

export const CertificateActionType = {
  FetchCertificatesStart: `${CertificatesReduxSlice}/fetch-certiifcates-start`,
  FetchCertificatesError: `${CertificatesReduxSlice}/fetch-certiifcates-error`,
  FetchCertificatesSuccess: `${CertificatesReduxSlice}/fetch-certiifcates-success`,

  CreateCertificateStart: `${CertificatesReduxSlice}/create-certiifcate-start`,
  CreateCertificateError: `${CertificatesReduxSlice}/create-certiifcate-error`,
  CreateCertificateSuccess: `${CertificatesReduxSlice}/create-certiifcate-success`,

  DeleteCertificateStart: `${CertificatesReduxSlice}/delete-certiifcate-start`,
  DeleteCertificateError: `${CertificatesReduxSlice}/delete-certiifcate-error`,
  DeleteCertificateSuccess: `${CertificatesReduxSlice}/delete-certiifcate-success`,
}

// eslint-disable-next-line no-redeclare
export type CertificateActionType = string
