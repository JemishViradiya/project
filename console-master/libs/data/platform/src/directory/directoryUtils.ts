/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { AxiosError } from 'axios'

import type { DirectoryInstance, DirectoryInstanceSyncSchedule } from './directory-types'

export const FORCE_SYNC_KEY = 'syncForce'
export const ENABLE_ONBOARDING_KEY = 'syncEnableOnboarding'
export const SYNC_LEVEL_KEY = 'syncMaxChanges'
export const NESTING_LEVEL_KEY = 'syncMaxNesting'
export const ENABLE_OFFBOARDING_KEY = 'syncEnableOffboarding'
export const OFFBOARDING_PROTECTION_KEY = 'syncEnableOffboardingProtection'
export const ONLINE_STATUS_KEY = 'instanceOnlineStatus'
export const AZURE_DIRECTORY_KEY = 'azureDirectory'
export const DIRECTORY_TYPE_KEY = 'type'
export const AZURE_DIRECTORY_CLIENT_ID_KEY = 'azureDirectoryClientId'
export const AZURE_DIRECTORY_CLIENT_KEY_KEY = 'azureDirectoryClientKey'
export const AZURE_DIRECTORY_DOMAIN_KEY = 'azureDirectoryDomain'

export const SELECT = 'SELECT'
export const USERS_AND_GROUPS = 'USERS_AND_GROUPS'
export const GROUPS_ONBOARDING = 'GROUPS_ONBOARDING'
export const GROUPS_DLG = 'GROUPS_DLG'
export const USER_ATTRIBUTES = 'USER_ATTRIBUTES'
export const INTERVAL = 'INTERVAL'
export const DAILY = 'DAILY'
export const ONCE = 'ONCE'

export const WEEK_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

export const syncTypes = {
  USERS_AND_GROUPS: 'directory.syncSchedule.syncGroups.all',
  GROUPS_ONBOARDING: 'directory.syncSchedule.syncGroups.onboarding',
  GROUPS_DLG: 'directory.syncSchedule.syncGroups.linked',
  USER_ATTRIBUTES: 'directory.syncSchedule.syncGroups.userAttributes',
}

export const intervals = {
  INTERVAL: 'directory.syncSchedule.interval.interval',
  DAILY: 'directory.syncSchedule.interval.onceADay',
  ONCE: 'directory.syncSchedule.interval.noRecurrence',
}

export const syncSettingsMap = {
  [ENABLE_ONBOARDING_KEY]: {
    label: 'directory.syncSettings.onboarding',
    helpText: '',
    default: false,
  },
  [FORCE_SYNC_KEY]: {
    label: 'directory.syncSettings.forceSync',
    helpText: '',
    default: false,
  },
  [NESTING_LEVEL_KEY]: {
    label: 'directory.syncSettings.nestingLevel',
    helpText: 'directory.syncSettings.nestingLevelDescription',
    default: -1,
  },
  [SYNC_LEVEL_KEY]: {
    label: 'directory.syncSettings.limit',
    helpText: 'directory.syncSettings.limitDescription',
    default: 0,
  },
  [ENABLE_OFFBOARDING_KEY]: {
    label: 'directory.syncSettings.offboarding',
    helpText: '',
    default: false,
  },
  [OFFBOARDING_PROTECTION_KEY]: {
    label: 'directory.syncSettings.offboardingProtection',
    helpText: '',
    default: false,
  },
}

const getSelectedDays = days => {
  let i = 0
  const selectedDays: any = {}
  for (i = 0; i < WEEK_DAYS.length; i++) {
    switch (WEEK_DAYS[i]) {
      case 'monday':
        selectedDays.runOnMonday = days.filter(d => d === 'monday').length === 1
        break
      case 'tuesday':
        selectedDays.runOnTuesday = days.filter(d => d === 'tuesday').length === 1
        break
      case 'wednesday':
        selectedDays.runOnWednesday = days.filter(d => d === 'wednesday').length === 1
        break
      case 'thursday':
        selectedDays.runOnThursday = days.filter(d => d === 'thursday').length === 1
        break
      case 'friday':
        selectedDays.runOnFriday = days.filter(d => d === 'friday').length === 1
        break
      case 'saturday':
        selectedDays.runOnSaturday = days.filter(d => d === 'saturday').length === 1
        break
      case 'sunday':
        selectedDays.runOnSunday = days.filter(d => d === 'sunday').length === 1
        break
    }
  }
  return selectedDays
}

const convertTimeForRest = value => {
  const dt = new Date(value)
  return dt.getHours() * 60 + value.getMinutes()
}

function convertTimeFromRest(minutes) {
  const dt = new Date()
  dt.setHours(Math.floor(minutes / 60))
  dt.setMinutes(minutes % 60)
  dt.setSeconds(0)
  dt.setMilliseconds(0)
  return dt
}

// Convert data received from REST
export const convertDirectoryFromRest = (connection: DirectoryInstance) => ({
  ...connection,
  id: connection.id,
  id_tenant: connection.id_tenant,
  directory_group: connection.directory_group,
  directorySyncSchedules: connection.directorySyncSchedules.map((s: DirectoryInstanceSyncSchedule) => convertScheduleFromRest(s)),
  syncStatus: { updated: false },
})

export const mapData = connections => {
  return connections.map(convertDirectoryFromRest)
}

// Prepare schedule for REST API
export const convertForRest = value => {
  let selectedDays
  const startTimeOfDay = convertTimeForRest(value.startTimeOfDay)
  let endTimeOfDay

  if (value.iterations === ONCE) {
    selectedDays = getSelectedDays([value.selectedDay])
  } else {
    selectedDays = getSelectedDays(value.selectedDays)
    if (value.iterations === INTERVAL) endTimeOfDay = convertTimeForRest(value.endTimeOfDay)
  }

  const result = {
    iterations: '' + value.iterations.toLowerCase(),
    type: value.type,
    callbackFreq: value.callbackFreq,
    startTimeOfDay: startTimeOfDay,
    endTimeOfDay: endTimeOfDay,
    ...selectedDays,
  }

  if (!value.new) {
    result.schedulerId = value.schedulerId
  }
  return result
}

export const convertScheduleFromRest = (value: DirectoryInstanceSyncSchedule & { id?: string }) => {
  const schedule: any = {
    id: value.id ? value.schedulerId : new Date(),
    schedulerId: value.schedulerId,
    callbackFreq: value.callbackFreq,
    type: value.type,
    iterations: value.iterations.toUpperCase(),
    status: value.status,
    startTimeOfDay: convertTimeFromRest(value.startTimeOfDay),
    endTimeOfDay: convertTimeFromRest(value.endTimeOfDay),
    new: false,
  }
  if (schedule.iterations === ONCE) {
    schedule.selectedDay = convertDaysFromRest(value)[0]
  } else {
    schedule.selectedDays = convertDaysFromRest(value)
  }
  return schedule
}

const convertDaysFromRest = value => {
  const days = []
  if (value.runOnMonday) days.push('monday')
  if (value.runOnTuesday) days.push('tuesday')
  if (value.runOnWednesday) days.push('wednesday')
  if (value.runOnThursday) days.push('thursday')
  if (value.runOnFriday) days.push('friday')
  if (value.runOnSaturday) days.push('saturday')
  if (value.runOnSunday) days.push('sunday')
  return days
}

export const isEqualIntervalType = (iterations, schedule1, schedule2) => {
  if (iterations === INTERVAL) {
    return (
      schedule1.callbackFreq === schedule2.callbackFreq &&
      areSelectedDaysEqual(schedule1.selectedDays, schedule2.selectedDays) &&
      areTimeRangesEqual(
        { from: schedule1.startTimeOfDay, to: schedule1.endTimeOfDay },
        { from: schedule2.startTimeOfDay, to: schedule2.endTimeOfDay },
      )
    )
  } else if (iterations === ONCE) {
    return schedule1.selectedDay === schedule2.selectedDay && isTimeEqual(schedule1.startTimeOfDay, schedule2.startTimeOfDay)
  }
  return (
    areSelectedDaysEqual(schedule1.selectedDays, schedule2.selectedDays) &&
    isTimeEqual(schedule1.startTimeOfDay, schedule2.startTimeOfDay)
  )
}

const areSelectedDaysEqual = (selectedDays1, selectedDays2) => {
  if (selectedDays1.length === selectedDays2.length) {
    const sameDaysCount = selectedDays1.reduce((sameDays, x) => {
      sameDays += selectedDays2.filter(d => d === x).length
      return sameDays
    }, 0)
    if (sameDaysCount === selectedDays1.length) return true
  }
  return false
}

const isTimeEqual = (date1, date2) => {
  return date1.getHours() === date2.getHours() && date1.getMinutes() === date2.getMinutes()
}

const areTimeRangesEqual = (timeRange1, timeRange2) => {
  return isTimeEqual(timeRange1.from, timeRange2.from) && isTimeEqual(timeRange1.to, timeRange2.to)
}

export const directoryNotFound = (error: AxiosError): boolean => {
  const notFoundSubStatusCode = 110

  return error.response.data.subStatusCode === notFoundSubStatusCode
}
