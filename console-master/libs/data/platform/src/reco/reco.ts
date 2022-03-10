//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.
import type { PagableResponse, ReconciliationEntity, ReconciliationEntityDefinition, Response } from '@ues-data/shared'
import { UesAxiosClient } from '@ues-data/shared'

import type RecoInterface from './reco-interface'

const makeUrl = (suffix: string): string => `/platform/v1/reconciliation${suffix}`

class ReconciliationClass implements RecoInterface {
  getDefinitions(): Response<PagableResponse<ReconciliationEntityDefinition>> {
    return UesAxiosClient().get(makeUrl('/definitions'))
  }
  getEntities(query?: string, max = 1000, sortBy = 'name'): Response<PagableResponse<ReconciliationEntity>> {
    return UesAxiosClient().get(makeUrl('/entities'), { params: { query, max, sortBy } })
  }
  getGroupAssignments(id: string): Response<PagableResponse<{ groupId: string; serviceId: string; entityId: string }>> {
    return UesAxiosClient().get(makeUrl(`/assignments/groups/${id}`))
  }
  assignToGroup(id: string, policies: { serviceId: string; entityId: string }[]): Promise<void> {
    return UesAxiosClient().get(makeUrl(`/assignments/groups/${id}`))
  }
  unassignFromGroup(id: string, policies: { serviceId: string; entityId: string }[]): Promise<void> {
    return UesAxiosClient().get(makeUrl(`/assignments/groups/${id}`))
  }
}

const Reconciliation = new ReconciliationClass()

export { Reconciliation }
