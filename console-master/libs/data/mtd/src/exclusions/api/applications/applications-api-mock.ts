import type {
  BulkDeleteResponse,
  CsvRecordFailure,
  CsvResult,
  EntitiesPageableResponse,
  IAppInfo,
  PageableSortableQueryParams,
  Response,
} from '../../../types'
import type { IAppUploadInfo } from '../app-file-parser/app-file-parser-api-types'
import type ApplicationsApiInterface from './applications-api-interface'
import { apps as appsMockData, failure as failureMockData, MOCK_APP_HASH_FOR_EDIT } from './mocks'

export abstract class ApplicationsApiMockClass implements ApplicationsApiInterface {
  constructor() {
    this.search = this.search.bind(this)
  }
  createApproved(_data: IAppInfo): Promise<Response<IAppInfo>> {
    // eslint-disable-next-line prefer-rest-params
    return Promise.resolve({ data: { ..._data } })
  }

  createRestricted(_data: IAppInfo): Promise<Response<IAppInfo>> {
    // eslint-disable-next-line prefer-rest-params
    return Promise.resolve({ data: { ..._data } })
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

  editApproved(_data: IAppInfo): Promise<void> {
    // eslint-disable-next-line prefer-rest-params
    return Promise.resolve()
  }

  editRestricted(_data: IAppInfo): Promise<void> {
    if (_data.hash !== MOCK_APP_HASH_FOR_EDIT) {
      throw new Error('Edit is not expected for hash: ' + _data.hash)
    }
    return Promise.resolve()
  }

  remove(_entityId: string): Promise<void> {
    // eslint-disable-next-line prefer-rest-params
    return Promise.resolve()
  }

  removeMultiple(entityIds: string[]): Promise<BulkDeleteResponse> {
    return Promise.resolve({ totalRequested: 2, totalProcessed: 2 })
  }

  search(tenantId: string, params?: PageableSortableQueryParams<IAppInfo>): Promise<Response<EntitiesPageableResponse<IAppInfo>>> {
    // eslint-disable-next-line prefer-rest-params
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

  public abstract getData(): IAppInfo[]

  parseAppFile(appUploadInfo: IAppUploadInfo): Promise<Response<IAppInfo>> {
    return Promise.resolve(undefined)
  }
}

class ApprovedApplicationsApiMockClass extends ApplicationsApiMockClass {
  public getData(): IAppInfo[] {
    return appsMockData.filter(app => app.type === 'APPROVED')
  }
}

const ApprovedApplicationsApiMock = new ApprovedApplicationsApiMockClass()
export { ApprovedApplicationsApiMock }

class RestrictedApplicationsApiMockClass extends ApplicationsApiMockClass {
  public getData(): IAppInfo[] {
    return appsMockData.filter(app => app.type === 'RESTRICTED')
  }
}

const RestrictedApplicationsApiMock = new RestrictedApplicationsApiMockClass()
export { RestrictedApplicationsApiMock }
