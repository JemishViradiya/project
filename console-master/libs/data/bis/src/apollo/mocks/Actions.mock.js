export const ActionTypesQueryMock = {
  availableActions: [
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
      actionType: 'overrideNetworkAccessControlPolicy',
      pillarTypeId: 'big.blackberry.com',
      client: {
        needUpdated: {
          entityType: 'NetworkAccessControl',
          serviceId: 'big.blackberry.com',
        },
        userInputs: {
          entityId: null,
        },
      },
    },
  ],
}
