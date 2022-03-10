/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { DashboardTime } from '@ues-data/dashboard'
import { DEFAULT_TIME_INTERVAL, Month as month, TimeIntervalId } from '@ues-data/dashboard'

export { month, TimeIntervalId, DEFAULT_TIME_INTERVAL }

const oneHourInMs = 60 * 60 * 1000

// value stores function that returns {startDate: ..., endDate: ...}
// depending on chosen time period and current time
export type TimeIntervalDateRangeString = {
  startDate: string
  endDate: string
}

export type TimeIntervalDate = {
  startDate: Date
  endDate: Date
}

export const getTimeIntervals1 = nowTime => {
  return {
    [TimeIntervalId.Last24Hours]: hours(24, nowTime),
    [TimeIntervalId.Last2Days]: days(2, nowTime),
    [TimeIntervalId.Last7Days]: days(7, nowTime),
    [TimeIntervalId.Last30Days]: days(30, nowTime),
    [TimeIntervalId.Last60Days]: days(60, nowTime),
    [TimeIntervalId.Last90Days]: days(90, nowTime),
    [TimeIntervalId.Last120Days]: days(120, nowTime),
  }
}

export const getTimeIntervals2 = nowTime => {
  return {
    [TimeIntervalId.Today]: today(nowTime),
    [TimeIntervalId.Yesterday]: yesterday(nowTime),
    [TimeIntervalId.ThisWeek]: thisWeek(nowTime),
    [TimeIntervalId.LastWeek]: prevWeek(nowTime),
    [TimeIntervalId.ThisMonth]: thisMonth(nowTime),
    [TimeIntervalId.LastMonth]: prevMonth(1, nowTime),
    [TimeIntervalId.Last2Months]: prevMonth(2, nowTime),
    [TimeIntervalId.Last3Months]: prevMonth(3, nowTime),
  }
}

const timeIntervalSelection = nowTime => {
  return {
    ...getTimeIntervals1(nowTime),
    ...getTimeIntervals2(nowTime),
  }
}

export const defaultTimeInterval = DEFAULT_TIME_INTERVAL

export function getDateRangeISOString(dasboardTime: DashboardTime): TimeIntervalDateRangeString {
  const timeIntervalId = dasboardTime.timeInterval
  const timeInterval = timeIntervalSelection(dasboardTime.nowTime)[timeIntervalId]()
  return {
    startDate: timeInterval.startDate.toISOString(),
    endDate: timeInterval.endDate.toISOString(),
  }
}

export function getDateRangeTimestampString(dasboardTime: DashboardTime): TimeIntervalDateRangeString {
  const timeIntervalId = dasboardTime.timeInterval
  const timeInterval = timeIntervalSelection(dasboardTime.nowTime)[timeIntervalId]()
  return {
    startDate: timeInterval.startDate.valueOf().toString(),
    endDate: timeInterval.endDate.valueOf().toString(),
  }
}

export function getDateRange(dasboardTime: DashboardTime): TimeIntervalDate {
  const timeIntervalId = dasboardTime.timeInterval
  return timeIntervalSelection(dasboardTime.nowTime)[timeIntervalId]()
}

export function subtractHours(date: Date, hours: number): Date {
  const newDate = new Date()
  newDate.setTime(date.getTime() - hours * oneHourInMs)
  return newDate
}

function hours(hours: number, nowTime: Date) {
  return () => {
    return { startDate: subtractHours(nowTime, hours), endDate: nowTime }
  }
}

function days(days: number, nowTime: Date) {
  return () => {
    return { startDate: subtractHours(nowTime, days * 24), endDate: nowTime }
  }
}

function today(nowTime: Date) {
  return () => {
    const dayStart = new Date(nowTime.getTime())
    dayStart.setHours(0, 0, 0, 0)

    return { startDate: dayStart, endDate: nowTime }
  }
}

function yesterday(nowTime: Date) {
  return () => {
    const startOfThisDay = new Date(nowTime.getTime())
    startOfThisDay.setHours(0, 0, 0, 0)

    return {
      startDate: subtractHours(startOfThisDay, 24),
      endDate: startOfThisDay,
    }
  }
}

function thisWeek(nowTime: Date) {
  return () => {
    const startOfThisWeek = new Date(nowTime.getTime())
    startOfThisWeek.setHours(0, 0, 0, 0)
    const day = startOfThisWeek.getDay() - 1
    startOfThisWeek.setTime(startOfThisWeek.getTime() - day * 24 * oneHourInMs)

    return { startDate: startOfThisWeek, endDate: nowTime }
  }
}

function prevWeek(nowTime: Date) {
  return () => {
    const startOfThisWeek = new Date(nowTime.getTime())
    startOfThisWeek.setHours(0, 0, 0, 0)
    const day = startOfThisWeek.getDay() - 1
    startOfThisWeek.setTime(startOfThisWeek.getTime() - day * 24 * oneHourInMs)

    const startOfPreviousWeek = new Date(startOfThisWeek)
    startOfPreviousWeek.setTime(startOfPreviousWeek.getTime() - 7 * 24 * oneHourInMs)

    return { startDate: startOfPreviousWeek, endDate: startOfThisWeek }
  }
}

function thisMonth(nowTime: Date) {
  return () => {
    const startOfThisMonth = new Date(nowTime.getTime())
    startOfThisMonth.setHours(0, 0, 0, 0)
    startOfThisMonth.setDate(1)

    return { startDate: startOfThisMonth, endDate: nowTime }
  }
}

function prevMonth(month: number, nowTime: Date) {
  return () => {
    const startOfThisMonth = new Date(nowTime.getTime())
    startOfThisMonth.setHours(0, 0, 0, 0)
    startOfThisMonth.setDate(1)

    const startOfPrevMonth = new Date(startOfThisMonth.getFullYear(), startOfThisMonth.getMonth() - month, 1)

    return { startDate: startOfPrevMonth, endDate: startOfThisMonth }
  }
}

export function prevDateOfEqualPeriod(timeInterval: TimeIntervalDate): Date {
  const intervalInMs = timeInterval.endDate.getTime() - timeInterval.startDate.getTime()
  return new Date(timeInterval.startDate.getTime() - intervalInMs)
}
