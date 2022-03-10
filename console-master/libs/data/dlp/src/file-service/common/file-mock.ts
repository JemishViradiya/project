/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { Response } from '@ues-data/shared'

import type { TenantConfig } from '../../tenant-settings-service'
import { CONFIG_KEY } from '../../tenant-settings-service'
import type FileServiceInterface from './file--service-interface'
import type { EvidenceFile, EvidenceFileDetails } from './file-types'

const mockedConfig = [
  {
    key: CONFIG_KEY.UPLOAD_DIRECTLY_TO_S3,
    value: 'false',
  },
]
class FileServiceClass implements FileServiceInterface {
  getConfigs(): Response<TenantConfig> {
    return Promise.resolve({ data: mockedConfig })
  }
  getFile(fileHash: string): Response<EvidenceFile> {
    return Promise.resolve({
      data: {
        blobData: new Blob(['some text']),
        fileName: 'file-test.txt',
      },
    })
  }
  getPresignedDownloadURL(fileHash: string): Response<EvidenceFile> {
    return Promise.resolve({
      data: {
        presignedDownloadURL: 'https://s3_file_server',
        fileName: 'file-test.jpg',
      },
    })
  }
  getFileDetails(fileHash: string): Response<EvidenceFileDetails> {
    return Promise.resolve({
      data: {
        hash: '01dfae6e5d4d90d9892622325959afbe',
        users: [
          {
            id: 'd40bfa6380414eb48ff27a44b3e41f58',
            name: 'Gilbert Hale',
            email: 'ghale@blackberry.com',
            title: 'Hilbert Hale title',
            department: 'Hilbert Hale department',
          },
          {
            id: '325959afbe14eb48ff27a44b3e41f58',
            name: 'John Smith',
            email: 'jsmith@blackberry.com',
            title: 'Architect',
            department: 'Engineering',
          },
        ],
        devices: [
          {
            guid: '4321',
            name: 'DLP1',
          },
          {
            guid: '8765',
            name: 'TestDlp2',
          },
        ],
      },
    })
  }
}

const FileServiceMock = new FileServiceClass()

export { FileServiceMock }
