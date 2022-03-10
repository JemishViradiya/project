//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import { UesAxiosClient as axiosInstance } from '@ues-data/shared'

const baseUrl = '/dlp/v1'
const tenantBaseUrl = `${baseUrl}/tenant`
const policyBaseUrl = `${baseUrl}/policy`
const deviceBaseUrl = `${baseUrl}/device`
const fileBaseUrl = `${baseUrl}/file`
const remediationBaseUrl = `${baseUrl}/remediation`
const analyticsBaseUrl = `${baseUrl}/analytics`
const fileInventoryBaseUrl = `${baseUrl}/fileinventory`
const riscScoreBaseUrl = `${baseUrl}/riskscore`
const usersBaseUrl = `${baseUrl}/user`

export {
  axiosInstance,
  baseUrl,
  deviceBaseUrl,
  policyBaseUrl,
  tenantBaseUrl,
  fileBaseUrl,
  remediationBaseUrl,
  analyticsBaseUrl,
  fileInventoryBaseUrl,
  riscScoreBaseUrl,
  usersBaseUrl,
}
