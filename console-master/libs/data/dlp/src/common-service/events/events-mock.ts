/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { Response } from '@ues-data/shared'

import type { EventsListRequestBody } from '../../events-service/events-types'
import type EventsServiceInterface from './events-service-interface'
import type { EventCountByDetails } from './events-types'

// const eventsListRequestBodySample = {
//   fileHashes: ['d38cba4ec9054785988bbacc56b5587e', 'a327fca35c3541fabb4a05932c86aced', '3c4afecf66f04cdcb1b4f2574ef53b45'],
// }

// FileHashes were taken from libs/data/dlp/src/evidence-locker-service/evidence-locker-mock.ts
const EventsCountResponse = (eventsListRequestBody: EventsListRequestBody) => ({
  items: {
    fileHashes: [
      {
        item: 'd38cba4ec9054785988bbacc56b5587e',
        count: 2,
      },
      {
        item: 'a327fca35c3541fabb4a05932c86aced',
        count: 2,
      },
    ],
  },
})

class EventsServiceClass implements EventsServiceInterface {
  readEventCount(eventsListRequestBody: EventsListRequestBody): Response<EventCountByDetails | Partial<EventCountByDetails>> {
    console.log(`readEventCount():  ${JSON.stringify(EventsCountResponse(eventsListRequestBody))}`)
    return Promise.resolve({ data: EventsCountResponse(eventsListRequestBody) })
  }
}

const EventsServiceClassMock = new EventsServiceClass()

export { EventsServiceClassMock }
