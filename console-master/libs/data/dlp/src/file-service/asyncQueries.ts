/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { AsyncMutation } from '@ues-data/shared'

import { CONFIG_KEY } from '../tenant-settings-service'
import { FileService } from './common'
import type { EvidenceFile } from './common/file-types'

const retrieveFileName = res => res?.headers['content-disposition']?.split('filename=')[1]?.replaceAll('"', '') || 'evidence.file'

export const downloadEvidenceFile: AsyncMutation<EvidenceFile, { fileHash: string }> = {
  mutation: async ({ fileHash }) => {
    const configs = await FileService.getConfigs()
    const isS3UploadAllowed = configs?.data.find(item => item.key.includes(CONFIG_KEY.UPLOAD_DIRECTLY_TO_S3))?.value === 'true'
    // Depend on uploadDirectlyToS3 flag that could be set in the settings page
    // evidence files are retrievable from S3 directly or via File service
    if (isS3UploadAllowed) {
      const presignedDownloadURL = await FileService.getPresignedDownloadURL(fileHash)
      const fileName = retrieveFileName(presignedDownloadURL)
      return {
        presignedDownloadURL: presignedDownloadURL?.data.url,
        fileName,
      }
    } else {
      const file = await FileService.getFile(fileHash)
      const fileName = retrieveFileName(file)
      return { blobData: new Blob([file.data]), fileName }
    }
  },
  mockMutationFn: ({ fileHash }) => {
    // TODO need to think how implement case when 'isS3UploadAllowed' is true
    return { blobData: new Blob(['some mock data']), fileName: 'test_file.txt' }
  },
}
