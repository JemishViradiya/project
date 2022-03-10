//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.
import { isEmpty } from 'lodash-es'

import type { PagableResponse, Response } from '@ues-data/shared-types'

import { axiosInstance, deviceBaseUrl, usersBaseUrl } from '../config.rest'
import type { PageableSortableQueryParams } from '../types'
import type UsersInterface from './users-interface'
import type { DevicesBase, DevicesInfo, UsersBase, UsersQueryUrl } from './users-types'

const getUsersQueryUrl = (params: UsersQueryUrl) =>
  Object.keys(params)
    .map(key => (typeof params[key] === 'object' ? `${key}=${params[key].join(',')}` : `${key}=${params[key]}`))
    .join('&')

export const makeUsersEndpoint = params => {
  return `${usersBaseUrl}${!isEmpty(params) ? '?' + getUsersQueryUrl({ ...params }) : ''}`
}

class UsersClass implements UsersInterface {
  readAll(
    params?: PageableSortableQueryParams<UsersBase>,
  ): Response<PagableResponse<UsersBase> | Partial<PagableResponse<UsersBase>>> {
    return axiosInstance().get(makeUsersEndpoint(params))
  }

  readDevices(userId: string): Response<DevicesBase[] | Partial<DevicesBase[]>> {
    return axiosInstance().get(`${usersBaseUrl}/${userId}/devices`)
  }

  readDevicesInfo(devicesIds: string[]): Response<DevicesInfo> {
    return axiosInstance().post(`${deviceBaseUrl}/devicesInfo/batch`, devicesIds)
  }
}

const UsersApi = new UsersClass()

export { UsersApi }
