/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { BcnConfigSettings, BCNConnection } from '../common'
import type BcnInterface from '../common/bcn-interface'
import { ActionType } from './types'

export const getBcnConnectionsStart = (apiProvider: BcnInterface) => ({
  type: ActionType.GetConnectionsStart,
  payload: { apiProvider },
})

export const getBcnConnectionsSuccess = (connections: BCNConnection[]) => ({
  type: ActionType.GetConnectionsSuccess,
  payload: { connections },
})

export const getBcnConnectionsError = (error: Error) => ({
  type: ActionType.GetConnectionsError,
  payload: { error },
})

export const deleteBcnConnectionStart = (payload: { id: string }, apiProvider: BcnInterface) => ({
  type: ActionType.DeleteConnectionStart,
  payload: { ...payload, apiProvider },
})

export const deleteBcnConnectionSuccess = (id: string) => ({
  type: ActionType.DeleteConnectionSuccess,
  payload: { id },
})

export const deleteBcnConnectionError = (error: Error) => ({
  type: ActionType.DeleteConnectionError,
  payload: { error },
})

export const getBcnSettingsStart = (apiProvider: BcnInterface) => ({
  type: ActionType.GetSettingsStart,
  payload: { apiProvider },
})

export const getBcnSettingsSuccess = (payload: any) => ({
  type: ActionType.GetSettingsSuccess,
  payload: { settings: payload },
})

export const getBcnSettingsError = (error: Error) => ({
  type: ActionType.GetSettingsError,
  payload: { error },
})

export const setLocalBcnSettings = (payload: any) => ({
  type: ActionType.SetLocalSettings,
  payload: { settings: payload },
})
