import type { AsyncQuery } from '@ues-data/shared'

import { ReadDevicesPermissions, ReadEventsPermissions } from '../network'
import type { Response } from '../types'
import { Threats, ThreatsMock } from './threats'
import type {
  EnabledDeviceCount,
  MobileThreatDeviceDetail,
  MobileThreatEventCount,
  MobileThreatEventDetail,
  MobileThreatEventQuery,
  MobileThreatEventQueryData,
  MobileThreatEventQueryEntry,
  MobileThreatEventSeries,
  MobileThreatEventSeriesEntry,
} from './threats-types'
import { GROUPBY_HOURS } from './threats-types'

const MILLS_IN_HOUR = 3600000

interface MobileThreatEventSeriesNumericEntry {
  count: number
  startDateTime: number
}

export const querytMobileEventCounts: AsyncQuery<Response<MobileThreatEventCount[]>, MobileThreatEventQueryData> = {
  query: Threats.getMobileEventCounts,
  mockQueryFn: ThreatsMock.getMobileEventCounts,
  permissions: ReadEventsPermissions,
}

function addjustStart(groupByTime: number, requestStart: string, seriesStart: string): Date {
  const addjustedStartDate = new Date(seriesStart)
  const requestStartDate = new Date(requestStart)
  while (addjustedStartDate.getTime() > requestStartDate.getTime()) {
    addjustedStartDate.setTime(addjustedStartDate.getTime() - groupByTime * MILLS_IN_HOUR)
  }
  return addjustedStartDate
}

function createEmptySeries(groupByTime: number, addjustedStart: Date, requestEnd: Date) {
  const series: MobileThreatEventSeriesNumericEntry[] = []
  for (
    const timestamp = new Date(addjustedStart);
    timestamp.getTime() <= requestEnd.getTime();
    timestamp.setTime(timestamp.getTime() + groupByTime * MILLS_IN_HOUR)
  ) {
    series.push({ count: 0, startDateTime: timestamp.getTime() })
  }
  return series
}

function stringDataToTime(seriesData: MobileThreatEventSeriesEntry[]): MobileThreatEventSeriesNumericEntry[] {
  return seriesData.map(entry => ({
    count: entry.count,
    startDateTime: new Date(entry.startDateTime).getTime(),
  }))
}

function timeDateToString(seriesData: MobileThreatEventSeriesNumericEntry[]): MobileThreatEventSeriesEntry[] {
  return seriesData.map(entry => ({
    count: entry.count,
    startDateTime: new Date(entry.startDateTime).toISOString(),
  }))
}

function addjustSeries(groupByTime: number, addjustedStart: Date, requestEnd: Date, seriesData: MobileThreatEventSeriesEntry[]) {
  const addjustedSeries = createEmptySeries(groupByTime, addjustedStart, requestEnd)
  const convertedSeriesData = stringDataToTime(seriesData)
  for (let idx = 0; idx < addjustedSeries.length; idx++) {
    const resultData = convertedSeriesData.find(entry => entry.startDateTime === addjustedSeries[idx].startDateTime)
    if (resultData) {
      addjustedSeries[idx].count = resultData.count
    }
  }
  return timeDateToString(addjustedSeries)
}

function fillEmptySeriesBuckets(
  query: MobileThreatEventQuery,
  seriesData: MobileThreatEventSeriesEntry[],
): MobileThreatEventSeriesEntry[] {
  const groupByTimeHours = GROUPBY_HOURS(query.groupByTime)
  const addjustedStart =
    seriesData.length > 0
      ? addjustStart(groupByTimeHours, query.startDateTime, seriesData[0].startDateTime)
      : new Date(query.startDateTime)
  return addjustSeries(groupByTimeHours, addjustedStart, new Date(query.endDateTime), seriesData)
}

function fillEmptyBuckets(request: MobileThreatEventQueryData, threatData: MobileThreatEventSeries[]): MobileThreatEventSeries[] {
  const filledData: MobileThreatEventSeries[] = []
  for (const query of request.queries) {
    const queryResult = threatData.find(item => item.queryId === query.queryId)
    const filledSeries = fillEmptySeriesBuckets(query, queryResult.series)
    filledData.push({ queryId: query.queryId, series: filledSeries })
  }

  return filledData
}

const fetchMobileEventSeries = api => async (request: MobileThreatEventQueryData) => {
  const threatData = await api.getMobileEventSeries({
    queries: request.queries,
    limit: request.limit,
  })
  return fillEmptyBuckets(request, threatData.data)
}

export const queryMobileEventSeries: AsyncQuery<MobileThreatEventSeries[], MobileThreatEventQueryData> = {
  query: fetchMobileEventSeries(Threats),
  mockQueryFn: fetchMobileEventSeries(ThreatsMock),
  permissions: ReadEventsPermissions,
}

export const queryTopMobileThreats: AsyncQuery<Response<MobileThreatEventDetail[]>, MobileThreatEventQueryEntry> = {
  query: Threats.getTopMobileThreats,
  mockQueryFn: ThreatsMock.getTopMobileThreats,
  permissions: ReadEventsPermissions,
}

export const queryMobileDevicesWithThreats: AsyncQuery<Response<MobileThreatEventCount[]>, MobileThreatEventQueryData> = {
  query: Threats.getMobileDevicesWithThreats,
  mockQueryFn: ThreatsMock.getMobileDevicesWithThreats,
  permissions: ReadEventsPermissions,
}

export const queryTopMobileDeviceThreats: AsyncQuery<Response<MobileThreatDeviceDetail[]>, MobileThreatEventQueryEntry> = {
  query: Threats.getTopMobileDevicesWithThreats,
  mockQueryFn: ThreatsMock.getTopMobileDevicesWithThreats,
  permissions: ReadEventsPermissions,
}

const fetchEnabledDeviceCounts = api => async () => {
  const mtdData = await api.getEndpointCounts()
  const ecsData = await api.getEcsDeviceCount()
  return { mtdDeviceCount: mtdData.data.deviceCount, ecsDeviceCount: ecsData.data.totals.elements }
}

export const queryEnabledDeviceCounts: AsyncQuery<EnabledDeviceCount, void> = {
  query: fetchEnabledDeviceCounts(Threats),
  mockQueryFn: fetchEnabledDeviceCounts(ThreatsMock),
  permissions: ReadDevicesPermissions,
}
