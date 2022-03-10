//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

/* eslint-disable prefer-rest-params, sonarjs/no-duplicate-string */

import { v4 as uuidv4 } from 'uuid'

import type { PagableResponse, Response } from '@ues-data/shared-types'

import type { PageableSortableEventsQueryParams } from '../types'
import type DlpEventsInterface from './events-interface'
import type {
  DataEntityDetails,
  EventBase,
  EventDetails,
  EventsListRequestBody,
  FileDetails,
  PolicyDetails,
  SnippetDetails,
} from './events-types'
import { EVENT_TYPES_VALUES } from './events-types'

const is = 'DlpEventListClass'

const userNames = ['John', 'Mike', 'Steve', 'Andy', 'Bill']
const emails = [
  'john@ahem.sw.rim.net',
  'mike@ahem.sw.rim.net',
  'steve@ahem.sw.rim.net',
  'andy@blackhole.sw.rim.net',
  'bill@blackhole.sw.rim.net',
]
const eventTypes = [EVENT_TYPES_VALUES.Browser, EVENT_TYPES_VALUES.Email, EVENT_TYPES_VALUES.RemovableMedia]
const locations = [['ahem.sw.rim.net'], ['ahem.sw.rim.net', 'blackhole.sw.rim.net'], ['blackhole.sw.rim.net']]
const clientNames = ['Mac', 'Dell', 'HP']
const policyGuids = [['111-222-333-444'], ['111-222-333-444', '555-666-777-888'], ['999-888-777-666']]
// use the same id as in libs/data/platform/src/users/common/users-mock.ts
const userIds = ['d38cba4ec9054785988bbacc56b5587e', 'a327fca35c3541fabb4a05932c86aced', '3c4afecf66f04cdcb1b4f2574ef53b45']

export const EventItem = (eventUUID: string): EventBase => ({
  eventUUID: eventUUID,
  eventType: eventTypes[Math.floor(Math.random() * 3)],
  userName: userNames[Math.floor(Math.random() * 5)],
  userId: userIds[Math.floor(Math.random() * 3)],
  clientName: clientNames[Math.floor(Math.random() * 3)],
  violationTime: 1632128156000,
  locations: locations[Math.floor(Math.random() * 3)],
  policyGuids: policyGuids[Math.floor(Math.random() * 3)],
  fileCount: Math.floor(Math.random() * 5),
  policyCount: Math.floor(Math.random() * 5),
  dataEntityCount: Math.floor(Math.random() * 5),
})

const uuid_1 = '111-222-333-444'

export const mockedDlpEventsByEventUuId: EventBase[] = [
  EventItem('111-222-333-444'),
  EventItem('222-333-444-555'),
  EventItem('333-444-555-666'),
  EventItem('444-555-666-777'),
]

const setFileDetails = (
  dataEntityDetails?: DataEntityDetails[],
  fileHash?: string,
  fileName?: string,
  fileSize?: number,
  fileType?: string,
): FileDetails => {
  return {
    dataEntityDetails: [setDataEntityDetails()],
    fileHash: '11-22-33-44-55-66',
    fileName: 'report.pdf',
    fileSize: 4096,
    fileType: '.pdf',
  }
}

const setPolicyDetails = (policyGuid: string, policyName: string): PolicyDetails => {
  return { policyGuid, policyName }
}

const setSnippetDetails = (evidenceStart: number, evidenceLength: number, content: string): SnippetDetails => {
  return { evidenceStart, evidenceLength, content }
}

const setDataEntityDetails = (): DataEntityDetails => ({
  dataEntityGuid: '11-22-33-44-55-66',
  dataEntityName: 'Credit Card Number',
  numberOfOccurrence: 1,
  // snippetDetails: [setSnippetDetails(10, 5, 'Birth')],
  snippetDetails: [],
})

const mockedEventDetailsView = mockedDlpEventsByEventUuId.map(event => {
  return {
    ...event,
    userEmail: emails.find(email => email.includes(event.userName.toLowerCase())),
    userTitle: '',
    userDepartment: '',
    clientId: `clientId-${event.eventUUID}`,
    fileDetails: [setFileDetails()],
    policyDetails: event.policyGuids.map(policy_guid => setPolicyDetails(policy_guid, `${event.userName} Policy`)),
  }
})

export const DlpEventListResponse = (params?: PageableSortableEventsQueryParams<EventBase>): PagableResponse<EventBase> => ({
  totals: {
    pages: 1,
    elements: mockedDlpEventsByEventUuId.length,
  },
  navigation: {
    next: 'next',
    previous: 'prev',
  },
  count: mockedDlpEventsByEventUuId.length,
  elements: params ? mockedDlpEventsByEventUuId.slice(0, params?.limit) : mockedDlpEventsByEventUuId,
})

class DlpEventsMockClass implements DlpEventsInterface {
  read(eventUUID: string): Response<EventDetails | Partial<EventDetails>> {
    return Promise.resolve({ data: mockedEventDetailsView.find(i => i.eventUUID === eventUUID) })
  }

  readAll(
    eventsListRequestBody?: EventsListRequestBody,
    params?: PageableSortableEventsQueryParams<EventBase>,
  ): Response<PagableResponse<EventBase> | Partial<PagableResponse<EventBase>>> {
    console.log(`${is}: readAll():  ${JSON.stringify(DlpEventListResponse(params))}`)

    return Promise.resolve({ data: DlpEventListResponse(params) })
  }
}

const DlpEventsMockApi = new DlpEventsMockClass()

export { DlpEventsMockApi }
