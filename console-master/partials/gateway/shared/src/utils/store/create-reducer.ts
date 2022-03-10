//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { Action, Reducer } from 'redux'

export type ReducerHandlers<TState, TAction extends Action> = {
  [TType in TAction['type']]: (state: TState, action: Extract<TAction, { type: TType }>) => TState
}

export const createReducer = <TState = unknown, TAction extends Action = Action>(
  defaultState: TState,
  handlers: ReducerHandlers<TState, TAction>,
): Reducer<TState, TAction> => (maybeState, action) => {
  const state = maybeState ?? defaultState

  return action.type in handlers ? handlers[action.type](state, action) : state
}
