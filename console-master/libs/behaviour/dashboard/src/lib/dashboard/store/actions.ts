/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { ActionType } from './types'

export function initialize(payload) {
  return { type: ActionType.INITIALIZE_DASHBOARD, payload }
}

export function initializeMock(payload) {
  return { type: ActionType.INITIALIZE_STATE, payload }
}

export function updateGlobalTime(payload) {
  return { type: ActionType.UPDATE_GLOBAL_TIME, payload }
}

export function updateDashboardTitle(payload) {
  return { type: ActionType.UPDATE_TITLE, payload }
}

export function updateDashboardTitleUI(payload) {
  return { type: ActionType.UPDATE_TITLE_UI, payload }
}

export function updateCardState(payload) {
  return { type: ActionType.UPDATE_CARDS, payload }
}

export function deleteCard(payload) {
  return { type: ActionType.DELETE_CARD, payload }
}

export function addNewCard(payload) {
  return { type: ActionType.ADD_NEW_CARD, payload }
}

export function updateLayout(payload) {
  return { type: ActionType.UPDATE_LAYOUT, payload }
}
