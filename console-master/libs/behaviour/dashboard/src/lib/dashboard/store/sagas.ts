/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { all, call, put, select, takeEvery } from 'redux-saga/effects'

import { compareLayout } from '../utils'
import { selectCardState, selectChartLibrary, selectDashboardId, selectLayoutState } from './selectors'
import { ActionType } from './types'

const watchInitialize = function* (): Generator {
  yield takeEvery(ActionType.INITIALIZE_DASHBOARD, initializeState)
}

const watchTitleUpdate = function* (): Generator {
  yield takeEvery(ActionType.UPDATE_TITLE, updateTitle)
}

const watchGlobalTimeUpdate = function* (): Generator {
  yield takeEvery(ActionType.UPDATE_GLOBAL_TIME, updateGlobalTime)
}

const watchLayoutUpdate = function* (): Generator {
  yield takeEvery(ActionType.UPDATE_LAYOUT, updateLayout)
}

const watchCardsUpdate = function* (): Generator {
  yield takeEvery(ActionType.UPDATE_CARDS, updateCards)
}

const watchAddNewCard = function* (): Generator {
  yield takeEvery(ActionType.ADD_NEW_CARD, addNewCard)
}

const watchDeleteCard = function* (): Generator {
  yield takeEvery(ActionType.DELETE_CARD, deleteCard)
}

export const rootSaga = function* (): Generator {
  yield all([
    watchInitialize(),
    watchTitleUpdate(),
    watchGlobalTimeUpdate(),
    watchCardsUpdate(),
    watchLayoutUpdate(),
    watchAddNewCard(),
    watchDeleteCard(),
  ])
}

let canPersist = false

function* callFn(updateFn, variables) {
  if (canPersist) yield call(updateFn, { variables })
}

function* initializeState(action) {
  canPersist = !action.payload.nonPersistent
  if (action.payload.error) {
    yield put({
      type: ActionType.ERROR,
      payload: { error: action.payload.error },
    })
  } else {
    yield put({ type: ActionType.INITIALIZE_STATE, payload: { ...action.payload } })
  }
}

function* updateTitle(action) {
  try {
    const title = action.payload.title
    const dashboardId = action.payload.dashboardId
    yield callFn(action.payload.updateFn, { dashboardId, title })
    yield put({ type: ActionType.UPDATE_TITLE_UI, payload: title })
  } catch (e) {
    yield put({ type: ActionType.ERROR, payload: { error: e } })
  }
}

function* updateGlobalTime(action) {
  try {
    const globalTime = action.payload.globalTime
    yield put({ type: ActionType.UPDATE_GLOBAL_TIME_UI, payload: globalTime })
    const dashboardId = yield select(selectDashboardId)
    yield callFn(action.payload.updateFn, { dashboardId, globalTime: globalTime.timeInterval })
  } catch (e) {
    yield put({ type: ActionType.ERROR, payload: { error: e } })
  }
}

function* updateLayout(action) {
  try {
    // update ui first, then persist data
    yield put({ type: ActionType.UPDATE_LAYOUT_UI, payload: action.payload.layoutState })
    const dashboardId = yield select(selectDashboardId)
    yield callFn(action.payload.updateFn, { dashboardId, layoutState: JSON.stringify(action.payload.layoutState) })
  } catch (e) {
    yield put({ type: ActionType.ERROR, payload: { error: e } })
  }
}

function* updateCards(action) {
  const cardInfo = action.payload.cardInfo
  const id = cardInfo.id
  const option = cardInfo.option
  const value = cardInfo.value
  const cardState = yield select(selectCardState)
  const newCardState = {
    ...cardState,
    [id]: {
      ...cardState[id],
      options: {
        ...cardState[id].options,
        [option]: value,
      },
    },
  }
  try {
    // update ui first, then persist data
    yield put({ type: ActionType.UPDATE_CARDS_UI, payload: newCardState })
    const dashboardId = yield select(selectDashboardId)
    yield callFn(action.payload.updateFn, { dashboardId, cardState: JSON.stringify(newCardState) })
  } catch (e) {
    yield put({ type: ActionType.ERROR, payload: { error: e } })
  }
}

function* addNewCard(action) {
  const cardInfo = action.payload.cardInfo
  const id = cardInfo.id
  const chartId = cardInfo.chartId
  const chartLibrary = yield select(selectChartLibrary)
  const cardState = yield select(selectCardState)

  const newLayoutItem = {
    i: id,
    x: cardInfo.x,
    y: cardInfo.y,
    w: chartLibrary[chartId].defaultWidth,
    h: chartLibrary[chartId].defaultHeight,
  }
  let currentLayout = cardInfo.layout
  currentLayout.unshift(newLayoutItem)
  currentLayout = currentLayout.filter(item => item.i !== 'droppingItem')
  currentLayout.sort(compareLayout)

  const newCardState = {
    ...cardState,
    [id]: {
      chartId: chartId,
    },
  }

  try {
    // update ui first, then persist data
    yield put({
      type: ActionType.UPDATE_CARDS_AND_LAYOUT_UI,
      payload: { cardState: newCardState, layoutState: currentLayout },
    })
    const dashboardId = yield select(selectDashboardId)
    yield callFn(action.payload.updateFn, {
      dashboardId,
      cardState: JSON.stringify(newCardState),
      layoutState: JSON.stringify(currentLayout),
    })
  } catch (e) {
    yield put({ type: ActionType.ERROR, payload: { error: e } })
  }
}

function* deleteCard(action) {
  const id = action.payload.id
  const layoutState = yield select(selectLayoutState)
  const cardState = yield select(selectCardState)

  const { [id]: remove, ...cardStateRest } = cardState
  const filteredLayout = layoutState.filter(item => item.i !== id)

  try {
    // update ui first, then persist data
    yield put({
      type: ActionType.UPDATE_CARDS_AND_LAYOUT_UI,
      payload: { cardState: cardStateRest, layoutState: filteredLayout },
    })
    const dashboardId = yield select(selectDashboardId)
    yield callFn(action.payload.updateFn, {
      dashboardId,
      cardState: JSON.stringify(cardStateRest),
      layoutState: JSON.stringify(filteredLayout),
    })
  } catch (e) {
    yield put({ type: ActionType.ERROR, payload: { error: e } })
  }
}
