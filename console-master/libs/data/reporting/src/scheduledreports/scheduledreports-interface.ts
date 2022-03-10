import type { Response } from '@ues-data/shared'

import type { ScheduledReport } from './scheduledreports-types'

export default interface ScheduledReportsInterface {
  /**
   * Creates a new Scheduled Report for this tenant
   * @param tenantId The tenant id
   * @param data The initial Scheduled Report data
   */
  create(tenantId: string, data: ScheduledReport): Response<ScheduledReport>

  /**
   * Get a Scheduled Report
   * @param tenantId The tenant id
   * @param guid The entity id
   */
  get(tenantId: string, guid: string): Response<ScheduledReport>

  /**
   * Get all Scheduled Reports
   * @param tenantId The tenant
   */
  getAll(tenantId: string): Response<Array<ScheduledReport>>

  /**
   * Update a Scheduled Report
   * @param tenantId The tenant
   * @param guid The guid
   * @param data The updated Scheduled Report data
   */
  update(tenantId: string, guid: string, data: Partial<ScheduledReport>): Response<ScheduledReport>

  /**
   * Deletes the Scheduled Report
   * @param tenantId The tenant id
   * @param guid The guid id
   */
  remove(tenantId: string, guid: string): Promise<void>
}
