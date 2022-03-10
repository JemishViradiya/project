//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { PagableResponse, Response } from '@ues-data/shared-types'

import type { PageableSortableEventsQueryParams } from '../types'
import type { EventBase, EventDetails, EventsListRequestBody } from './events-types'

export default interface DlpEventsInterface {
  /**
   * Get pageable view of events
   * @param eventsListRequestBody The fileHashes of files, userIds of users, deviceIds of devices
   * @param params The query params
   */
  readAll(
    eventsListRequestBody?: EventsListRequestBody,
    params?: PageableSortableEventsQueryParams<EventBase>,
  ): Response<Partial<PagableResponse<EventBase>> | PagableResponse<EventBase>>

  /**
   * Get the detailed event view
   * @param eventUUID The id of particular event
   */
  read(eventUUID: string): Response<Partial<EventDetails> | EventDetails>
}
