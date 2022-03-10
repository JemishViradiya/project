export const AppliedListQueryMock = {
  applied: {
    users: [
      {
        id: 'user1',
        info: {
          displayName: 'Alvena Bayer',
          primaryEmail: 'alvena48@xxx.com',
        },
        __typename: 'BIS_DirectoryUser',
      },
      {
        id: 'user2',
        info: {
          displayName: 'Nedra Rogahn',
          primaryEmail: 'nedra20@xxx.com',
        },
        __typename: 'BIS_DirectoryUser',
      },
    ],
    groups: [
      {
        id: 'group1',
        info: {
          name: 'Ondricka, Harvey and Ledner',
          description: 'Total multi-state flexibility',
        },
        __typename: 'BIS_DirectoryGroup',
      },
      {
        id: 'group2',
        info: {
          name: 'McKenzie, Sanford and Kreiger',
          description: 'User-centric maximized product',
        },
        __typename: 'BIS_DirectoryGroup',
      },
    ],
  },
}

export const AppliedListAddMutationMock = {
  addUsersAndGroups: {
    success: ['DBrPiXHCzbgVEwJvLSehduKj+aSQ='],
    fail: [],
    policyId: '754ffcad-6ee4-456c-a8f4-b8889ea1d514',
  },
}

export const AppliedListDeleteMutationMock = {
  deleteUsersAndGroups: { success: ['user2'], fail: [], policyId: '754ffcad-6ee4-456c-a8f4-b8889ea1d514' },
}
