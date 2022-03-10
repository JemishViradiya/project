//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

/* eslint-disable prefer-rest-params, sonarjs/no-duplicate-string */

import { v4 as uuidv4 } from 'uuid'

import type { PagableResponse, Response } from '@ues-data/shared-types'

import type { PageableSortableQueryParams } from '../types'
import type CertificateInterface from './certificate-interface'
import type { Certificate, UploadCertificateView } from './certificate-types'

const is = 'CertificatesClass'

export const uploadCertificateView: UploadCertificateView = {
  certificate: '<base64-data-of-certificate>',
}

export const mockedCertificate = {
  alias: 'edf1b42f-48d3-4551-b73b-ea552aeba864',
  subject: 'CN=BlackBerry Corporate RSA Issuing CA 4,DC=rim,DC=net',
  created: '2021-05-06T15:57:26Z',
  expiryDate: '2024-02-05T21:25:01Z',
  thumbprint: '1bd1b5c42b8022c76d97356d45e414559e5a75fdff71901b8269384e23fc724a',
  issuer: 'CN=BlackBerry Enterprise RSA Root CA 1, OU=BlackBerry Enterprise PKI, O=BlackBerry Limited, C=CA',
}

export const mockedCertificates: Certificate[] = [
  {
    alias: 'd53dd81f-0c97-454a-81e3-4c5f79289ce2',
    subject: 'CN=DigiCert Global Root CA,OU=www.digicert.com,O=DigiCert Inc,C=US',
    created: '2021-05-06T15:57:39Z',
    expiryDate: '2031-11-10T00:00:00Z',
    thumbprint: '4348a0e9444c78cb265e058d5e8944b4d84f9662bd26db257f8934a443c70161',
    issuer: 'CN=DigiCert Global Root CA, OU=www.digicert.com, O=DigiCert Inc, C=US',
  },
  {
    alias: '6d93e1d7-4b51-479a-adb8-4800fbb691eb',
    subject: 'CN=www.google.com,O=Google LLC,L=Mountain View,ST=California,C=US',
    created: '2021-05-06T15:56:59Z',
    expiryDate: '2021-05-14T10:17:31Z',
    thumbprint: 'a4d10bbb45a6e3d0394a2af31f36228609bd09e0bdb05956a73ca6731b586368',
    issuer: 'CN=GTS CA 1O1, O=Google Trust Services, C=US',
  },
  mockedCertificate,
]

export const certificatesResponse = (params?: PageableSortableQueryParams<Certificate>): PagableResponse<Certificate> => ({
  totals: {
    pages: 1,
    elements: mockedCertificates.length,
  },
  navigation: {
    next: 'next',
    previous: 'prev',
  },
  count: mockedCertificates.length,
  elements: params ? mockedCertificates.slice(0, params?.max) : mockedCertificates,
})

class CertificatesMockClass implements CertificateInterface {
  readAll(
    params?: PageableSortableQueryParams<Certificate>,
  ): Response<PagableResponse<Certificate> | Partial<PagableResponse<Certificate>>> {
    return Promise.resolve({ data: certificatesResponse(params) })
  }
  remove(alias: string): Response<unknown> {
    console.log(`${is}: remove(${[...arguments]})`)
    const index = mockedCertificates.findIndex(element => element.alias === alias)
    if (index >= 0) {
      if (index === 1) {
        return Promise.reject({
          response: {
            status: 400,
          },
        })
      } else {
        mockedCertificates.splice(index, 1)
        return Promise.resolve({})
      }
    }
    return Promise.reject({ error: 'CertifateNotFound' })
  }
  create(uploadCertificateView: UploadCertificateView): Response<Partial<Certificate> | Certificate> {
    console.log(`${is}: create(${[...arguments]})`)
    mockedCertificate.alias = uuidv4()
    mockedCertificates.push(mockedCertificate)
    console.log(`${is}: mock get certificates ${JSON.stringify(mockedCertificate)}`)
    return Promise.resolve({
      data: mockedCertificate,
    })
  }
}

const CertificatesMockApi = new CertificatesMockClass()

export { CertificatesMockApi }
