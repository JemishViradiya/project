//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { Action } from 'redux'

export interface ActionWithPayload<TActionType extends string = string, TPayload = unknown> extends Action<TActionType> {
  payload?: TPayload
}

export const createAction = <TActionType extends string, TPayload>(
  type: TActionType,
  payload?: TPayload,
): ActionWithPayload<TActionType, TPayload> => ({
  type,
  payload,
})
