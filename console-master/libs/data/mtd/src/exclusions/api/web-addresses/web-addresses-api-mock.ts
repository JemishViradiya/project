import type { Response } from '@ues-data/shared'

import type { CsvRecordFailure, CsvResult, EntitiesPageableResponse, PageableSortableQueryParams } from '../../../types'
import type WebAddressesApiInterface from './web-addresses-api-interface'
import type { IWebAddress } from './web-addresses-api-types'

const is = 'WebAddressesApiMockClass'

const MOCK_TENANT_GUID = '3d55abd2-c00e-4f5f-abcf-01c92ac777b1'
const webAddressesMockData: IWebAddress[] = [
  {
    guid: 'e9a2b066-d37c-4890-94c0-7953e717e635',
    type: 'APPROVED',
    tenantGuid: MOCK_TENANT_GUID,
    addressType: 'IP',
    value: '127.0.0.1',
    description: 'Mock approved description for ip address 1',
  },
  {
    guid: 'e4b1c014-d37c-4890-94c0-7953e717a117',
    type: 'APPROVED',
    tenantGuid: MOCK_TENANT_GUID,
    addressType: 'IP',
    value: '168.10.10.1',
    description: 'Mock approved description for ip address 2',
  },
  {
    guid: 'e9a2b066-d37c-4890-94c0-7953e717e634',
    type: 'RESTRICTED',
    tenantGuid: MOCK_TENANT_GUID,
    addressType: 'IP',
    value: '127.0.0.1',
    description: 'Mock restricted description for ip address 1',
  },
  {
    guid: 'e4b1c014-d37c-4890-94c0-7953e717a123',
    type: 'RESTRICTED',
    tenantGuid: MOCK_TENANT_GUID,
    addressType: 'IP',
    value: '168.10.10.1',
    description: 'Mock restricted description for ip address 2',
  },
  {
    guid: 'e9a2b066-d37c-4890-94c0-7953e717e632',
    type: 'APPROVED',
    tenantGuid: MOCK_TENANT_GUID,
    addressType: 'HOST',
    value: 'approvedmockdomain1.com',
    description: 'Mock approved description for domain 1',
  },
  {
    guid: 'e4b1c014-d37c-4890-94c0-7953e717a127',
    type: 'APPROVED',
    tenantGuid: MOCK_TENANT_GUID,
    addressType: 'HOST',
    value: 'approvedmockdomain2.com',
    description: 'Mock approved description for domain 2',
  },
  {
    guid: 'e9a2b066-d37c-4890-94c0-7953e717e630',
    type: 'RESTRICTED',
    tenantGuid: MOCK_TENANT_GUID,
    addressType: 'HOST',
    value: 'restrictedmockdomain1.com',
    description: 'Mock restricted description for domain 1',
  },
  {
    guid: 'e4b1c014-d37c-4890-94c0-7953e717a121',
    type: 'RESTRICTED',
    tenantGuid: MOCK_TENANT_GUID,
    addressType: 'HOST',
    value: 'restrictedmockdomain2.com',
    description: 'Mock restricted description for domain 2',
  },
]

export const failureMockData: CsvRecordFailure[] = [
  {
    recordNumber: 1,
    errorInfo: {
      subStatusCode: 111,
      message: 'message',
      params: [],
    },
  },
]

export abstract class WebAddressesApiMockClass implements WebAddressesApiInterface {
  constructor() {
    this.searchIpAddresses = this.searchIpAddresses.bind(this)
    this.searchDomains = this.searchDomains.bind(this)
  }

  createApprovedIpAddress(_data: IWebAddress): Response<IWebAddress> {
    // eslint-disable-next-line prefer-rest-params
    console.log(`${is}: createApprovedIpAddresses(${[...arguments]})`)

    return Promise.resolve({ data: { ..._data } })
  }

  createRestrictedIpAddress(_data: IWebAddress): Response<IWebAddress> {
    // eslint-disable-next-line prefer-rest-params
    console.log(`${is}: createRestrictedIpAddresses(${[...arguments]})`)

    return Promise.resolve({ data: { ..._data } })
  }

  createApprovedDomain(_data: IWebAddress): Response<IWebAddress> {
    // eslint-disable-next-line prefer-rest-params
    console.log(`${is}: createApprovedDomain(${[...arguments]})`)

    return Promise.resolve({ data: { ..._data } })
  }

  createRestrictedDomain(_data: IWebAddress): Response<IWebAddress> {
    // eslint-disable-next-line prefer-rest-params
    console.log(`${is}: createRestrictedDomain(${[...arguments]})`)
    return Promise.resolve({ data: { ..._data } })
  }

  editApprovedIpAddress(_data: IWebAddress): Promise<void> {
    // eslint-disable-next-line prefer-rest-params
    console.log(`${is}: editApprovedIpAddresses(${[...arguments]})`)

    return Promise.resolve()
  }

  editRestrictedIpAddress(_data: IWebAddress): Promise<void> {
    // eslint-disable-next-line prefer-rest-params
    console.log(`${is}: editRestrictedIpAddresses(${[...arguments]})`)

    return Promise.resolve()
  }

  editApprovedDomain(_data: IWebAddress): Promise<void> {
    // eslint-disable-next-line prefer-rest-params
    console.log(`${is}: editApprovedDomain(${[...arguments]})`)

    return Promise.resolve()
  }

  editRestrictedDomain(_data: IWebAddress): Promise<void> {
    // eslint-disable-next-line prefer-rest-params
    console.log(`${is}: editRestrictedDomain(${[...arguments]})`)

    return Promise.resolve()
  }

  importApprovedMock(_data: File): Promise<Response<CsvResult<CsvRecordFailure>>> {
    return Promise.resolve({
      data: {
        successes: 1,
        failures: failureMockData,
      },
    }).then()
  }

  importApprovedIpAddress(_data: File): Promise<Response<CsvResult<CsvRecordFailure>>> {
    return this.importApprovedMock(_data)
  }

  importRestrictedIpAddress(_data: File): Promise<Response<CsvResult<CsvRecordFailure>>> {
    return this.importApprovedMock(_data)
  }

  importApprovedDomain(_data: File): Promise<Response<CsvResult<CsvRecordFailure>>> {
    return this.importApprovedMock(_data)
  }

  importRestrictedDomain(_data: File): Promise<Response<CsvResult<CsvRecordFailure>>> {
    return this.importApprovedMock(_data)
  }

  remove(_entityId: string): Promise<void> {
    // eslint-disable-next-line prefer-rest-params
    console.log(`${is}: remove(${[...arguments]})`)

    return Promise.resolve()
  }

  removeMultiple(entityIds: string[]): Promise<void> {
    // eslint-disable-next-line prefer-rest-params
    console.log(`${is}: removeMultiple(${[...arguments]})`)

    return Promise.resolve()
  }

  searchIpAddresses(
    tenantId: string,
    params: PageableSortableQueryParams<IWebAddress>,
  ): Response<EntitiesPageableResponse<IWebAddress>> {
    return this.search(tenantId, params)
  }

  searchDomains(
    tenantId: string,
    params: PageableSortableQueryParams<IWebAddress>,
  ): Response<EntitiesPageableResponse<IWebAddress>> {
    return this.search(tenantId, params)
  }

  protected search(
    tenantId: string,
    params?: PageableSortableQueryParams<IWebAddress>,
  ): Response<EntitiesPageableResponse<IWebAddress>> {
    // eslint-disable-next-line prefer-rest-params
    console.log(`${is}: search(${[...arguments]})`)

    const result = this.getData()

    return Promise.resolve({
      data: {
        totals: {
          pages: 1,
          elements: 2,
        },
        navigation: {
          next: 'next',
          previous: 'prev',
        },
        count: 2,
        elements: result,
      },
    })
  }

  public abstract getData(): IWebAddress[]
}

class ApprovedIPAddressesApiMockClass extends WebAddressesApiMockClass {
  public getData(): IWebAddress[] {
    return webAddressesMockData.filter(item => item.type === 'APPROVED' && item.addressType === 'IP')
  }
}
const ApprovedIPAddressesApiMock = new ApprovedIPAddressesApiMockClass()
export { ApprovedIPAddressesApiMock }

class RestrictedIPAddressesApiMockClass extends WebAddressesApiMockClass {
  public getData(): IWebAddress[] {
    return webAddressesMockData.filter(item => item.type === 'RESTRICTED' && item.addressType === 'IP')
  }
}
const RestrictedIPAddressesApiMock = new RestrictedIPAddressesApiMockClass()
export { RestrictedIPAddressesApiMock }

class ApprovedDomainsApiMockClass extends WebAddressesApiMockClass {
  public getData(): IWebAddress[] {
    return webAddressesMockData.filter(item => item.type === 'APPROVED' && item.addressType === 'HOST')
  }
}
const ApprovedDomainsApiMock = new ApprovedDomainsApiMockClass()
export { ApprovedDomainsApiMock }

class RestrictedDomainsApiMockClass extends WebAddressesApiMockClass {
  public getData(): IWebAddress[] {
    return webAddressesMockData.filter(item => item.type === 'RESTRICTED' && item.addressType === 'HOST')
  }
}
const RestrictedDomainsApiMock = new RestrictedDomainsApiMockClass()
export { RestrictedDomainsApiMock }
