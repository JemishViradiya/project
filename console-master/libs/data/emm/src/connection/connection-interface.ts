import type { Response } from '@ues-data/shared'

import type { AppConfigRequest, Connections, MultiStatusResponse, UEMTenants } from './connection-types'

interface ConnectionInterface {
  /**
   * Get all connections
   */
  getConnections(): Response<unknown>

  /**
   * Add multiple connections
   */
  addConnections(newConnections: Connections[]): Response<MultiStatusResponse>

  /**
   * Remove connection
   * @param type
   */
  removeConnection(type: string, force: boolean): Response<unknown>

  /**
   * Get UEM tenant list
   */
  getUEMTenants(): Response<UEMTenants>

  /**
   * Add multiple appConfig
   * @param appConfigRequest
   * @param type
   */
  addAppConfig(appConfigRequest: AppConfigRequest, type: string): Response<MultiStatusResponse>
}

export default ConnectionInterface
