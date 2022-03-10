import type { Response } from '@ues-data/shared'

import type { DirectoryGroup, DirectoryInstance, DirectoryUser, SyncState, SyncType } from './directory-types'

interface DirectoryInterface {
  /**
   * Search Directory Users
   * @param tenantId The tenant
   */
  searchUsers(tenantId: string, search: string): Response<Array<DirectoryUser>>

  /**
   * Search Directory Groups
   * @param search
   */
  searchGroups(search: string): Response<Array<DirectoryGroup>>

  /**
   * gte single directory
   * @param directoryInstanceId
   */
  getDirectoryInstance(directoryInstanceId: string): Response<DirectoryInstance>

  /**
   * Get all directoris
   */
  getDirectories(): Response<DirectoryInstance[]>

  /**
   * Get boolean that defines whether a directory is configured
   * true - directory is configured
   * false - directory is NOT configured
   */
  getDirectoryConfigured(): Response<boolean>

  /**
   * Add directory
   * @param directory
   */
  addDirectory(directory: DirectoryInstance): Response<DirectoryInstance>

  /**
   * Remove directory
   * @param id
   */
  removeDirectory(id: string): Promise<void>

  /**
   * Edit directory
   */
  editDirectory(directory: DirectoryInstance): Response<DirectoryInstance>

  /**
   * Get directory sync status
   */
  getSync(id: string): Response<SyncState>

  startSync(id: string, type: SyncType): Promise<void>

  cancelSync(id: string): Promise<void>
}

const DirectoryInterface = void 0

export default DirectoryInterface
