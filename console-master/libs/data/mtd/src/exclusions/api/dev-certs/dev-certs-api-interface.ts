import type { EntitiesPageableResponse, IDeveloperCertificate, PageableSortableQueryParams, Response } from '../../../types'
import type { IAppUploadInfo } from '../app-file-parser/app-file-parser-api-types'

export default interface DeveloperCertificatesApiInterface {
  /**
   * Search developer certificates in a scope of tenantId
   * @param tenantId be used to restrict search by tenant scope
   * @param params PageableSortableQueryParams
   */
  search(
    tenantId: string,
    params: PageableSortableQueryParams<IDeveloperCertificate>,
  ): Promise<Response<EntitiesPageableResponse<IDeveloperCertificate>>>

  /**
   * Creates a new approved developer certificate for this tenant
   * @param data developer certificate
   */
  createApproved(data: IDeveloperCertificate): Promise<Response<IDeveloperCertificate>>

  /**
   * Creates a new restricted developer certificate for this tenant
   * @param data developer certificate info
   */
  createRestricted(data: IDeveloperCertificate): Promise<Response<IDeveloperCertificate>>

  /**
   * Edit an approved developer certificate for this tenant
   * @param data developer certificate info
   */
  editApproved(data: IDeveloperCertificate): Promise<void>

  /**
   * Edit a restricted developer certificate for this tenant
   * @param data developer certificate info
   */
  editRestricted(data: IDeveloperCertificate): Promise<void>

  /**
   * Deletes the developer certificate
   * @param entityId The entity id
   */
  remove(entityId: string): Promise<void>

  /**
   * Deletes multiple developer certificates
   * @param entityIds Certificate ids
   */
  removeMultiple(entityIds: string[]): Promise<void>

  /**
   * Parse Android or iOS application binary and return developer certificate object
   * @param appUploadInfo
   */
  parseAppFile(appUploadInfo: IAppUploadInfo): Promise<Response<IDeveloperCertificate>>
}
