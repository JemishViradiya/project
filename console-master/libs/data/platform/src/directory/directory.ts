//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.
import type { Response } from '@ues-data/shared'

import { axiosInstance, baseUrl } from '../config.rest'
import type DirectoryInterface from './directory-interface'
import type { DirectoryGroup, DirectoryInstance, DirectoryUser, SyncState, SyncType } from './directory-types'

const directoryBaseUrl = `${baseUrl}/v1/directory`

const makeEndpoint = (urlPart?: string): string => (urlPart ? `${urlPart}` : ``)

export const makeDirectoryInstanceUrl = (urlPart?: string): string => `${directoryBaseUrl}/instance/${makeEndpoint(urlPart)}`
export const makeDirectorySearchUrl = (urlPart?: string): string => `${directoryBaseUrl}/search/${makeEndpoint(urlPart)}`

class DirectoryClass implements DirectoryInterface {
  getDirectories(): Response<DirectoryInstance[]> {
    return axiosInstance().get(makeDirectoryInstanceUrl())
  }
  getDirectoryConfigured(): Response<boolean> {
    return axiosInstance().get(makeDirectoryInstanceUrl('configured'))
  }
  addDirectory(directory: DirectoryInstance): Response<DirectoryInstance> {
    return axiosInstance().post(makeDirectoryInstanceUrl(), directory)
  }
  removeDirectory(id: string): Promise<void> {
    return axiosInstance().delete(makeDirectoryInstanceUrl(id))
  }
  editDirectory(directory: DirectoryInstance): Response<DirectoryInstance> {
    return axiosInstance().put(makeDirectoryInstanceUrl(directory.id), directory)
  }
  getDirectoryInstance(directoryInstanceId: string): Response<DirectoryInstance> {
    return axiosInstance().get(makeDirectoryInstanceUrl(directoryInstanceId))
  }
  getSync(id: string): Response<SyncState> {
    return axiosInstance().get(makeDirectoryInstanceUrl(`${id}/sync`))
  }
  startSync(id: string, type: SyncType): Promise<void> {
    return axiosInstance().post(makeDirectoryInstanceUrl(`${id}/sync`), null, { params: { type } })
  }
  cancelSync(id: string): Promise<void> {
    return axiosInstance().delete(makeDirectoryInstanceUrl(`${id}/sync`))
  }
  searchGroups(search: string): Response<DirectoryGroup[]> {
    return axiosInstance().get(makeDirectorySearchUrl('groups'), {
      params: {
        search: search,
      },
    })
  }
  searchUsers(tenantId: string, search: string): Response<DirectoryUser[]> {
    return axiosInstance().get(makeDirectorySearchUrl('users'), {
      headers: {
        'tenant-id': tenantId,
      },
      params: {
        search: search,
      },
    })
  }
}

const Directory = new DirectoryClass()

export { Directory }
