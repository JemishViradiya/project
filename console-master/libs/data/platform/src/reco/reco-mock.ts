//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

/* eslint-disable prefer-rest-params */
/* eslint-disable sonarjs/no-duplicate-string */

import type { PagableResponse, ReconciliationEntity, ReconciliationEntityDefinition, Response } from '@ues-data/shared'

import type RecoInterface from './reco-interface'

export const definitionsMock: PagableResponse<ReconciliationEntityDefinition> = {
  totals: {
    pages: 1,
    elements: 4,
  },
  count: 4,
  elements: [
    {
      tenantId: 'V73324241',
      serviceId: 'com.blackberry.bis',
      entityType: 'BisPolicy',
      reconciliationType: 'RANKING',
    },
    {
      tenantId: 'V73324241',
      serviceId: 'big.blackberry.com',
      entityType: 'GatewayApp',
      reconciliationType: 'RANKING',
    },
    {
      tenantId: 'V73324241',
      serviceId: 'com.blackberry.mtd',
      entityType: 'MTD',
      reconciliationType: 'RANKING',
    },
    {
      tenantId: 'V73324241',
      serviceId: 'com.blackberry.ecs.ecm',
      entityType: 'ENROLLMENT',
      reconciliationType: 'RANKING',
    },
  ],
}

export const profilesMock: PagableResponse<ReconciliationEntity> = {
  totals: {
    pages: 1,
    elements: 4,
  },
  count: 4,
  elements: [
    {
      serviceId: 'big.blackberry.com',
      entityType: 'GatewayApp',
      entityId: '138c20ca-566b-40cb-a110-e93581462dd1',
      name: 'asdasdasd/co',
      description: 'kjnlj89 ',
      rank: 1,
      created: '2021-02-02T11:59:11.901774',
    },
    {
      serviceId: 'big.blackberry.com',
      entityType: 'GatewayApp',
      entityId: '166a04e3-3423-46bb-832e-a9c117847c97',
      name: '!@#!%^$*!&^$*&^))()()(*&^%$#',
      description: 'kjnlj89 ',
      rank: 5,
      created: '2021-02-02T12:14:02.874004',
    },
    {
      serviceId: 'big.blackberry.com',
      entityType: 'GatewayApp',
      entityId: '2915c14b-b28b-489d-b203-86de73ec9c30',
      name: 'Default',
      description: 'sadasda',
      rank: 2,
      created: '2021-02-02T12:07:10.167944',
    },
    {
      serviceId: 'com.blackberry.ecs.ecm',
      entityType: 'ENROLLMENT',
      entityId: 'f9cc61d9-4f03-4921-9502-22743a5e580d',
      name: 'iOS Enrollment',
      rank: 1,
      created: '2021-02-02T12:14:02.874004',
      description: '',
    },
  ],
}

class ReconciliationMockClass implements RecoInterface {
  getDefinitions(): Response<PagableResponse<ReconciliationEntityDefinition>> {
    return Promise.resolve({ data: definitionsMock })
  }
  getEntities(query?: string, max = 1000): Response<PagableResponse<ReconciliationEntity>> {
    return Promise.resolve({ data: profilesMock })
  }
  getGroupAssignments(id: string): Response<PagableResponse<{ groupId: string; serviceId: string; entityId: string }>> {
    return Promise.resolve({
      data: {
        totals: {
          pages: 0,
          elements: 0,
        },
        count: 0,
        elements: [],
      },
    })
  }
}

const ReconciliationMock = new ReconciliationMockClass()

export { ReconciliationMock }
