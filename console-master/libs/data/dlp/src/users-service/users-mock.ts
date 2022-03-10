//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

/* eslint-disable prefer-rest-params, sonarjs/no-duplicate-string */

import type { PagableResponse, Response } from '@ues-data/shared-types'

import type { PageableSortableQueryParams } from '../types'
import type UsersInterface from './users-interface'
import type { DevicesBase, DevicesInfo, UsersBase } from './users-types'

export const mockedUsersList: UsersBase[] = [
  {
    userId: 'dXNlcklkLTE=',
    name: 'Pauly Thwaites',
    email: 'pthwaites0@blackhole.sw.rim.net',
    deviceCount: 2,
  },
  {
    userId: 'dXNlcklkLTI=',
    name: 'Joleen Cardno',
    email: 'jcardno1@blackhole.sw.rim.net',
    deviceCount: 0,
  },
  {
    userId: 'a34afec35c3541fabb4a05932c86aced',
    name: '',
    email: 'jbblu@bb.com',
    deviceCount: 0,
  },
  {
    userId: 'dXNlcklkLTM=',
    name: 'Siana Reboulet',
    email: 'sreboulet2@blackhole.sw.rim.net',
    deviceCount: 1,
  },
]

export const UsersResponse = (params?: PageableSortableQueryParams<UsersBase>): PagableResponse<UsersBase> => ({
  totals: {
    pages: 1,
    elements: mockedUsersList.length,
  },
  count: mockedUsersList.length,
  elements: params ? mockedUsersList.slice(0, params?.offset) : mockedUsersList,
})

export const mockedDevicesData: DevicesBase[] = [
  {
    deviceId: 'c5fab0ca-b94b-4ae7-91d1-3c4dbdec99b0',
    activationTime: '2022-01-06T18:51:30.406Z',
    lastAccessedTime: '2022-01-06T18:51:30.406Z',
  },
  {
    deviceId: 'a80bf740-7dc3-4815-8572-265bf0065d48',
    activationTime: '2022-01-06T18:51:30.406Z',
    lastAccessedTime: '2022-01-06T18:51:30.406Z',
  },
]

export const mockedDevicesInfoData: DevicesInfo = {
  'c5fab0ca-b94b-4ae7-91d1-3c4dbdec99b0':
    '{"deviceType":"DESKTOP","enrollmentDate":"2022-01-21T15:43:41Z","deviceName":"BR-DLPDAUTO01","osName":"Windows","osVersion":"10.0.19042.0","dlpVersion":"1.108.0.306","eosVersion":"0.10.0.296"}',
  'a80bf740-7dc3-4815-8572-265bf0065d48':
    '{"deviceType":"MOBILE","enrollmentDate":"2022-01-21T15:43:41Z","deviceModel":"iPhone","manufacturerName":"Apple","osVersion":"14.4","dlpVersion":"1.0","platform":"iOS"}',
}

class UsersMockClass implements UsersInterface {
  readAll(
    params?: PageableSortableQueryParams<UsersBase>,
  ): Response<PagableResponse<UsersBase> | Partial<PagableResponse<UsersBase>>> {
    return Promise.resolve({ data: UsersResponse(params) })
  }

  readDevices(userId: string): Response<DevicesBase[]> {
    return Promise.resolve({
      data: mockedDevicesData,
    })
  }

  readDevicesInfo(devicesIds: string[]): Response<DevicesInfo> {
    return Promise.resolve({
      data: mockedDevicesInfoData,
    })
  }
}

const UsersMockApi = new UsersMockClass()

export { UsersMockApi }
