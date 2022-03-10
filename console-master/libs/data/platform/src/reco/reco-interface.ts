import type { PagableResponse, ReconciliationEntity, ReconciliationEntityDefinition, Response } from '@ues-data/shared'

export default interface RecoInterface {
  getDefinitions(): Response<PagableResponse<ReconciliationEntityDefinition>>

  getEntities(query?: string, max?: number, sortBy?: string): Response<PagableResponse<ReconciliationEntity>>

  getGroupAssignments(id: string): Response<PagableResponse<{ groupId: string; serviceId: string; entityId: string }>>
}
