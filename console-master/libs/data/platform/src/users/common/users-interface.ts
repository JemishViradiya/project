import type { PagableResponse, Response } from '@ues-data/shared-types'

import type { Group } from '../../group/common/group-types'
import type { DeleteResponse, ServerSideSelectionModel } from '../../shared/types'
import type { User, UserDevice } from './users-types'

export default interface UsersInterface {
  /**
   * Get users
   */
  getUsers(query: string, sortBy?: string, offset?: number, max?: number): Response<PagableResponse<User>>

  /**
   * Create user
   */
  createUser(user: User): Response<User>

  /**
   * Delete user
   */
  deleteUser(id: string): Promise<void>

  /**
   * Get user
   */
  getUser(id: string): Response<User>

  /**
   * Update user
   */
  updateUser(user: User): Response<User>

  /**
   * Get devices
   */
  getDevices(query: string, sortBy?: string, offset?: number, max?: number): Response<PagableResponse<UserDevice>>

  /**
   * Delete users
   */
  deleteUsers(selection: ServerSideSelectionModel): Response<DeleteResponse>

  /**
   * Resend invitations
   */
  resendInvitation(userIds: string[]): Response<{ totalCount: number; failedCount: number }>

  /**
   * Resend invitations via grid bff
   */
  resendInvitationExt(selection: ServerSideSelectionModel): Response<{ totalCount: number; failedCount: number }>

  /**
   * Expire users' passcodes
   */
  expireUsersPasscodes(selection: ServerSideSelectionModel): Response<{ totalCount: number; failedCount: number }>
}
