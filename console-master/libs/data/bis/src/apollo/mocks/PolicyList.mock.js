/* eslint-disable sonarjs/no-duplicate-string */
const policies = [
  {
    appliedGroups: 4,
    appliedUsers: 3,
    description: 'High risk group policy',
    name: 'High Risk Policy',
    id: '754ffcad-6ee4-456c-a8f4-b8889ea1d514',
  },
  {
    appliedGroups: 6,
    appliedUsers: 3,
    description: 'Low risk group policy',
    name: 'Low Risk Policy',
    id: 'bfbdab4c-ecfa-4c66-8b06-feabe423c237',
  },
  {
    appliedGroups: 0,
    appliedUsers: 3,
    description: 'This is my first policy.',
    name: 'My Test One',
    id: 'd792c82b-4700-4a68-9817-3e5c9db672dc',
  },
]

export const PolicyListQueryMock = {
  policies,
}

export const PolicyListAddMutationMock = {
  createPolicy: policies[0],
}

export const PolicyListUpdateMutationMock = {
  updatePolicy: policies[0],
}

export const PolicyListDeleteMutationMock = { deletePolicies: { success: ['78f15f22-0a14-492e-8cbe-6d3e28e3bc2d'], fail: [] } }

export const PolicyListDetailsQueryMock = {
  policy: {
    appliedGroups: 4,
    appliedUsers: 3,
    description: 'High risk group policy',
    name: 'High Risk Policy',
    id: '754ffcad-6ee4-456c-a8f4-b8889ea1d514',
    updatedByUser: 'Xardas',
    updatedAt: 1615929151349,
    policyData: {
      identityPolicy: {
        riskFactors: ['behavioral', 'ipAddress', 'appAnomalyDetection', 'networkAnomalyDetection'],
        riskLevelActions: [
          {
            level: 'CRITICAL',
            actions: [
              {
                actionType: 'uem:assignGroup',
                actionAttributes: {
                  groupGuid: '079f44a8-85c3-42c8-84be-dbfd559367ec',
                  groupName: 'BH_Critical',
                  userEcoIds: ['AteVhemkestU6scHpAp5AOc='],
                  userGuids: null,
                  actionId: null,
                  command: null,
                  profileGuid: null,
                  profileName: null,
                  gracePeriod: null,
                  timeout: null,
                  title: null,
                  message: null,
                },
              },
              {
                actionType: 'uem:blockApplications',
                actionAttributes: {
                  groupGuid: null,
                  groupName: null,
                  userEcoIds: ['AteVhemkestU6scHpAp5AOc='],
                  userGuids: null,
                  actionId: 'AteVhemkestU6scHpAp5AOc=',
                  command: 'BLOCK_APPLICATIONS',
                  profileGuid: null,
                  profileName: null,
                  gracePeriod: null,
                  timeout: null,
                  title: null,
                  message: null,
                },
              },
              {
                actionType: 'app:reAuthenticateToConfirm',
                actionAttributes: {
                  groupGuid: null,
                  groupName: null,
                  userEcoIds: null,
                  userGuids: null,
                  actionId: null,
                  command: null,
                  profileGuid: null,
                  profileName: null,
                  gracePeriod: 300,
                  timeout: 600,
                  title: 'BlackBerry Persona',
                  message: 'BlackBerry Persona requires you to authenticate before you use this app.',
                },
              },
            ],
          },
          {
            level: 'HIGH',
            actions: [
              {
                actionType: 'uem:assignGroup',
                actionAttributes: {
                  groupGuid: '7c5aa567-9476-4932-806d-a0c1416fc2a0',
                  groupName: 'BH_High',
                  userEcoIds: ['AteVhemkestU6scHpAp5AOc='],
                  userGuids: null,
                  actionId: null,
                  command: null,
                  profileGuid: null,
                  profileName: null,
                  gracePeriod: null,
                  timeout: null,
                  title: null,
                  message: null,
                },
              },
              {
                actionType: 'app:reAuthenticateToConfirm',
                actionAttributes: {
                  groupGuid: null,
                  groupName: null,
                  userEcoIds: null,
                  userGuids: null,
                  actionId: null,
                  command: null,
                  profileGuid: null,
                  profileName: null,
                  gracePeriod: 300,
                  timeout: 600,
                  title: 'BlackBerry Persona',
                  message: 'BlackBerry Persona requires you to authenticate before you use this app.',
                },
              },
              {
                actionType: 'overrideNetworkAccessControlPolicy',
                actionAttributes: {
                  entityId: '11981ec4-f154-435a-9df9-11da7b966f7f',
                },
              },
            ],
          },
          {
            level: 'MEDIUM',
            actions: [
              {
                actionType: 'uem:assignGroup',
                actionAttributes: {
                  groupGuid: 'a3081302-126d-4bc5-8175-b14390e98328',
                  groupName: 'BH_Medium',
                  userEcoIds: ['AteVhemkestU6scHpAp5AOc='],
                  userGuids: null,
                  actionId: null,
                  command: null,
                  profileGuid: null,
                  profileName: null,
                  gracePeriod: null,
                  timeout: null,
                  title: null,
                  message: null,
                },
              },
            ],
          },
          {
            level: 'LOW',
            actions: [
              {
                actionType: 'uem:assignGroup',
                actionAttributes: {
                  groupGuid: 'edb75467-f1e7-4f89-ad4a-55ff3cd509e8',
                  groupName: 'BH_Low',
                  userEcoIds: ['AteVhemkestU6scHpAp5AOc='],
                  userGuids: null,
                  actionId: null,
                  command: null,
                  profileGuid: null,
                  profileName: null,
                  gracePeriod: null,
                  timeout: null,
                  title: null,
                  message: null,
                },
              },
            ],
          },
        ],
        fixUp: { enabled: true, minimumBehavioralRiskLevel: 'HIGH', actionPauseDuration: 7200 },
        ipAddressPolicy: null,
      },
      geozonePolicy: {
        riskFactors: ['defined', 'learned'],
        defaultRiskLevelActions: [
          {
            level: 'HIGH',
            actions: [
              {
                actionType: 'uem:assignGroup',
                actionAttributes: {
                  groupGuid: 'af8b5af2-246e-4804-81c4-826efa1ab81e',
                  groupName: 'LGZ_High',
                  profileGuid: null,
                  profileName: null,
                  gracePeriod: null,
                  timeout: null,
                  title: null,
                  message: null,
                },
              },
              {
                actionType: 'uem:blockApplications',
                actionAttributes: {
                  groupGuid: null,
                  groupName: null,
                  profileGuid: null,
                  profileName: null,
                  gracePeriod: null,
                  timeout: null,
                  title: null,
                  message: null,
                },
              },
            ],
          },
          {
            level: 'MEDIUM',
            actions: [
              {
                actionType: 'uem:assignGroup',
                actionAttributes: {
                  groupGuid: '13690a9d-5a7f-4ccc-ae21-4893fca79185',
                  groupName: 'LGZ_Medium',
                  profileGuid: null,
                  profileName: null,
                  gracePeriod: null,
                  timeout: null,
                  title: null,
                  message: null,
                },
              },
            ],
          },
          {
            level: 'LOW',
            actions: [
              {
                actionType: 'uem:assignGroup',
                actionAttributes: {
                  groupGuid: '2a09b94e-93e8-46db-8bff-8e85045862de',
                  groupName: 'LGZ_Low',
                  profileGuid: null,
                  profileName: null,
                  gracePeriod: null,
                  timeout: null,
                  title: null,
                  message: null,
                },
              },
            ],
          },
        ],
        overriddenRiskLevelActions: [
          {
            geozoneId: 'af739578-ab38-f948-1cff-dd83957ba7c6',
            level: 'HIGH',
            actions: [
              {
                actionType: 'uem:assignGroup',
                actionAttributes: {
                  groupGuid: 'b47d519e-90c7-480b-b0b4-8c766eb9128c',
                  groupName: 'DGZ_High',
                  profileGuid: null,
                  profileName: null,
                  gracePeriod: null,
                  timeout: null,
                  title: null,
                  message: null,
                },
              },
              {
                actionType: 'uem:blockApplications',
                actionAttributes: {
                  groupGuid: null,
                  groupName: null,
                  profileGuid: null,
                  profileName: null,
                  gracePeriod: null,
                  timeout: null,
                  title: null,
                  message: null,
                },
              },
            ],
          },
          {
            geozoneId: 'bfbdab4c-ecfa-4c66-8b06-feabe423c237',
            level: 'LOW',
            actions: [
              {
                actionType: 'uem:blockApplications',
                actionAttributes: {
                  groupGuid: null,
                  groupName: null,
                  profileGuid: null,
                  profileName: null,
                  gracePeriod: null,
                  timeout: null,
                  title: null,
                  message: null,
                },
              },
            ],
          },
          {
            geozoneId: '2ec6c451-7b28-4469-b9bb-c058d403ada1',
            level: 'MEDIUM',
            actions: [
              {
                actionType: 'uem:assignGroup',
                actionAttributes: {
                  groupGuid: 'dc95d472-4f43-49ce-ba6f-3e7191cfb296',
                  groupName: 'DGZ_Medium',
                  profileGuid: null,
                  profileName: null,
                  gracePeriod: null,
                  timeout: null,
                  title: null,
                  message: null,
                },
              },
            ],
          },
        ],
        defaultActions: [
          {
            actionType: 'uem:assignGroup',
            actionAttributes: {
              groupGuid: '6ebdbab1-7670-4050-b81d-63bbfef49259',
              groupName: 'Default_DefinedGZ',
              profileGuid: null,
              profileName: null,
              gracePeriod: null,
              timeout: null,
              title: null,
              message: null,
            },
          },
          {
            actionType: 'uem:blockApplications',
            actionAttributes: {
              groupGuid: null,
              groupName: null,
              profileGuid: null,
              profileName: null,
              gracePeriod: null,
              timeout: null,
              title: null,
              message: null,
            },
          },
        ],
      },
    },
  },
}
