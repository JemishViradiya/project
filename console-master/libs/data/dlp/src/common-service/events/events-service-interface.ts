/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { Response } from '@ues-data/shared'

import type { EventsListRequestBody } from '../../events-service/events-types'
import type { EventCountByDetails } from './events-types'

interface EventsServiceInterface {
  /**
   * Get the count of events view
   * @param eventsListRequestBody The fileHashes of files, userIds of users, deviceIds of devices
   */
  readEventCount(eventsListRequestBody: EventsListRequestBody): Response<Partial<EventCountByDetails> | EventCountByDetails>
}

export default EventsServiceInterface
