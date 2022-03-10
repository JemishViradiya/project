//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

/* eslint-disable prefer-rest-params */
/* eslint-disable sonarjs/no-duplicate-string */

import type { PagableResponse, Response } from '@ues-data/shared-types'
import { ServiceId } from '@ues-data/shared-types'

import type { DeleteResponse, ServerSideSelectionModel } from '../../shared/types'
import type UsersInterface from './users-interface'
import type { User, UserDevice } from './users-types'

const users: User[] = [
  {
    id: btoa('userId-1'),
    ecoId: '138c20ca-566b-40cb-a110-e93581462dd1',
    displayName: 'Pauly Thwaites',
    username: 'pthwaites0',
    emailAddress: 'pthwaites0@blackhole.sw.rim.net',
    dataSource: 'cur',
  },
  {
    id: btoa('userId-2'),
    ecoId: 'c5fab0ca-b94b-4ae7-91d1-3c4dbdec99b0',
    displayName: 'Joleen Cardno',
    username: 'jcardno1',
    emailAddress: 'jcardno1@blackhole.sw.rim.net',
    dataSource: 'cur',
  },
  {
    id: btoa('userId-3'),
    ecoId: 'a80bf740-7dc3-4815-8572-265bf0065d48',
    displayName: 'Siana Reboulet',
    username: 'sreboulet2',
    emailAddress: 'sreboulet2@blackhole.sw.rim.net',
    dataSourceConnectionId: '7dd91eb6-ccc8-49ab-8c90-352896d1e40b',
    dataSource: 'active_directory',
  },
  {
    id: btoa('userId-4'),
    ecoId: '75e06191-a30e-476d-acbc-ad0e780996d4',
    displayName: 'Timofei Borthram',
    username: 'tborthram',
    emailAddress: 'tborthram3@blackhole.sw.rim.net',
    dataSource: 'cur',
  },
  {
    id: btoa('userId-5'),
    ecoId: 'c9d10182-fca2-46a0-bede-c9def8896d38',
    displayName: 'Gwen Turfs',
    username: 'gturfs4',
    emailAddress: 'gturfs4@blackhole.sw.rim.net',
    dataSource: 'ldap',
  },
  {
    id: btoa('userId-6'),
    ecoId: 'be0b9722-5a46-4a20-b4ef-168a561370f1',
    displayName: 'Jourdain Jeaneau',
    username: 'jjeaneau5',
    emailAddress: 'jjeaneau5@blackhole.sw.rim.net',
    dataSource: 'cur',
  },
  {
    id: btoa('userId-7'),
    ecoId: 'ae5c56a0-763c-41e9-b5f3-eb2ca2103082',
    displayName: 'Rudolfo Woodes',
    username: 'rwoodes6',
    emailAddress: 'rwoodes6@blackhole.sw.rim.net',
    dataSource: 'azure',
    dataSourceConnectionId: '7dd91eb6-ccc8-49ab-8c90-352896d1e40b',
  },
  {
    id: btoa('userId-8'),
    ecoId: 'ecoId-0',
    displayName: 'Neo Zero',
    username: 'neozero',
    emailAddress: 'neozero@blackhole.sw.rim.net',
    dataSource: 'cur',
  },
]

export const usersMock: PagableResponse<User> = {
  totals: {
    pages: 1,
    elements: users.length,
  },
  count: users.length,
  elements: [...users],
}

export enum mockEndpointGuids {
  AndroidXiaomiProtectGuid = 'e131630d-2b87-49f7-93c9-ff54ff85ab51',
  NullDeviceInfoBigGuid = '924edb50-248c-4e92-aaee-1034816e39df',
  WindowsInOsVersionBigGuid = '924edb50-248c-4e92-aaee-1034816e39dg',
  NullDeviceInfoAttribsBigGuid = '924edb50-248c-4e92-aaee-1034816e39dh',
  MacOSBigGuid = '924edb50-248c-4e92-aaee-1034816e39di',
  iphoneProtectGuid = '924edb50-248c-4e92-aaee-1034816e39dj',
}

export const devicesMock: PagableResponse<UserDevice> = {
  totals: {
    pages: 1,
    elements: 6,
  },
  count: 6,
  elements: [
    {
      guid: mockEndpointGuids.AndroidXiaomiProtectGuid,
      tenantId: 'L79486982',
      userId: btoa('userId-1'),
      deviceInfo: {
        deviceId: '8bb31f75-42ec-47bb-b910-20e101ae76ab',
        extDeviceId: '',
        platform: 'android',
        osVersion: '10',
        securityPatch: '10.6.1',
        deviceModelName: 'Xiaomi MI 10',
        deviceModelAlias: '',
        manufacturer: 'Xiaomi',
      },
      appBundleId: 'com.blackberry.protect',
      appVersion: '1.0.0',
      entitlementId: '',
      created: '2021-02-26T13:57:44.457Z',
      modified: '2021-02-26T16:57:44.457Z',
      expires: '2021-02-26T13:57:44.457Z',
      services: [
        {
          serviceId: ServiceId.MTD,
          status: 'ASSOCIATED',
        },
        {
          serviceId: ServiceId.ECM,
          status: 'ASSOCIATED',
        },
      ],
    },
    {
      guid: mockEndpointGuids.NullDeviceInfoBigGuid,
      tenantId: 'L88092555',
      userId: btoa('userId-2'),
      deviceInfo: null,
      appBundleId: 'com.blackberry.big',
      appVersion: '99.0.0.819',
      entitlementId: 'com.blackberry.ues.desktop',
      created: '2021-04-19T22:00:39.545+00:00',
      modified: '2021-04-19T23:00:39.545+00:00',
      expires: '2021-06-18T22:00:39.545+00:00',
    },
    {
      guid: mockEndpointGuids.WindowsInOsVersionBigGuid,
      tenantId: 'L88092555',
      userId: btoa('userId-3'),
      deviceInfo: {
        deviceId: '8bb31f75-42ec-47bb-b910-20e101ae76ag',
        extDeviceId: '',
        platform: 'Windows',
        osVersion: 'Windows 10.0.0',
        securityPatch: '',
        deviceModelName: 'Windows',
        deviceModelAlias: '',
        manufacturer: 'Microsoft',
      },
      appBundleId: 'com.blackberry.big3',
      appVersion: '99.0.0.819',
      entitlementId: 'com.blackberry.ues.desktop',
      created: '2021-04-19T22:00:39.545+00:00',
      modified: '2021-04-19T23:00:39.545+00:00',
      expires: '2021-06-18T22:00:39.545+00:00',
    },
    // a bug in backend that was fix affected prev enrolled endpoints and return everything null
    // in device Info.  This entry test UI and ensure UI doesnt crash
    // backend fix and verified https://jirasd.rim.net/browse/UES-3860 May 07
    // but existing endpoints in staging/dev are not 'cleaned up'
    {
      guid: mockEndpointGuids.NullDeviceInfoAttribsBigGuid,
      tenantId: 'L88092555',
      userId: btoa('userId-4'),
      deviceInfo: {
        deviceId: null,
        extDeviceId: null,
        platform: null,
        osVersion: null,
        securityPatch: null,
        deviceModelName: null,
        deviceModelAlias: null,
        manufacturer: null,
      },
      appBundleId: 'com.blackberry.big',
      appVersion: '99.0.0.819',
      entitlementId: 'com.blackberry.ues.desktop',
      created: '2021-04-19T22:00:39.545+00:00',
      modified: '2021-04-19T23:00:39.545+00:00',
      expires: '2021-06-18T22:00:39.545+00:00',
    },
    {
      guid: mockEndpointGuids.MacOSBigGuid,
      tenantId: 'L88092555',
      userId: btoa('userId-5'),
      deviceInfo: {
        deviceId: '8bb31f75-42ec-47bb-b910-20e101ae76ah',
        extDeviceId: '',
        platform: 'macOS',
        osVersion: '10.0.0',
        securityPatch: '',
        deviceModelName: 'MacOS',
        deviceModelAlias: '',
        manufacturer: 'Apple',
      },
      appBundleId: 'com.blackberry.big3',
      appVersion: '99.0.0.819',
      entitlementId: 'com.blackberry.ues.desktop',
      created: '2021-04-20T22:00:39.545+00:00',
      modified: '2021-04-20T23:00:39.545+00:00',
      expires: '2021-06-20T22:00:39.545+00:00',
      services: [
        {
          serviceId: ServiceId.MTD,
          status: 'DISASSOCIATED',
        },
      ],
    },
    {
      guid: mockEndpointGuids.iphoneProtectGuid,
      tenantId: 'L88092555',
      userId: btoa('userId-6'),
      deviceInfo: {
        deviceId: '8bb31f75-42ec-47bb-b910-20e101ae76ah',
        extDeviceId: '',
        platform: 'ios',
        osVersion: '10.0.0',
        securityPatch: '',
        deviceModelName: 'iPhone',
        deviceModelAlias: '',
        manufacturer: 'Apple',
      },
      appBundleId: 'com.blackberry.protect',
      appVersion: '1.0.2',
      entitlementId: 'com.blackberry.ues.desktop',
      created: '2021-04-21T22:00:39.545+00:00',
      modified: '2021-04-21T23:00:39.545+00:00',
      expires: '2021-06-21T22:00:39.545+00:00',
      services: [
        {
          serviceId: ServiceId.MTD,
          status: 'ASSOCIATED',
        },
      ],
    },
  ],
}

class UsersClass implements UsersInterface {
  expireUsersPasscodes(selection: ServerSideSelectionModel): Response<{ totalCount: number; failedCount: number }> {
    return Promise.resolve({ data: { totalCount: 3, failedCount: 2 } })
  }
  deleteUsers(selection: ServerSideSelectionModel): Response<DeleteResponse> {
    return Promise.resolve({ data: { success: selection.selected } })
  }
  createUser(user: User): Response<User> {
    return Promise.resolve({ data: user })
  }
  getUsers(query: string, sortBy?: string, offset?: number, max?: number): Response<PagableResponse<User>> {
    return Promise.resolve({ data: usersMock })
  }
  resendInvitation(userIds: string[]): Response<{ totalCount: number; failedCount: number }> {
    return Promise.resolve({ data: { totalCount: 1, failedCount: 2 } })
  }
  resendInvitationExt(selection: ServerSideSelectionModel): Response<{ totalCount: number; failedCount: number }> {
    return Promise.resolve({ data: { totalCount: 1, failedCount: 2 } })
  }
  deleteUser(id: string): Promise<void> {
    return Promise.resolve()
  }
  getUser(id: string): Response<User> {
    return Promise.resolve({ data: usersMock.elements.find(e => e.id === id) })
  }
  updateUser(user: User): Response<User> {
    return Promise.resolve({ data: user })
  }
  getDevices(query: string, sortBy?: string, offset?: number, max?: number): Response<PagableResponse<UserDevice>> {
    return Promise.resolve({ data: devicesMock })
  }
}

const UsersMock = new UsersClass()

export { UsersMock }
