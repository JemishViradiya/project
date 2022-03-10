/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { PagableResponse } from '@ues-data/shared-types'

import type { DlpEventsApi, DlpEventsMockApi, EventBase, EventDetails } from '../events-service'

export type ApiProvider = typeof DlpEventsApi | typeof DlpEventsMockApi
export const DlpEventsReduxSlice = 'app.dlp.events'

export interface Task<TResult = unknown> {
  loading?: boolean
  error?: Error
  result?: TResult
}

export enum TaskId {
  GetEvents = 'getEvents',
  GetEventDetails = 'getEventDetails',
}

export interface DlpEventsState {
  tasks?: {
    getEvents: Task<PagableResponse<EventBase>>
    getEventDetails: Task<PagableResponse<EventDetails>>
  }
}

export const DlpEventsActionType = {
  FetchEventsStart: `${DlpEventsReduxSlice}/fetch-events-start`,
  FetchEventsError: `${DlpEventsReduxSlice}/fetch-events-error`,
  FetchEventsSuccess: `${DlpEventsReduxSlice}/fetch-events-success`,

  FetchEventDetailsStart: `${DlpEventsReduxSlice}/fetch-event-details-start`,
  FetchEventDetailsError: `${DlpEventsReduxSlice}/fetch-event-details-error`,
  FetchEventDetailsSuccess: `${DlpEventsReduxSlice}/fetch-event-details-success`,
}

// eslint-disable-next-line no-redeclare
export type DlpEventsActionType = string
