import type { ExfiltrationTypeEventsChartQueryParams } from '../dashboard/types'
import type { ExfiltrationTypeEvent, ExfiltrtationTypeEventsResponse } from './dashboard-types'

function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max))
}

function getCountValue(groupByTime: number, max = 50): number {
  return getRandomInt(max) * groupByTime
}

function getSeries(startTime: number, stopTime: number, groupByTime: number): ExfiltrationTypeEvent[] {
  const startFrom = new Date(startTime)
  const endTo = new Date(stopTime)
  const data = []
  const timeStamp = startFrom
  while (timeStamp < endTo) {
    data.push({ count: getCountValue(groupByTime), key: timeStamp.getTime() })
    timeStamp.setHours(timeStamp.getHours() + groupByTime)
  }
  return data
}

export function seriesDataMockGenerator(request: ExfiltrationTypeEventsChartQueryParams): ExfiltrtationTypeEventsResponse {
  return {
    view: {
      EMAIL: getSeries(request.startTime, request.stopTime, Number(request.interval)),
      BROWSER: getSeries(request.startTime, request.stopTime, Number(request.interval)),
      REMOVABLE_MEDIA: getSeries(request.startTime, request.stopTime, Number(request.interval)),
    },
  }
}
