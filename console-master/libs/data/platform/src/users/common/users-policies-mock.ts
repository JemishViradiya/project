//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

/* eslint-disable prefer-rest-params */
/* eslint-disable sonarjs/no-duplicate-string */

import { map } from 'lodash-es'

import type { EffectiveUsersPolicy, PagableResponse, Response } from '@ues-data/shared-types'

import type UsersPolicyInterface from './users-policies-interface'
import type { PolicyAssignment } from './users-types'

export const assignedProfilesMock: PagableResponse<PolicyAssignment> = {
  totals: {
    pages: 1,
    elements: 4,
  },
  count: 4,
  elements: [
    {
      serviceId: 'big.blackberry.com',
      entityId: '138c20ca-566b-40cb-a110-e93581462dd1',
      effective: true,
      assigned: true,
      override: false,
    },
    {
      serviceId: 'big.blackberry.com',
      entityId: '166a04e3-3423-46bb-832e-a9c117847c97',
      effective: true,
      assigned: true,
      override: false,
    },
    {
      serviceId: 'big.blackberry.com',
      entityId: '134504e3-3423-46bb-832e-a9c117847c62',
      effective: true,
      assigned: false,
      override: true,
    },
    {
      serviceId: 'com.blackberry.ecs.ecm',
      entityId: 'f9cc61d9-4f03-4921-9502-22743a5e580d',
      effective: true,
      assigned: false,
      override: false,
    },
  ],
}

export const EffectiveUsersPolicyMock = {
  'com.blackberry.ecs.ecm': {
    userId: btoa('userId-1'),
    serviceId: 'com.blackberry.ecs.ecm',
    effectiveEntities: [
      {
        entityType: 'ENROLLMENT',
        entityIds: ['f9cc61d9-4f03-4921-9502-22743a5e580d'],
        details: [
          {
            entityId: 'f9cc61d9-4f03-4921-9502-22743a5e580d',
            name: 'iOS Enrollment',
            description: null,
            appliedVia: 'GROUP',
          },
        ],
      },
    ],
  },
  'big.blackberry.com': {
    userId: btoa('userId-1'),
    serviceId: 'big.blackberry.com',
    effectiveEntities: [
      {
        entityType: 'GatewayApp',
        entityIds: ['138c20ca-566b-40cb-a110-e93581462dd1'],
        details: [
          {
            entityId: '138c20ca-566b-40cb-a110-e93581462dd1',
            name: 'asdasdasd/co',
            description: null,
            appliedVia: 'USER',
          },
        ],
      },
    ],
  },
}

class UsersPolicyClass implements UsersPolicyInterface {
  getUserPolicies(userId: string): Response<PagableResponse<PolicyAssignment>> {
    return Promise.resolve({ data: assignedProfilesMock })
  }
  getUserEffectivePolicy(userId: string, serviceId: string): Response<EffectiveUsersPolicy> {
    if (map(EffectiveUsersPolicyMock, 'serviceId').includes(serviceId)) {
      return Promise.resolve({ data: EffectiveUsersPolicyMock[serviceId] })
    } else {
      return Promise.resolve({ data: { userId, serviceId, effectiveEntities: [] } })
    }
  }
  assignPolicies(userId: string, policies: PolicyAssignment[]): Promise<void> {
    return Promise.resolve()
  }
  unassignPolicies(userId: string, policies: PolicyAssignment[]): Promise<void> {
    return Promise.resolve()
  }
}

const UsersPolicyMock = new UsersPolicyClass()

export { UsersPolicyMock }
