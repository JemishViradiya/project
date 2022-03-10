//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

export enum LicenseType {
  ADMIN_CONSENT = 'ADMIN_CONSENT',
  HELM_LICENSE = 'HELM_LICENSE',
  BLACKBERRY_INTERNAL = 'BLACKBERRY_INTERNAL',
}

export interface AuthorizedSoftware {
  id: string
  client_ids: string[]
  is_use_kerberos_zso?: boolean
  is_use_mobile_zso?: boolean
  license_type: LicenseType
  scope: string
  software_id: string
  tenant_id: string
  created?: string
  last_modified?: string
}
// eslint-disable-next-line no-redeclare
export const AuthorizedSoftware = void 0
