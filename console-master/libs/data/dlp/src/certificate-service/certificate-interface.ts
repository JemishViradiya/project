//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { PagableResponse, Response } from '@ues-data/shared-types'

import type { PageableSortableQueryParams } from '../types'
import type { Certificate, UploadCertificateView } from './certificate-types'

export default interface CertificateInterface {
  /**
   * Creates a new certificate
   * @param uploadCertificateView The initial upload certificate view
   */
  create(uploadCertificateView: UploadCertificateView): Response<Partial<Certificate> | Certificate>

  /**
   * Gets all certificates
   */
  readAll(
    params?: PageableSortableQueryParams<Certificate>,
  ): Response<Partial<PagableResponse<Certificate>> | PagableResponse<Certificate>>

  /**
   * Deletes the certificate
   * @param alias The certificate alias (guid)
   */
  remove(alias: string): Response
}
