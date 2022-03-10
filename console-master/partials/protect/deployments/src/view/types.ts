import type { OsFamily, PreSignedUrl, Product } from '@ues-data/epp'

import type {
  GET_BUILD_VERSIONS,
  GET_HYBRID_INSTALLER_SCRIPT_AND_KEY,
  GET_OS_FAMILIES,
  GET_PACKAGES,
  GET_PRESIGNED_URL,
  GET_PRODUCTS,
} from './constants'

export interface GetPreSignedUrlAction {
  type: typeof GET_PRESIGNED_URL
  presignedUrl: PreSignedUrl
}

export interface GetBuildVersionsAction {
  type: typeof GET_BUILD_VERSIONS
  product: Product
  osFamily: OsFamily
}

export interface GetProductsAction {
  type: typeof GET_PRODUCTS
}

export interface GetHybridInstallerScriptAndKeyAction {
  type: typeof GET_HYBRID_INSTALLER_SCRIPT_AND_KEY
}

export interface GetOsFamiliesAction {
  type: typeof GET_OS_FAMILIES
  product: Product
}

export interface BuildVersion {
  version: string
}

export interface GetPackagesAction {
  type: typeof GET_PACKAGES
  osFamily: OsFamily
  product: Product
  version: BuildVersion
}
