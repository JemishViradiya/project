/* eslint-disable sonarjs/no-duplicate-string */

import { ActionTypesQuery } from '@ues-data/bis'

const { query: availableActionsQuery } = ActionTypesQuery

const AVAILABLE_ACTIONS = [
  {
    actionType: 'uem:assignGroup',
    pillarTypeId: 'sis.blackberry.com',
    client: null,
  },
  {
    actionType: 'mdm:lockDevice',
    pillarTypeId: 'sis.blackberry.com',
    client: {
      userInputs: {
        gracePeriod: 1800,
      },
      needUpdated: null,
    },
  },
  {
    actionType: 'mdm:assignITPolicyOverrideProfile',
    pillarTypeId: 'sis.blackberry.com',
    client: null,
  },
  {
    actionType: 'mdm:lockWorkspace',
    pillarTypeId: 'sis.blackberry.com',
    client: {
      userInputs: {
        gracePeriod: 1800,
      },
      needUpdated: null,
    },
  },
  {
    actionType: 'mdm:disableWorkspace',
    pillarTypeId: 'sis.blackberry.com',
    client: null,
  },
  {
    actionType: 'app:reAuthenticateToConfirm',
    pillarTypeId: 'sis.blackberry.com',
    client: null,
  },
  {
    actionType: 'app:assignDynamicsProfile',
    pillarTypeId: 'sis.blackberry.com',
    client: null,
  },
  {
    actionType: 'app:blockApplication',
    pillarTypeId: 'sis.blackberry.com',
    client: null,
  },
  {
    actionType: 'uem:blockApplications',
    pillarTypeId: 'sis.blackberry.com',
    client: null,
  },
  {
    actionType: 'assignUserToGroup',
    pillarTypeId: 'com.blackberry.ecs.emm.intune',
    client: null,
  },
  {
    actionType: 'removeUserFromGroup',
    pillarTypeId: 'com.blackberry.ecs.emm.intune',
    client: null,
  },
  {
    actionType: 'lockDevice',
    pillarTypeId: 'com.blackberry.ecs.emm.intune',
    client: null,
  },
  {
    actionType: 'overrideNetworkAccessPolicy',
    pillarTypeId: 'big.blackberry.com',
    client: {
      userInputs: {
        gracePeriod: 300,
      },
      needUpdated: {
        serviceId: 'big.blackberry.com',
        entityType: 'Internet',
      },
    },
  },
]

const createAvailablePolicyActionsQueryMock = () => ({
  request: { query: availableActionsQuery },
  result: { data: { availableActions: AVAILABLE_ACTIONS } },
})

export { createAvailablePolicyActionsQueryMock, AVAILABLE_ACTIONS }
