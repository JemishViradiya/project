//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

/* eslint-disable prefer-rest-params */
/* eslint-disable sonarjs/no-duplicate-string */

import type { Response } from '@ues-data/shared'

import type ScheduledReportsInterface from './scheduledreports-interface'
import type { ScheduledReport } from './scheduledreports-types'
import { Recurrence, ReportType } from './scheduledreports-types'

const is = 'ScheduledReportsClass'

const scheduledReportsMock: ScheduledReport[] = [
  {
    guid: 'a437a1ae-f1cb-479e-b900-d49bc1f340f5',
    name: 'Email Report 1',
    enabled: true,
    rawDataAttached: true,
    recurrence: Recurrence.DAILY,
    reportType: ReportType.SCREENSHOT_PDF,
    reportParams: {
      dashboardId: 'some-random',
    },
    details: {
      from: 'myself@blackhole.sw.rim.net',
      subject: 'My Email Report',
      body: 'This is an email message',
      recipients: ['user@my-organization.com'],
      bcc: true,
    },
  },
  {
    guid: 'b437a1ae-f1cb-479e-b900-d49bc1f340f5',
    name: 'Email Report 2',
    enabled: true,
    rawDataAttached: true,
    recurrence: Recurrence.WEEKLY,
    reportType: ReportType.SCREENSHOT_PDF,
    reportParams: {
      dashboardId: 'some-random',
    },
    details: {
      from: 'myself@blackhole.sw.rim.net',
      subject: 'My Email Report',
      body: 'This is an email message',
      recipients: ['user@my-organization.com'],
      bcc: true,
    },
  },
  {
    guid: 'c437a1ae-f1cb-479e-b900-d49bc1f340f5',
    name: 'Email Report 3',
    enabled: true,
    rawDataAttached: true,
    recurrence: Recurrence.MONTHLY,
    reportType: ReportType.SCREENSHOT_PDF,
    reportParams: {
      dashboardId: 'some-random',
    },
    details: {
      from: 'myself@blackhole.sw.rim.net',
      subject: 'My Email Report',
      body: 'This is an email message',
      recipients: ['user@my-organization.com'],
      bcc: true,
    },
  },
]

class ScheduledReportsClass implements ScheduledReportsInterface {
  create(tenantId: string, _data: ScheduledReport): Response<ScheduledReport> {
    console.log(`${is}: create(${[...arguments]})`)

    return Promise.resolve({ data: { ..._data } })
  }
  get(tenantId: string, guid: string): Response<ScheduledReport> {
    console.log(`${is}: get(${[...arguments]})`)

    const result = scheduledReportsMock.find(scheduledreport => scheduledreport.guid === guid)

    return Promise.resolve({ data: result })
  }
  getAll(tenantId: string): Response<ScheduledReport[]> {
    console.log(`${is}: getAll(${[...arguments]})`)

    const result = scheduledReportsMock

    return Promise.resolve({ data: result })
  }
  update(tenantId: string, guid: string, _data: ScheduledReport): Response<ScheduledReport> {
    console.log(`${is}: update(${[...arguments]})`)

    return Promise.resolve({ data: { ..._data } })
  }
  remove(tenantId: string, guid: string): Promise<void> {
    console.log(`${is}: remove(${[...arguments]})`)

    return Promise.resolve()
  }
}

const ScheduledReportsMock = new ScheduledReportsClass()

export { ScheduledReportsMock }
