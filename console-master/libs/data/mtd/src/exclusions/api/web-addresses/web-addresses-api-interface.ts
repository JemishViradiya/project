import type { Response } from '@ues-data/shared'

import type { EntitiesPageableResponse, PageableSortableQueryParams } from '../../../types'
import type { IWebAddress } from './web-addresses-api-types'

export default interface WebAddressesApiInterface {
  /**
   * Search ip addresses in a scope of tenantId
   * @param tenantId be used to restrict search by tenant scope
   * @param params PageableSortableQueryParams
   */
  searchIpAddresses(
    tenantId: string,
    params: PageableSortableQueryParams<IWebAddress>,
  ): Response<EntitiesPageableResponse<IWebAddress>>

  /**
   * Search web domains in a scope of tenantId
   * @param tenantId be used to restrict search by tenant scope
   * @param params PageableSortableQueryParams
   */
  searchDomains(tenantId: string, params: PageableSortableQueryParams<IWebAddress>): Response<EntitiesPageableResponse<IWebAddress>>

  /**
   * Creates a new approved ip address for this tenant
   * @param data ip address
   */
  createApprovedIpAddress(data: IWebAddress): Response<IWebAddress>

  /**
   * Creates a new restricted ip address for this tenant
   * @param data ip address info
   */
  createRestrictedIpAddress(data: IWebAddress): Response<IWebAddress>

  /**
   * Creates a new approved web domain for this tenant
   * @param data ip address
   */
  createApprovedDomain(data: IWebAddress): Response<IWebAddress>

  /**
   * Creates a new restricted web domain for this tenant
   * @param data ip address info
   */
  createRestrictedDomain(data: IWebAddress): Response<IWebAddress>

  /**
   * Edit an approved ip address for this tenant
   * @param data ip address info
   */
  editApprovedIpAddress(data: IWebAddress): Promise<void>

  /**
   * Edit a restricted ip address for this tenant
   * @param data ip address info
   */
  editRestrictedIpAddress(data: IWebAddress): Promise<void>

  /**
   * Edit an approved web domain for this tenant
   * @param data ip address info
   */
  editApprovedDomain(data: IWebAddress): Promise<void>

  /**
   * Edit a restricted web domain for this tenant
   * @param data ip address info
   */
  editRestrictedDomain(data: IWebAddress): Promise<void>

  /**
   * Deletes the address
   * @param entityId The entity id
   */
  remove(entityId: string): Promise<void>

  /**
   * Deletes multiple addresses
   * @param entityIds Address ids
   */
  removeMultiple(entityIds: string[]): Promise<void>
}
