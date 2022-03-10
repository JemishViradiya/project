/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { DashboardProps } from '../types'
import { ActionType } from './types'

const defaultState: DashboardProps = {
  id: '',
  title: undefined,
  globalTime: undefined,
  chartLibrary: {},
  cardState: {},
  layoutState: [],
  editable: true,
  error: null,
}

function getCardState(cardState) {
  if (cardState) {
    if (typeof cardState === 'string') return JSON.parse(cardState)
    return cardState
  }
  return {}
}

function getLayoutState(layoutState) {
  if (layoutState) {
    if (typeof layoutState === 'string') return JSON.parse(layoutState)
    return layoutState
  }
  return []
}

function dashboardReducer(state = defaultState, action) {
  switch (action.type) {
    case ActionType.INITIALIZE_STATE:
      return {
        ...action.payload,
        cardState: getCardState(action.payload.cardState),
        layoutState: getLayoutState(action.payload.layoutState),
        error: null,
      }
    case ActionType.UPDATE_GLOBAL_TIME_UI:
      return {
        ...state,
        globalTime: action.payload,
      }
    case ActionType.UPDATE_TITLE_UI:
      return {
        ...state,
        title: action.payload,
      }
    case ActionType.UPDATE_CARDS_AND_LAYOUT_UI: {
      return {
        ...state,
        layoutState: action.payload.layoutState,
        cardState: action.payload.cardState,
      }
    }
    case ActionType.UPDATE_LAYOUT_UI:
      return {
        ...state,
        layoutState: action.payload,
      }
    case ActionType.UPDATE_CARDS_UI:
      return {
        ...state,
        cardState: action.payload,
      }
    case ActionType.ERROR:
      console.error(action.payload.error)
      return {
        ...state,
        error: action.payload.error,
      }
    default:
      return {
        ...state,
        error: null,
      }
  }
}

export default dashboardReducer
