// //******************************************************************************
// // Copyright 2020 BlackBerry. All Rights Reserved.

const dummyPolicyAssignedUsers = [
  {
    name: 'User 1',
    email: 'test@com',
    entityId: 'e9a2b066-d37c-4890-94c0-7953e717e63679',
  },
  {
    name: 'User 2',
    email: 'test1@com',
    entityId: 'e9a2b066-d37c-4890-94c0-7953e717e63679',
  },
  {
    name: 'User 1',
    email: 'test@com',
    // eslint-disable-next-line sonarjs/no-duplicate-string
    entityId: 'e9a2b066-d37c-4890-94c0-7953e717e6375',
  },
  {
    name: 'User 2',
    email: 'test1@com',
    entityId: 'e9a2b066-d37c-4890-94c0-7953e717e6375',
  },
  {
    name: 'User 3',
    email: 'test1@com',
    entityId: 'e9a2b066-d37c-4890-94c0-7953e717e6375',
  },
  {
    name: 'User 1',
    email: 'test2@com',
    entityId: 'e9a2b066-d37c-4890-94c0-7953e717e635',
  },
  {
    name: 'User 2',
    email: 'test3@com',
    entityId: 'e9a2b066-d37c-4890-94c0-7953e717e635',
  },
  {
    name: 'User 1',
    email: 'test2@com',
    entityId: 'e9a2b066-d37c-4890-94c0-7953e717e636',
  },
  {
    name: 'User 2',
    email: 'test3@com',
    entityId: 'e9a2b066-d37c-4890-94c0-7953e717e636',
  },
  {
    name: 'User 1',
    email: 'test3@com',
    entityId: 'e9a2b066-d37c-4890-94c0-7953e717e6376',
  },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const readPolicyAssignedUsers = (entityId: string): Promise<any> => {
  const result = dummyPolicyAssignedUsers.filter(user => user.entityId === entityId)

  return Promise.resolve({ data: result })
}
