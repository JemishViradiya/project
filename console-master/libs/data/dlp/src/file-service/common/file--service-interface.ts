/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { Response } from '@ues-data/shared'

import type { TenantConfig } from '../../tenant-settings-service/configs-types'
import type { EvidenceFile, EvidenceFileDetails } from './file-types'

interface FileServiceInterface {
  getConfigs(): Response<TenantConfig>
  getFile(fileHash: string): Response<EvidenceFile>
  getPresignedDownloadURL(fileHash: string): Response<EvidenceFile>
  getFileDetails(fileHash: string): Response<EvidenceFileDetails>
}

export default FileServiceInterface
