//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.
import { isEmpty } from 'lodash-es'

import type { PagableResponse, Response } from '@ues-data/shared-types'

import { analyticsBaseUrl, axiosInstance } from '../config.rest'
import type { PageableSortableEventsQueryParams } from '../types'
import type DlpEventsInterface from './events-interface'
import type { EventBase, EventDetails, EventsListRequestBody } from './events-types'

// TODO update typescript check
type EventsQueryUrl = {
  limit?: number
  sortBy?: any
  startTime?: number
  stopTime?: number
  eventType?: string[]
  userName?: string
  locations?: string
  policyGuid?: string
  policyName?: string
  clientName?: string
  fileName?: string
  fileType?: string
  dataEntityGuid?: string
  dataEntityName?: string
}

const getEventsQueryUrl = (params: EventsQueryUrl) =>
  Object.keys(params)
    .map(key => (typeof params[key] === 'object' ? `${key}=${params[key].join(',')}` : `${key}=${params[key]}`))
    .join('&')

export const makeEventDetailsEndpoint = (eventUUID?: string): string => `${analyticsBaseUrl}/events/${eventUUID}`
export const makeEventListEndpoint = params =>
  `${analyticsBaseUrl}/events/view${!isEmpty(params) ? '?' + getEventsQueryUrl(params) : '/'}`

class DlpEventsClass implements DlpEventsInterface {
  readAll(
    eventsListRequestBody?: EventsListRequestBody,
    params?: PageableSortableEventsQueryParams<EventBase>,
  ): Response<PagableResponse<EventBase> | Partial<PagableResponse<EventBase>>> {
    return axiosInstance().post(makeEventListEndpoint(params), { ...eventsListRequestBody })
  }
  read(eventUUID: string): Response<EventDetails | Partial<EventDetails>> {
    return axiosInstance().get(makeEventDetailsEndpoint(eventUUID))
  }
}

const DlpEventsApi = new DlpEventsClass()

export { DlpEventsApi }
