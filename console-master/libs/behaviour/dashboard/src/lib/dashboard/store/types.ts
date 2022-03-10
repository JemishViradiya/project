/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
export const ReduxSlice = 'uc.dashboard.state'

export const ActionType = {
  INITIALIZE_DASHBOARD: `${ReduxSlice}/INITIALIZE_DASHBOARD`,
  INITIALIZE_STATE: `${ReduxSlice}/INITIALIZE_STATE`,
  UPDATE_TITLE: `${ReduxSlice}/UPDATE_TITLE`,
  UPDATE_TITLE_UI: `${ReduxSlice}/UPDATE_TITLE_UI`,
  UPDATE_GLOBAL_TIME: `${ReduxSlice}/UPDATE_GLOBAL_TIME`,
  UPDATE_GLOBAL_TIME_UI: `${ReduxSlice}/UPDATE_GLOBAL_TIME_UI`,
  UPDATE_CARDS: `${ReduxSlice}/UPDATE_CARDS`,
  UPDATE_CARDS_UI: `${ReduxSlice}/UPDATE_CARDS_UI`,
  UPDATE_LAYOUT: `${ReduxSlice}/UPDATE_LAYOUT`,
  UPDATE_LAYOUT_UI: `${ReduxSlice}/UPDATE_LAYOUT_UI`,
  ADD_NEW_CARD: `${ReduxSlice}/ADD_NEW_CARD`,
  DELETE_CARD: `${ReduxSlice}/DELETE_CARD`,
  UPDATE_CARDS_AND_LAYOUT_UI: `${ReduxSlice}/UPDATE_CARDS_AND_LAYOUT_UI`,
  ERROR: `${ReduxSlice}/ERROR`,
}
