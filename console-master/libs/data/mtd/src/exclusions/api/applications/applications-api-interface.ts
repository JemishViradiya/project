import type { BulkDeleteResponse, EntitiesPageableResponse, IAppInfo, PageableSortableQueryParams, Response } from '../../../types'
import type { IAppUploadInfo } from '../app-file-parser/app-file-parser-api-types'

export default interface ApplicationsApiInterface {
  /**
   * Generate documentation here
   */
  search(tenantId: string, params: PageableSortableQueryParams<IAppInfo>): Promise<Response<EntitiesPageableResponse<IAppInfo>>>

  /**
   * Creates a new approved application for this tenant
   * @param data application info
   */
  createApproved(data: IAppInfo): Promise<Response<IAppInfo>>

  /**
   * Creates a new restricted application for this tenant
   * @param data application info
   */
  createRestricted(data: IAppInfo): Promise<Response<IAppInfo>>

  /**
   * Edit an approved application for this tenant
   * @param data application info
   */
  editApproved(data: IAppInfo): Promise<void>

  /**
   * Edit a restricted application for this tenant
   * @param data application info
   */
  editRestricted(data: IAppInfo): Promise<void>

  /**
   * Deletes the application
   * @param entityId The entity id
   */
  remove(entityId: string): Promise<void>

  /**
   * Deletes multiple applications
   * @param entityIds The entities ids
   */
  removeMultiple(entityIds: string[]): Promise<BulkDeleteResponse>

  /**
   * Parse Android or iOS application binary and return application object
   * @param appUploadInfo
   */
  parseAppFile(appUploadInfo: IAppUploadInfo): Promise<Response<IAppInfo>>
}
