/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { Response } from '@ues-data/shared'
import { UesAxiosClient } from '@ues-data/shared'

import { analyticsBaseUrl } from '../../config.rest'
import type { EventsListRequestBody } from '../../events-service/events-types'
import type EventsServiceInterface from './events-service-interface'
import type { EventCountByDetails } from './events-types'

export const makeEventsCountEndpoint = `${analyticsBaseUrl}/events/count`

class EventServiceClass implements EventsServiceInterface {
  readEventCount(eventsListRequestBody: EventsListRequestBody): Response<EventCountByDetails | Partial<EventCountByDetails>> {
    return UesAxiosClient().post(makeEventsCountEndpoint, { ...eventsListRequestBody })
  }
}

const EventsServiceClass = new EventServiceClass()

export { EventsServiceClass }
