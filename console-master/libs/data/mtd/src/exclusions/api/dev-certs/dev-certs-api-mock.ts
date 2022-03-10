import type {
  CsvRecordFailure,
  CsvResult,
  EntitiesPageableResponse,
  IDeveloperCertificate,
  PageableSortableQueryParams,
  Response,
} from '../../../types'
import type { IAppUploadInfo } from '../app-file-parser/app-file-parser-api-types'
import type DeveloperCertificatesApiInterface from './dev-certs-api-interface'
import { devCertsMockData, failureMockData, MOCK_IDENTIFIER_FOR_EDIT } from './mocks'

const is = 'DeveloperCertificatesApiMockClass'

export abstract class DeveloperCertificatesApiMockClass implements DeveloperCertificatesApiInterface {
  constructor() {
    this.search = this.search.bind(this)
  }

  createApproved(_data: IDeveloperCertificate): Promise<Response<IDeveloperCertificate>> {
    // eslint-disable-next-line prefer-rest-params
    console.log(`${is}: createApproved(${[...arguments]})`)

    return Promise.resolve({ data: { ..._data } })
  }

  createRestricted(_data: IDeveloperCertificate): Promise<Response<IDeveloperCertificate>> {
    // eslint-disable-next-line prefer-rest-params
    console.log(`${is}: createRestricted(${[...arguments]})`)

    return Promise.resolve({ data: { ..._data } })
  }

  editApproved(_data: IDeveloperCertificate): Promise<void> {
    // eslint-disable-next-line prefer-rest-params
    console.log(`${is}: editApproved(${[...arguments]})`)

    return Promise.resolve()
  }

  editRestricted(_data: IDeveloperCertificate): Promise<void> {
    if (_data.identifier !== MOCK_IDENTIFIER_FOR_EDIT) {
      throw new Error('Edit is not expected for hash: ' + _data.identifier)
    }

    return Promise.resolve()
  }

  importApproved(_data: File): Promise<Response<CsvResult<CsvRecordFailure>>> {
    return Promise.resolve({
      data: {
        successes: 1,
        failures: failureMockData,
      },
    })
  }

  importRestricted(_data: File): Promise<Response<CsvResult<CsvRecordFailure>>> {
    return Promise.resolve({
      data: {
        successes: 2,
        failures: failureMockData,
      },
    })
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

  search(
    tenantId: string,
    params?: PageableSortableQueryParams<IDeveloperCertificate>,
  ): Promise<Response<EntitiesPageableResponse<IDeveloperCertificate>>> {
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

  public abstract getData(): IDeveloperCertificate[]

  parseAppFile(appUploadInfo: IAppUploadInfo): Promise<Response<IDeveloperCertificate>> {
    return Promise.resolve(undefined)
  }
}

class ApprovedDeveloperCertificatesApiMockClass extends DeveloperCertificatesApiMockClass {
  public getData(): IDeveloperCertificate[] {
    return devCertsMockData.filter(app => app.type === 'APPROVED')
  }
}
const ApprovedDeveloperCertificatesApiMock = new ApprovedDeveloperCertificatesApiMockClass()
export { ApprovedDeveloperCertificatesApiMock }

class RestrictedDeveloperCertificatesApiMockClass extends DeveloperCertificatesApiMockClass {
  public getData(): IDeveloperCertificate[] {
    return devCertsMockData.filter(app => app.type === 'RESTRICTED')
  }
}
const RestrictedDeveloperCertificatesApiMock = new RestrictedDeveloperCertificatesApiMockClass()
export { RestrictedDeveloperCertificatesApiMock }
