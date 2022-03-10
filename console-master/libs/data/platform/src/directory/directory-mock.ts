//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

/* eslint-disable prefer-rest-params */
/* eslint-disable sonarjs/no-duplicate-string */

import type { Response } from '@ues-data/shared'

import type DirectoryInterface from './directory-interface'
import type { DirectoryGroup, DirectoryInstance, DirectoryUser, SyncIterations, SyncState, SyncType } from './directory-types'

const is = 'DirectoryClass'

const directoryUserMock: DirectoryUser[] = [
  {
    country: 'Canada',
    displayName: 'gd_001',
    state: 'ON',
    street: null,
    username: 'emailreport_test1@ahem.sw.rim.net',
    dataSource: 'azure',
    dataSourceUserId: 'd4e14315-6008-4e98-af3e-97df5c250e8b',
    firstName: 'FirstName_gd_001',
    lastName: 'gd_001',
    emailAddress: 'emailreport_test1@ahem.sw.rim.net',
    title: 'Tester',
    department: 'PerfEng',
    company: 'BlackBerry',
    poBox: null,
    city: 'Waterloo',
    postalCode: null,
    dataSourceConnectionId: 'e060b803-5d57-4c86-af18-d3728939d8c5',
    accountForestDataSourceDn: null,
    domain: 'pew07.cbbcps.com',
    picture: null,
    mobilePhoneNumber: null,
    directoryuserdn: null,
    directoryuserpn: 'emailreport_test1@ahem.sw.rim.net',
    companyPhoneNumber: '519-597-6001',
    homePhoneNumber: null,
  },
  {
    country: 'Canada',
    displayName: 'gd_002',
    state: 'ON',
    street: null,
    username: 'gd_002@pew07.cbbcps.com',
    dataSource: 'azure',
    dataSourceUserId: '2ab745a3-2f02-4554-a26f-a278ac1c7e95',
    firstName: 'FirstName_gd_002',
    lastName: 'gd_002',
    emailAddress: 'gd_002@pew07.cbbcps.com',
    title: 'Tester',
    department: 'PerfEng',
    company: 'BlackBerry',
    poBox: null,
    city: 'Waterloo',
    postalCode: null,
    dataSourceConnectionId: 'e060b803-5d57-4c86-af18-d3728939d8c5',
    accountForestDataSourceDn: null,
    domain: 'pew07.cbbcps.com',
    picture: null,
    mobilePhoneNumber: null,
    directoryuserdn: null,
    directoryuserpn: 'gd_002@pew07.cbbcps.com',
    companyPhoneNumber: '519-597-6002',
    homePhoneNumber: null,
  },
  {
    country: 'Canada',
    displayName: 'gd_003',
    state: 'ON',
    street: null,
    username: 'gd_003@pew07.cbbcps.com',
    dataSource: 'azure',
    dataSourceUserId: '25c0dcd8-1253-4911-9a4e-0b9b202f1ae3',
    firstName: 'FirstName_gd_003',
    lastName: 'gd_003',
    emailAddress: 'gd_003@pew07.cbbcps.com',
    title: 'Tester',
    department: 'PerfEng',
    company: 'BlackBerry',
    poBox: null,
    city: 'Waterloo',
    postalCode: null,
    dataSourceConnectionId: 'e060b803-5d57-4c86-af18-d3728939d8c5',
    accountForestDataSourceDn: null,
    domain: 'pew07.cbbcps.com',
    picture: null,
    mobilePhoneNumber: null,
    directoryuserdn: null,
    directoryuserpn: 'gd_003@pew07.cbbcps.com',
    companyPhoneNumber: '519-597-6003',
    homePhoneNumber: null,
  },
]

const directoryGroupsMock = [
  {
    name: 'ADSyncAdmins',
    dataSourceConnectionId: 'c6bf06c9-88dd-482f-b35d-07ccc88b77b1',
    directorySourceName: 'Azure connection',
    groupDistinguishedName: 'ADSyncAdmins',
    dataSourceGroupId: '99a725bb-8bbf-47a5-89e2-e7f3f0ff5c1b',
  },
  {
    name: 'ADSyncBrowse',
    dataSourceConnectionId: 'c6bf06c9-88dd-482f-b35d-07ccc88b77b1',
    directorySourceName: 'Azure connection',
    groupDistinguishedName: 'ADSyncBrowse',
    dataSourceGroupId: '3bff4303-afd4-4870-b063-e96dc2c1f21f',
  },
  {
    name: 'ADSyncOperators',
    dataSourceConnectionId: 'c6bf06c9-88dd-482f-b35d-07ccc88b77b1',
    directorySourceName: 'Azure connection',
    groupDistinguishedName: 'ADSyncOperators',
    dataSourceGroupId: '3fbf4a5c-090b-4654-a0f9-8dc82efd0fbc',
  },
]

const syncTypeUsersAndGroups: SyncType = 'USERS_AND_GROUPS'
const iterationTypeOnce: SyncIterations = 'ONCE'
const iterationTypeDaily: SyncIterations = 'DAILY'

export const directoryInstanceMock = [
  {
    id: 'c6bf06c9-88dd-482f-b35d-07ccc88b77b1',
    directorySyncSchedules: [
      {
        runOnWednesday: true,
        runOnMonday: true,
        runOnTuesday: false,
        runOnSaturday: true,
        runOnThursday: true,
        runOnSunday: true,
        type: syncTypeUsersAndGroups,
        runOnFriday: true,
        iterations: iterationTypeDaily,
        startTimeOfDay: 0,
        endTimeOfDay: null,
        callbackFreq: null,
        schedulerId: 173938,
      },
      {
        runOnWednesday: false,
        runOnMonday: true,
        runOnTuesday: false,
        runOnSaturday: true,
        runOnThursday: true,
        runOnSunday: true,
        type: syncTypeUsersAndGroups,
        runOnFriday: true,
        iterations: iterationTypeOnce,
        startTimeOfDay: 520,
        endTimeOfDay: 0,
        callbackFreq: 30,
        schedulerId: 173973,
      },
    ],
    azureDirectoryClientKey: '****************',
    syncEnableOffboarding: false,
    azureDirectoryDomain: 'bbca06.onmicrosoft.com',
    syncForce: false,
    type: 'AZURE',
    azureDirectory: true,
    syncMaxChanges: 0,
    syncEnableOffboardingProtection: true,
    syncMaxNesting: -1,
    name: 'Azure connection',
    azureDirectoryClientId: 'b71bd142-85dd-44e0-98e1-7a4156efd2cf',
    syncEnableOnboarding: true,
    instanceOnlineStatus: true,
  },
  {
    id: 'c6bf06c9-88dd-482f-b35d-07aaa88b77b1',
    directorySyncSchedules: [],
    azureDirectoryClientKey: '****************',
    syncEnableOffboarding: false,
    azureDirectoryDomain: 'bbca06.onmicrosoft.com',
    syncForce: false,
    type: 'AZURE',
    azureDirectory: true,
    syncMaxChanges: 0,
    syncEnableOffboardingProtection: true,
    syncMaxNesting: -1,
    name: 'Azure connection 2',
    azureDirectoryClientId: 'b71bd142-85dd-44e0-98e1-7a4156efd2cf',
    syncEnableOnboarding: false,
    instanceOnlineStatus: true,
  },
  {
    id: '47bc0400-06c8-423e-ba54-4a55eac73d70',
    directorySyncSchedules: [],
    instanceEnabledStatus: true,
    instanceOnlineStatus: true,
    name: 'LDAP test',
    syncEnableOffboarding: false,
    syncEnableOffboardingProtection: true,
    syncEnableOnboarding: false,
    syncForce: false,
    syncMaxChanges: 0,
    syncMaxNesting: -1,
    type: 'LDAP',
    zedDirectory: true,
  },
]

export const mockSyncState = {
  'c6bf06c9-88dd-482f-b35d-07ccc88b77b1': {
    syncId: 'c6bf06c9-88dd-482f-b35d-07ccc88b77',
    directoryInstanceId: 'c6bf06c9-88dd-482f-b35d-07ccc88b77b1',
    syncType: 'USERS_AND_GROUPS',
    isPreview: false,
    isScheduled: false,
    syncState: 'SUCCEEDED',
    syncStart: new Date('2021-10-06').toISOString(),
    syncEnd: new Date('2021-10-06').toISOString(),
    directoryInstanceConfiguration: 'some config',
  },
  'c6bf06c9-88dd-482f-b35d-07aaa88b77b1': {
    syncId: 'c6bf06c9-88dd-482f-b35d-07ccc88b77',
    directoryInstanceId: 'c6bf06c9-88dd-482f-b35d-07ccc88b77b1',
    syncType: 'USERS_AND_GROUPS',
    isPreview: false,
    isScheduled: false,
    syncState: 'RUNNING',
    syncStart: new Date('2021-10-06').toISOString(),
    syncEnd: new Date('2021-10-06').toISOString(),
    directoryInstanceConfiguration: 'some config',
  },
  '47bc0400-06c8-423e-ba54-4a55eac73d70': {
    syncId: '47bc0400-06c8-423e-ba54-4a55eac73d70',
    directoryInstanceId: '47bc0400-06c8-423e-ba54-4a55eac73d70',
    syncType: 'USERS_AND_GROUPS',
    isPreview: false,
    isScheduled: false,
    syncState: 'SUCCEEDED',
    syncStart: new Date('2021-10-06').toISOString(),
    syncEnd: new Date('2021-10-06').toISOString(),
    directoryInstanceConfiguration: 'some config',
  },
}

class DirectoryClass implements DirectoryInterface {
  getDirectories(): Response<DirectoryInstance[]> {
    return Promise.resolve({ data: directoryInstanceMock })
  }
  getDirectoryConfigured(): Response<boolean> {
    return Promise.resolve({ data: true })
  }
  addDirectory(directory: DirectoryInstance): Response<DirectoryInstance> {
    return Promise.resolve({ data: directory })
  }
  removeDirectory(id: string): Promise<void> {
    return Promise.resolve()
  }
  editDirectory(directory: DirectoryInstance): Response<DirectoryInstance> {
    return Promise.resolve({ data: directory })
  }
  getSync(id: string): Response<SyncState> {
    return Promise.resolve({ data: mockSyncState[id] })
  }
  startSync(id: string, type: SyncType): Promise<void> {
    return Promise.resolve()
  }
  cancelSync(id: string): Promise<void> {
    return Promise.resolve()
  }
  getDirectoryInstance(directoryInstanceId: string): Response<DirectoryInstance> {
    return Promise.resolve({ data: directoryInstanceMock[0] })
  }
  searchGroups(search: string): Response<DirectoryGroup[]> {
    return Promise.resolve({ data: directoryGroupsMock })
  }
  searchUsers(tenantId: string, search: string): Response<DirectoryUser[]> {
    console.log(`${is}: searchUsers(${[...arguments]})`)

    return Promise.resolve({
      data: directoryUserMock.filter(u => u.displayName.includes(search) || u.emailAddress.includes(search)),
    })
  }
}

const DirectoryMock = new DirectoryClass()

export { DirectoryMock }
