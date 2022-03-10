/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { PagableResponse } from '@ues-data/shared'

import type { EventBase, EventDetails, EventsListRequestBody } from '../events-service/events-types'
import type { PageableSortableEventsQueryParams } from '../types'
import type { ApiProvider } from './types'
import { DlpEventsActionType } from './types'

// fetch EventBase list
export const fetchEventsStart = (
  payload: { eventsListRequestBody: EventsListRequestBody; queryParams: PageableSortableEventsQueryParams<EventBase> },
  apiProvider: ApiProvider,
) => ({
  type: DlpEventsActionType.FetchEventsStart,
  payload: { ...payload, apiProvider },
})

export const fetchEventsSuccess = (payload: PagableResponse<EventBase>) => ({
  type: DlpEventsActionType.FetchEventsSuccess,
  payload,
})

export const fetchEventsError = (error: Error) => ({
  type: DlpEventsActionType.FetchEventsError,
  payload: { error },
})

// fetch Dlp events by eventUUID
export const fetchEventDetailsStart = (payload: { eventUUID: string }, apiProvider: ApiProvider) => {
  return {
    type: DlpEventsActionType.FetchEventDetailsStart,
    payload: { ...payload, apiProvider },
  }
}

export const fetchEventDetailsSuccess = (payload: EventDetails) => ({
  type: DlpEventsActionType.FetchEventDetailsSuccess,
  payload,
})

export const fetchEventDetailsError = (error: Error) => ({
  type: DlpEventsActionType.FetchEventDetailsError,
  payload: { error },
})
