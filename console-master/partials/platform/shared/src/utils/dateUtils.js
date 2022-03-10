/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

const oneHourInMs = 60 * 60 * 1000

export function subtractHours(date, hours) {
  const newDate = new Date()
  newDate.setTime(date.getTime() - hours * oneHourInMs)
  return newDate
}

export function hours(hours) {
  return () => {
    const now = new Date()
    return { startDate: subtractHours(now, hours), endDate: now }
  }
}

export function days(days) {
  return () => {
    const now = new Date()
    return { startDate: subtractHours(now, days * 24), endDate: now }
  }
}

export function today() {
  return () => {
    const now = new Date()

    const dayStart = new Date()
    dayStart.setHours(0, 0, 0, 0)

    return { startDate: dayStart, endDate: now }
  }
}

export function yesterday() {
  return () => {
    const startOfThisDay = new Date()
    startOfThisDay.setHours(0, 0, 0, 0)

    return {
      startDate: subtractHours(startOfThisDay, 24),
      endDate: startOfThisDay,
    }
  }
}

export function thisWeek() {
  return () => {
    const now = new Date()

    const startOfThisWeek = new Date()
    startOfThisWeek.setHours(0, 0, 0, 0)
    const day = startOfThisWeek.getDay() - 1
    startOfThisWeek.setTime(startOfThisWeek.getTime() - day * 24 * oneHourInMs)

    return { startDate: startOfThisWeek, endDate: now }
  }
}

export function prevWeek() {
  return () => {
    const startOfThisWeek = new Date()
    startOfThisWeek.setHours(0, 0, 0, 0)
    const day = startOfThisWeek.getDay() - 1
    startOfThisWeek.setTime(startOfThisWeek.getTime() - day * 24 * oneHourInMs)

    const startOfPreviousWeek = new Date(startOfThisWeek)
    startOfPreviousWeek.setTime(startOfPreviousWeek.getTime() - 7 * 24 * oneHourInMs)

    return { startDate: startOfPreviousWeek, endDate: startOfThisWeek }
  }
}

export function thisMonth() {
  return () => {
    const now = new Date()

    const startOfThisMonth = new Date()
    startOfThisMonth.setHours(0, 0, 0, 0)
    startOfThisMonth.setDate(1)

    return { startDate: startOfThisMonth, endDate: now }
  }
}

export function prevMonth(month) {
  return () => {
    const startOfThisMonth = new Date()
    startOfThisMonth.setHours(0, 0, 0, 0)
    startOfThisMonth.setDate(1)

    const startOfPrevMonth = new Date(startOfThisMonth.getFullYear(), startOfThisMonth.getMonth() - month, 1)

    return { startDate: startOfPrevMonth, endDate: startOfThisMonth }
  }
}

export function prevDateOfEqualPeriod(timeInterval) {
  const intervalInMs = timeInterval.endDate.getTime() - timeInterval.startDate.getTime()
  return new Date(timeInterval.startDate.getTime() - intervalInMs)
}

export const getNonLocalizedDate = dateString => {
  const dateObject = new Date(dateString)
  const date = dateObject.toLocaleDateString()
  const time = dateObject.toLocaleTimeString()
  const timezone = dateObject.getTimezoneOffset() / 60

  const timezoneWithSign = timezone < 0 ? timezone : `+${timezone}`
  return `${date} ${time} (${timezoneWithSign} GMT)`
}
