/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import moment from 'moment'

import { MobileProtectData } from '@ues-data/mtd'
import { FeaturizationApi } from '@ues-data/shared'
import { FeatureName } from '@ues-data/shared-types'
import { QueryStringParamKeys } from '@ues-mtd/alert-types'
import { OPERATOR_VALUES } from '@ues/behaviours'

import { MobileAlertColumnNames } from '../../types'

export const resolveQuickSearchFilter = rawValue => {
  const { value } = rawValue
  return `${value}`
}

export const resolveIdFilter = rawValue => {
  const { value } = rawValue
  return `${value}`
}

export const resolveCheckboxFilter = rawValue => {
  const { value } = rawValue
  return value
}

export const resolveDatetimeRangeFilter = rawValue => {
  const { minDatetime, maxDatetime } = rawValue
  return { startDateTime: `${minDatetime.toISOString()}`, endDateTime: `${maxDatetime.toISOString()}` }
}

// TODO
// This method is prototype code that needs to be refactored
// to leverage existing datetime filter logic/presentation.
export const addDetected = (defaultFilters, searchParams: URLSearchParams) => {
  if (searchParams.get('detectedStart') && searchParams.get('detectedEnd')) {
    defaultFilters[MobileAlertColumnNames.Detected] = {
      minDatetime: moment(searchParams.get('detectedStart')),
      maxDatetime: moment(searchParams.get('detectedEnd')),
      operator: OPERATOR_VALUES.IS_BETWEEN,
    }
  } else if (searchParams.get('detectedStart')) {
    defaultFilters[MobileAlertColumnNames.Detected] = {
      minDatetime: moment(searchParams.get('detectedStart')),
      operator: OPERATOR_VALUES.AFTER,
    }
  } else if (searchParams.get('detectedEnd')) {
    defaultFilters[MobileAlertColumnNames.Detected] = {
      maxDatetime: moment(searchParams.get('detectedEnd')),
      operator: OPERATOR_VALUES.BEFORE,
    }
  }
}

/**
 * Returns a query param string with all filter params removed
 */
export const cleanUpParams = (searchParams: URLSearchParams): string => {
  for (const key in QueryStringParamKeys) {
    if (searchParams.get(QueryStringParamKeys[key]) !== null && QueryStringParamKeys[key] !== QueryStringParamKeys.GROUP_BY) {
      searchParams.delete(QueryStringParamKeys[key])
    }
  }
  const searchParamsString = searchParams.toString()
  return searchParamsString === '' ? '' : `?${searchParams.toString()}`
}

export const hasParamsToCleanup = (params: URLSearchParams) => {
  for (const key in QueryStringParamKeys) {
    if (params.get(QueryStringParamKeys[key])) {
      return true
    }
  }
  return false
}

export const buildLocationWithQuery = (search: string) => {
  const end = cleanUpParams(new URLSearchParams(search))
  const questionMarkIndex = window.location.href.indexOf('?')
  const locationWithoutQuery = questionMarkIndex !== -1 ? window.location.href.slice(0, questionMarkIndex) : window.location.href
  return end !== '' ? `${locationWithoutQuery}?${end}` : locationWithoutQuery
}

export function formatFilters(useFilters, filters) {
  if (useFilters) {
    const ret = {}
    let resolvedDatetimeRangeFilter = null
    Object.entries(filters).forEach(filterProperty => {
      const key = filterProperty[0]
      const value = filterProperty[1]
      switch (key) {
        case MobileAlertColumnNames.Type:
          ret[QueryStringParamKeys.TYPE] = resolveCheckboxFilter(value)
          break
        case MobileAlertColumnNames.Status:
          ret[QueryStringParamKeys.STATUS] = resolveCheckboxFilter(value)
          break
        case MobileAlertColumnNames.Name:
          ret[QueryStringParamKeys.NAME] = resolveQuickSearchFilter(value)
          break
        case MobileAlertColumnNames.Description:
          ret[QueryStringParamKeys.DESCRIPTION] = resolveQuickSearchFilter(value)
          break
        case MobileAlertColumnNames.DeviceName:
          ret[QueryStringParamKeys.DEVICE_NAME] = resolveQuickSearchFilter(value)
          break
        case MobileAlertColumnNames.UserName:
          ret[QueryStringParamKeys.USER_NAME] = resolveQuickSearchFilter(value)
          break
        case MobileAlertColumnNames.Detected:
          resolvedDatetimeRangeFilter = resolveDatetimeRangeFilter(value)
          ret[QueryStringParamKeys.DETECTED_START] = resolvedDatetimeRangeFilter['startDateTime']
          ret[QueryStringParamKeys.DETECTED_END] = resolvedDatetimeRangeFilter['endDateTime']
          break
      }
    })
    return ret
  } else {
    return {}
  }
}

export const getEventTypeItems = () => {
  const enableUnsafeMessage: boolean = FeaturizationApi.isFeatureEnabled(FeatureName.MobileThreatDetectionUnsafeMsgThreat)
  const enableRestrictedApps: boolean = FeaturizationApi.isFeatureEnabled(FeatureName.MobileThreatDetectionRestrictedAppThreat)
  const enableDeveloperMode: boolean = FeaturizationApi.isFeatureEnabled(FeatureName.MobileThreatDetectionDeveloperModeThreat)
  const enableUnresponsiveAgent: boolean = FeaturizationApi.isFeatureEnabled(
    FeatureName.MobileThreatDetectionUnresponsiveAgentThreat,
  )
  return Object.values(MobileProtectData.MobileThreatEventType).filter(
    eventItem =>
      (enableUnsafeMessage || eventItem !== MobileProtectData.MobileThreatEventType.UNSAFE_MESSAGE) &&
      (enableUnresponsiveAgent || eventItem !== MobileProtectData.MobileThreatEventType.UNRESPONSIVE_AGENT) &&
      (enableDeveloperMode || eventItem !== MobileProtectData.MobileThreatEventType.DEVELOPER_MODE) &&
      (enableRestrictedApps || eventItem !== MobileProtectData.MobileThreatEventType.RESTRICTED_APP),
  )
}
