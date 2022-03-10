//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { PagableResponse, Response } from '@ues-data/shared-types'

import type { PageableSortableQueryParamsWithPolicesAssignment } from '../types'
import type { BrowserDomain } from './domains-types'

export default interface BrowserDomainInterface {
  /**
   * Creates a new domain for this tenant
   * @param browserDomain The initial domain
   */
  create(browserDomain: Partial<BrowserDomain>): Response<Partial<BrowserDomain> | BrowserDomain>

  /**
   * Gets the domain
   * @param browserDomainGuid The domain guid
   */
  read(browserDomainGuid: string): Response<Partial<BrowserDomain> | BrowserDomain>

  /**
   * Gets all domains
   */
  readAll(
    params?: PageableSortableQueryParamsWithPolicesAssignment<BrowserDomain>,
  ): Response<Partial<PagableResponse<BrowserDomain>> | PagableResponse<BrowserDomain>>

  /**
   * Updates the domain
   * @param browserDomainGuid The domain guid
   * @param browserDomain The updated domain data
   */
  update(browserDomainGuid: string, browserDomain: Partial<BrowserDomain>): Response<Partial<BrowserDomain> | BrowserDomain>

  /**
   * Deletes the domain
   * @param browserDomainGuid The domain guid
   */
  remove(browserDomainGuid: string): Response

  /**
   * Test whether TLS certificate assosiated with provided domain name, has added to DLP certificate storage
   * @param domainName domain name
   */
  validate(domainName: string): Response<unknown>
}
