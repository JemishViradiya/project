import type { IAppInfo } from '../applications/applications-api-types'
import type { IDeveloperCertificate } from '../dev-certs/dev-certs-api-types'

export enum AppUploadParseResultType {
  Application,
  Certificate,
}

export interface IAppUploadInfo {
  resultType: AppUploadParseResultType
  fileName: string
  content: any
}

export type UploadInfo = {
  key: string
  url: string
}

export const UPLOAD_TIMEOUT = 10 * 60 * 1000

export type IParsedAppInfo = IAppInfo | IDeveloperCertificate

export default void 0
