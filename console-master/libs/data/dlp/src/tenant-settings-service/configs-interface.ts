//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { Response } from '@ues-data/shared-types'

import type { FileSettings, FileSettingsProperties, RemediationSettings, TenantConfig } from './configs-types'

export default interface TenantConfigsInterface {
  /**
   * Get all available tenant configs
   */
  readAll(): Response<TenantConfig>

  /**
   * Updates tenant settings in the Tenant Service
   */
  update(tenantConfigArray: TenantConfig): Response

  /**
   * Gets File settings
   */
  getFileSettings(): Response<FileSettingsProperties>

  /**
    * Updates a File setting

    */
  updateFileSetting(fileSettings: FileSettings): Response

  /**
   * Gets Remediation settings
   */
  getRemediationSettings(): Response<RemediationSettings>

  /**
   * Updates Remediation setting
   * @param settings
   */
  updateRemediationSettings(settings: RemediationSettings): Response<RemediationSettings>
}
