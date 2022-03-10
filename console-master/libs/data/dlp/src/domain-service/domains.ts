//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { PagableResponse, Response } from '@ues-data/shared-types'

import { axiosInstance, tenantBaseUrl } from '../config.rest'
// import type { ValidationStatus } from '../domains/types'
import type { PageableSortableQueryParamsWithPolicesAssignment } from '../types'
import type BrowserDomainInterface from './domain-interface'
import type { BrowserDomain } from './domains-types'

export const makeBrowserDomainEndpoint = (guid?: string): string => (guid ? `${guid}` : ``)

export const makeBrowserDomainUrl = (guid?: string): string => `${tenantBaseUrl}/browserDomains/${makeBrowserDomainEndpoint(guid)}`

// TODO: draft - to be adjusted according to design
// TODO: verify domain call argumens and payload have to be negotiated

export const makeBrowserDomainVerifyUrl = (domainName?: string): string => `${tenantBaseUrl}/browserDomains/validate/${domainName}`

class BrowserDomainsClass implements BrowserDomainInterface {
  create(browserDomain: Partial<BrowserDomain>): Response<Partial<BrowserDomain> | BrowserDomain> {
    browserDomain.enabled = 'true' // TODO Should not be here!!!
    return axiosInstance().post(makeBrowserDomainUrl(), browserDomain)
  }
  read(browserDomainGuid: string): Response<BrowserDomain | Partial<BrowserDomain>> {
    return axiosInstance().get(makeBrowserDomainUrl(browserDomainGuid))
  }
  readAll(
    params?: PageableSortableQueryParamsWithPolicesAssignment<BrowserDomain>,
  ): Response<PagableResponse<BrowserDomain> | Partial<PagableResponse<BrowserDomain>>> {
    console.log('params', params)
    return axiosInstance().get(makeBrowserDomainUrl(), { params: params })
  }
  update(browserDomainGuid: string, browserDomain: Partial<BrowserDomain>): Response<BrowserDomain | Partial<BrowserDomain>> {
    return axiosInstance().put(makeBrowserDomainUrl(browserDomainGuid), browserDomain)
  }
  remove(browserDomainGuid: string): Response<unknown> {
    return axiosInstance().delete(makeBrowserDomainUrl(browserDomainGuid))
  }

  validate(domainName: string): Response<unknown> {
    return axiosInstance().get(makeBrowserDomainVerifyUrl(domainName))
  }
}

const BrowserDomainApi = new BrowserDomainsClass()

export { BrowserDomainApi }
