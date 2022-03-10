//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.
import type { PagableResponse, Response } from '@ues-data/shared-types'

import { axiosInstance, baseUrl } from '../../config.rest'
import type { DeleteResponse, ServerSideSelectionModel } from '../../shared/types'
import type UsersInterface from './users-interface'
import type { User, UserDevice } from './users-types'

const bffGridBaseUrl = `${baseUrl}/v1/bffgrid`

class UsersClass implements UsersInterface {
  deleteUsers(selection: ServerSideSelectionModel): Response<DeleteResponse> {
    return axiosInstance().delete(`${bffGridBaseUrl}/deleteUsers`, {
      data: selection,
    })
  }
  deleteDevices(selection: ServerSideSelectionModel): Response<DeleteResponse> {
    return axiosInstance().delete(`${bffGridBaseUrl}/deleteEndpoints`, {
      data: selection,
    })
  }
  createUser(user: User): Response<User> {
    return axiosInstance().post(`/platform/v1/users`, user)
  }
  getUsers(query: string, sortBy?: string, offset?: number, max?: number): Response<PagableResponse<User>> {
    return axiosInstance().get(`/platform/v1/users`, { params: { query, sortBy, offset, max } })
  }
  getBffGridUsers(query: string, sortBy?: string, offset?: number, max?: number): Response<PagableResponse<User>> {
    return axiosInstance().get(`${bffGridBaseUrl}/users`, { params: { query, sortBy, offset, max } })
  }
  resendInvitation(userIds: string[]): Response<{ totalCount: number; failedCount: number }> {
    return axiosInstance().post(`/platform/v1/endpoints/admin/email`, userIds)
  }
  resendInvitationExt(selection: ServerSideSelectionModel): Response<{ totalCount: number; failedCount: number }> {
    return axiosInstance().post(`${bffGridBaseUrl}/resendInvitation`, selection)
  }
  deleteUser(id: string): Promise<void> {
    return axiosInstance().delete(`/platform/v1/users/${id}`)
  }
  getUser(id: string): Response<User> {
    return axiosInstance().get(`/platform/v1/users/${id}`)
  }
  updateUser(user: User): Response<User> {
    return axiosInstance().patch(`/platform/v1/users/${user.id}`, user)
  }
  getDevices(query: string, sortBy?: string, offset?: number, max?: number): Response<PagableResponse<UserDevice>> {
    return axiosInstance().get(`/platform/v1/entities/endpoints`, { params: { query, sortBy, offset, max } })
  }
  getBffGridDevices(query: string, sortBy?: string, offset?: number, max?: number): Response<PagableResponse<UserDevice>> {
    return axiosInstance().get(`${bffGridBaseUrl}/endpoints`, { params: { query, sortBy, offset, max } })
  }
  expireUsersPasscodes(selection: ServerSideSelectionModel): Response<{ totalCount: number; failedCount: number }> {
    return axiosInstance().post(`${bffGridBaseUrl}/passwordExpiry`, selection)
  }
}

export const Users = new UsersClass()
