/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { ACCEPTED, CONFLICT } from 'http-status-codes'

import type { AsyncMutation, AsyncQuery, PagableResponse } from '@ues-data/shared'

import {
  DeviceReadPermissions,
  UserCreatePermissions,
  UserDeletePermissions,
  UserReadPermissions,
  UserUpdatePermissions,
} from '../../shared/permissions'
import type { ServerSideSelectionModel } from '../../shared/types'
import { addUserToCache, deleteUsersFromCache, updateUserInCache, userToAggregatedUser } from '../apollo'
import { UsersCache } from '../apollo/cache'
import type { User, UserDevice } from '../common'
import { Users, UsersMock } from '../common'
import type UsersInterface from '../common/users-interface'

export const queryUser: AsyncQuery<User, { id: string }> = {
  query: async ({ id }) => {
    if (id) {
      const data = await Users.getUser(id)
      return data.data
    } else {
      return undefined
    }
  },
  mockQueryFn: async ({ id }) => {
    if (id) {
      const data = await UsersMock.getUser(id)

      return data.data
    } else {
      return undefined
    }
  },
  permissions: UserReadPermissions,
}

const createOrUpdateUser = async (user: User, usersActions: UsersInterface) => {
  try {
    return await usersActions.createUser(user)
  } catch (e) {
    if (e.response?.status === CONFLICT && user.dataSource === 'cur') {
      const existingUserData = await usersActions.getUsers(`emailAddress=${user.emailAddress}`)
      const hiddenAdmins = existingUserData?.data?.elements.filter(e => e.isAdminOnly) ?? []
      const sameEmailUsers = existingUserData?.data?.elements.filter(e => !e.isAdminOnly) ?? []

      if (hiddenAdmins.length > 0 && sameEmailUsers.length === 0) {
        const existingAdmin = hiddenAdmins[0]
        existingAdmin.isAdminOnly = false
        delete existingAdmin['services'] // omit returned services
        return await usersActions.updateUser(existingAdmin)
      } else {
        throw e
      }
    } else {
      throw e
    }
  }
}

export const createUser: AsyncMutation<any, { user: User }> = {
  mutation: async ({ user }) => {
    const response = await createOrUpdateUser(user, Users)
    if (response.data.id) {
      addUserToCache(userToAggregatedUser(response.data))
    }
    return response.data
  },
  mockMutationFn: async ({ user }) => {
    const response = await createOrUpdateUser(user, UsersMock)
    if (response.data.id) {
      addUserToCache(userToAggregatedUser(response.data))
    }
    return response.data
  },
  permissions: UserCreatePermissions,
}

export const editUser: AsyncMutation<any, { user: User }> = {
  mutation: async ({ user }) => {
    const response = await Users.updateUser(user)
    if (response.data.id) {
      UsersCache.write(response.data).catch(error => console.warn(error)) // update idb cache
      updateUserInCache(userToAggregatedUser(response.data)) // update apollo cache
    }
    return response.data
  },
  mockMutationFn: async ({ user }) => {
    const response = await UsersMock.updateUser(user)
    if (response.data.id) {
      updateUserInCache(userToAggregatedUser(response.data))
    }
    return response.data
  },
  permissions: UserUpdatePermissions,
}

export const resendInvitation: AsyncMutation<any, { userIds: string[] }> = {
  mutation: async ({ userIds }) => {
    const response = await Users.resendInvitation(userIds)

    return response.data
  },
  mockMutationFn: async ({ userIds }) => {
    const response = await UsersMock.resendInvitation(userIds)

    return response.data
  },
  permissions: UserUpdatePermissions,
}

export const resendInvitationExt: AsyncMutation<any, { selectionModel: ServerSideSelectionModel }> = {
  mutation: async ({ selectionModel }) => {
    const data = await Users.resendInvitationExt(selectionModel)

    return data.status === ACCEPTED ? { ...data.data, bulkActionInProcess: true } : data.data
  },
  mockMutationFn: async ({ selectionModel }) => {
    const data = await UsersMock.resendInvitationExt(selectionModel)

    return data.status === ACCEPTED ? { ...data.data, bulkActionInProcess: true } : data.data
  },
  permissions: UserUpdatePermissions,
}

export const queryDevices: AsyncQuery<PagableResponse<UserDevice>, { query: string }> = {
  query: async ({ query }) => {
    if (query) {
      const data = await Users.getDevices(query)
      return data.data
    } else {
      return undefined
    }
  },
  mockQueryFn: async ({ query }) => {
    if (query) {
      const data = await UsersMock.getDevices(query)

      return data.data
    } else {
      return undefined
    }
  },
  permissions: DeviceReadPermissions,
}

export const deleteUsers: AsyncMutation<any, { selectionModel: ServerSideSelectionModel }> = {
  mutation: async ({ selectionModel }) => {
    const data = await Users.deleteUsers(selectionModel)
    if (data.data?.success && data.data?.success.length > 0) {
      const deletedIds = data.data.success
      deleteUsersFromCache(deletedIds)
    }
    return data.status === ACCEPTED ? { ...data.data, deleteIsInProcess: true } : data.data
  },
  mockMutationFn: async ({ selectionModel }) => {
    const data = await UsersMock.deleteUsers(selectionModel)
    if (data.data?.success && data.data?.success.length > 0) {
      const deletedIds = data.data.success
      deleteUsersFromCache(deletedIds)
    }
    return data.status === ACCEPTED ? { ...data.data, deleteIsInProcess: true } : data.data
  },
  permissions: UserDeletePermissions,
}

export const expireUsersPasscodes: AsyncMutation<any, { selectionModel: ServerSideSelectionModel }> = {
  mutation: async ({ selectionModel }) => {
    const data = await Users.expireUsersPasscodes(selectionModel)
    return data.status === ACCEPTED ? { ...data.data, bulkActionInProcess: true } : data.data
  },
  mockMutationFn: async ({ selectionModel }) => {
    const data = await UsersMock.expireUsersPasscodes(selectionModel)
    return data.status === ACCEPTED ? { ...data.data, bulkActionInProcess: true } : data.data
  },
  permissions: UserUpdatePermissions,
}
