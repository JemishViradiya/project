//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { PagableResponse, Response } from '@ues-data/shared-types'

import { axiosInstance, tenantBaseUrl } from '../config.rest'
import type { PageableSortableQueryParams } from '../types'
import type CertificateInterface from './certificate-interface'
import type { Certificate, UploadCertificateView } from './certificate-types'

const makeCertificateEndpoint = (alias?: string): string => (alias ? `${alias}` : ``)

export const makeCertificateUrl = (alias?: string): string => `${tenantBaseUrl}/certificates/${makeCertificateEndpoint(alias)}`

class CertificatesClass implements CertificateInterface {
  create(uploadCertificateView: UploadCertificateView): Response<Certificate | Partial<Certificate>> {
    return axiosInstance().post(makeCertificateUrl(), uploadCertificateView)
  }
  readAll(
    params?: PageableSortableQueryParams<Certificate>,
  ): Response<PagableResponse<Certificate> | Partial<PagableResponse<Certificate>>> {
    return axiosInstance().get(makeCertificateUrl(), { params: params })
  }
  remove(alias: string): Response<unknown> {
    return axiosInstance().delete(makeCertificateUrl(alias))
  }
}

const CertificatesApi = new CertificatesClass()

export { CertificatesApi }
