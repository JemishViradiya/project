import type { DirectoryInstanceSyncSchedule, NESTING_LEVEL_KEY, SYNC_LEVEL_KEY } from '@ues-data/platform'

export interface Error {
  isError: boolean
  message?: string
}

export interface Errors {
  [SYNC_LEVEL_KEY]?: Error
  [NESTING_LEVEL_KEY]?: Error
}

export interface ExtendedSyncSchedule extends DirectoryInstanceSyncSchedule {
  selectedDays?: string[]
  selectedDay?: string
  id?: number
  new?: boolean
  callbackFreq?: number
  startTimeOfDayDate?: Date
  endTimeOfDayDate?: Date
}

export interface DirectorySyncSettings {
  syncForce: boolean
  syncEnableOffboarding: boolean
  syncMaxNesting: number
  syncEnableOnboarding: boolean
  syncMaxChanges: number
  syncEnableOffboardingProtection: boolean
}
