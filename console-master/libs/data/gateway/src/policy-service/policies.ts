//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import type { ReconciliationEntityId, ReconciliationEntityType, Response } from '@ues-data/shared'

import { axiosInstance, baseUrl } from '../config.rest'
import type PoliciesInterface from './policies-interface'
import type { Policy } from './policies-types'

export const makePoliciesEndpoint = (tenantId: string, entityId?: string): string => {
  const entityPath = entityId ? `/${entityId}` : ''
  return `/policy/v2/${tenantId}/policy${entityPath}`
}

export const makePoliciesUrl = (tenantId: string, entityId?: string): string =>
  `${baseUrl}${makePoliciesEndpoint(tenantId, entityId)}`

class PoliciesClass implements PoliciesInterface {
  create(tenantId: string, data: Policy): Response<ReconciliationEntityId> {
    return axiosInstance().post(makePoliciesUrl(tenantId), data)
  }

  readOne(tenantId: string, entityId: string, _entityType: ReconciliationEntityType): Response<Policy> {
    return axiosInstance().get(makePoliciesUrl(tenantId, entityId))
  }

  update(tenantId: string, entityId: string, data: Partial<Policy>): Response {
    return axiosInstance().put(makePoliciesUrl(tenantId, entityId), data)
  }

  remove(tenantId: string, entityId: string): Response {
    return axiosInstance().delete(makePoliciesUrl(tenantId, entityId))
  }

  removeMany(tenantId: string, entityIds: string[]): Response {
    return axiosInstance().post(`${makePoliciesUrl(tenantId)}/delete`, entityIds)
  }
}

const Policies = new PoliciesClass()

export { Policies }
