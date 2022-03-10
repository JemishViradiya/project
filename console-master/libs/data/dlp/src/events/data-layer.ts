/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { ReduxQuery } from '@ues-data/shared'
import type { PagableResponse } from '@ues-data/shared-types'
import { Permission } from '@ues-data/shared-types'

import { DlpEventsApi, DlpEventsMockApi } from '../events-service'
import type { EventBase, EventDetails } from '../events-service/events-types'
import { fetchEventDetailsStart, fetchEventsStart } from './actions'
import { getDlpEventDetailsTask, getDlpEventsTask } from './selectors'
import type { DlpEventsState, TaskId } from './types'
import { DlpEventsReduxSlice } from './types'

const permissions = new Set([Permission.BIP_EVENT_READ])

export const queryEventList: ReduxQuery<
  PagableResponse<EventBase>,
  Parameters<typeof fetchEventsStart>[0],
  DlpEventsState['tasks'][TaskId.GetEvents]
> = {
  query: payload => fetchEventsStart(payload, DlpEventsApi),
  mockQuery: payload => fetchEventsStart(payload, DlpEventsMockApi),
  selector: () => getDlpEventsTask,
  dataProp: 'result',
  slice: DlpEventsReduxSlice,
  permissions,
}

export const queryEventDetails: ReduxQuery<
  EventDetails,
  Parameters<typeof fetchEventDetailsStart>[0],
  DlpEventsState['tasks'][TaskId.GetEventDetails]
> = {
  query: payload => fetchEventDetailsStart(payload, DlpEventsApi),
  mockQuery: payload => fetchEventDetailsStart(payload, DlpEventsMockApi),
  selector: () => getDlpEventDetailsTask,
  dataProp: 'result',
  slice: DlpEventsReduxSlice,
  permissions,
}
