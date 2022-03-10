/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { PagableResponse } from '@ues-data/shared-types'

import type { Certificate, UploadCertificateView } from '../certificate-service'
import type { PageableSortableQueryParams } from '../types'
import type { ApiProvider } from './types'
import { CertificateActionType } from './types'

//fetch certificates
export const fetchCertificatesStart = (payload: PageableSortableQueryParams<Certificate>, apiProvider: ApiProvider) => ({
  type: CertificateActionType.FetchCertificatesStart,
  payload: { queryParams: payload, apiProvider },
})

export const fetchCertificateSuccess = (payload: PagableResponse<Certificate>) => ({
  type: CertificateActionType.FetchCertificatesSuccess,
  payload,
})

export const fetchCertificateError = (error: Error) => ({
  type: CertificateActionType.FetchCertificatesError,
  payload: { error },
})

//create certificate
export const createCertificateStart = (payload: UploadCertificateView, apiProvider: ApiProvider) => ({
  type: CertificateActionType.CreateCertificateStart,
  payload: { apiProvider, certificate: payload },
})

export const createCertificateSuccess = (payload: Certificate) => ({
  type: CertificateActionType.CreateCertificateSuccess,
  payload,
})

export const createCertificateError = (error: Error) => ({
  type: CertificateActionType.CreateCertificateError,
  payload: { error },
})

//delete certificate
export const deleteCertificateStart = (payload: { alias: string }, apiProvider: ApiProvider) => ({
  type: CertificateActionType.DeleteCertificateStart,
  payload: { ...payload, apiProvider },
})

export const deleteCertificateSuccess = () => ({
  type: CertificateActionType.DeleteCertificateSuccess,
})

export const deleteCertificateError = (error: Error) => ({
  type: CertificateActionType.DeleteCertificateError,
  payload: { error },
})
