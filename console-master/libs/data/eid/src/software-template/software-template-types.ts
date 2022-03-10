//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

export interface SoftwareTemplate {
  id: string
  name: string
  scope: string
  is_global: boolean
  client_metadata: any
  allow_tpc_auth?: boolean
  org_id: string
  is_display_in_template_list?: boolean
  is_display_as_authorized_software?: boolean
  skip_authorized_software_check?: boolean
  is_static?: boolean
  version?: string
  restricted?: boolean
  created?: string
  last_modified?: string
}
// eslint-disable-next-line no-redeclare
export const SoftwareTemplate = void 0
