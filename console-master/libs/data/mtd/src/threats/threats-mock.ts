//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

/* eslint-disable prefer-rest-params */

import type { Response } from '../types'
import type ThreatsInterface from './threats-interface'
import type {
  EcsEntityResponse,
  EndpointCounts,
  MobileThreatDeviceDetail,
  MobileThreatEventCount,
  MobileThreatEventDetail,
  MobileThreatEventQueryData,
  MobileThreatEventQueryEntry,
  MobileThreatEventSeries,
  MobileThreatEventSeriesEntry,
} from './threats-types'
import { GROUPBY_HOURS } from './threats-types'

const is = 'ThreatsClass'

function countMockGenerator(request: MobileThreatEventQueryData): MobileThreatEventCount[] {
  const countMock: MobileThreatEventCount[] = []
  request.queries.forEach(r =>
    countMock.push({
      queryId: r.queryId,
      count: getRandomInt(50),
    }),
  )
  return countMock
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max))
}

function getCountValue(groupByTime: number, max = 50): number {
  return getRandomInt(max) * groupByTime
}

function getSeries(startDateTime: string, endDateTime: string, groupByTime: number): MobileThreatEventSeriesEntry[] {
  const startFrom = new Date(startDateTime)
  const endTo = new Date(endDateTime)
  const series = []
  const timeStamp = startFrom
  while (timeStamp < endTo) {
    series.push({ count: getCountValue(groupByTime), startDateTime: timeStamp.toISOString(), endDateTime: timeStamp })
    timeStamp.setHours(timeStamp.getHours() + groupByTime)
  }
  return series
}

function seriesDataMockGenerator(request: MobileThreatEventQueryData): MobileThreatEventSeries[] {
  const seriesData: MobileThreatEventSeries[] = []
  for (const requestEntry of request.queries) {
    seriesData.push({
      queryId: requestEntry.queryId,
      series: getSeries(requestEntry.startDateTime, requestEntry.endDateTime, GROUPBY_HOURS(requestEntry.groupByTime)),
      cursor: null,
    })
  }
  return seriesData
}

function detailsDataMockGenerator(request: MobileThreatEventQueryEntry): MobileThreatEventDetail[] {
  const details: MobileThreatEventDetail[] = []
  for (let idx = 0; idx < request.limit; idx++) {
    details.push({ eventDetail: 'Detail-' + idx, count: getRandomInt(50) })
  }
  return details
}

function deviceDetailsDataMockGenerator(request: MobileThreatEventQueryEntry): MobileThreatDeviceDetail[] {
  const details: MobileThreatDeviceDetail[] = []
  for (let idx = 0; idx < request.limit; idx++) {
    details.push({
      deviceId: 'deviceId-' + idx,
      userDisplayName: 'User-' + idx,
      count: getRandomInt(50),
      deviceModelName: 'Device-' + idx,
      endpointIds: ['endpointId-1-' + idx, 'endpointId-2-' + idx],
    })
  }
  return details
}

const endpointCountsMock: EndpointCounts = {
  endpointCount: 550,
  deviceCount: 500,
}
const ecsCountMock: EcsEntityResponse = {
  totals: {
    elements: 714,
  },
}

class ThreatsClass implements ThreatsInterface {
  getMobileEventCounts(request: MobileThreatEventQueryData): Promise<Response<MobileThreatEventCount[]>> {
    console.log(`${is}: getMobileEventCounts(${[...arguments]})`)

    return Promise.resolve({ data: countMockGenerator(request) })
  }

  getMobileEventSeries(request: MobileThreatEventQueryData): Promise<Response<MobileThreatEventSeries[]>> {
    console.log(`${is}: getMobileEventSeries(${[...arguments]})`)

    return Promise.resolve({ data: seriesDataMockGenerator(request) })
  }

  getTopMobileThreats(request: MobileThreatEventQueryEntry): Promise<Response<MobileThreatEventDetail[]>> {
    console.log(`${is}: getTopThreatsList(${[...arguments]})`)

    return Promise.resolve({ data: detailsDataMockGenerator(request) })
  }

  getMobileDevicesWithThreats(request: MobileThreatEventQueryData): Promise<Response<MobileThreatEventCount[]>> {
    console.log(`${is}: getMobileDevicesWithThreats(${[...arguments]})`)
    return Promise.resolve({ data: countMockGenerator(request) })
  }

  getTopMobileDevicesWithThreats(request: MobileThreatEventQueryEntry): Promise<Response<MobileThreatDeviceDetail[]>> {
    console.log(`${is}: getTopMobileDevicesWithThreats(${[...arguments]})`)

    return Promise.resolve({ data: deviceDetailsDataMockGenerator(request) })
  }

  getEndpointCounts(): Promise<Response<EndpointCounts>> {
    console.log(`${is}: getEndpointCounts(${[...arguments]})`)

    return Promise.resolve({ data: endpointCountsMock })
  }

  getEcsDeviceCount(): Promise<Response<EcsEntityResponse>> {
    console.log(`${is}: getEcsDeviceCount(${[...arguments]})`)

    return Promise.resolve({ data: ecsCountMock })
  }
}

const ThreatsMock = new ThreatsClass()

export { ThreatsMock }
