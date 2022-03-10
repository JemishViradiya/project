//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isEmpty, isNil } from 'lodash-es'
import moment from 'moment'
import type { TFuncKey, TransProps } from 'react-i18next'

import { getDateRangeTimestampString, TimeIntervalId } from '@ues-behaviour/dashboard'
import type { ReportingServiceAlertInfo, ReportingServiceQueryFilters, ReportingServiceTunnelEvent } from '@ues-data/gateway'
import { ReportingServiceAlertType, ReportingServiceAppProto, ReportingServiceFilter } from '@ues-data/gateway'
import { FeatureName, FeaturizationApi } from '@ues-data/shared'
import { OPERATOR_VALUES } from '@ues/behaviours'

import { EVENTS_DEFAULT_TIME_INTERVAL } from '../config'

export const encodeId = (id: string) => encodeURIComponent(btoa(id))

export const checkIsAclEvent = (networkEvent: ReportingServiceTunnelEvent): boolean => {
  return isEmpty(networkEvent?.policyId)
}

export const hasNetworkAlert = (networkEvent: ReportingServiceTunnelEvent): boolean => {
  return numNetworkAlert(networkEvent) > 0
}

export const numNetworkAlert = (networkEvent: ReportingServiceTunnelEvent): number => {
  const networkAlertArr = networkEvent?.alerts
    ? networkEvent?.alerts.filter(alert => !isNil(alert.alertType) && alert.alertType !== ReportingServiceAlertType.Protocol)
    : []

  return networkAlertArr.length
}

export const checkIsAnomaly = (networkEvent: ReportingServiceTunnelEvent): boolean => {
  return networkEvent?.anomaly === true || hasNetworkAlert(networkEvent)
}

export const checkIsDNS = (networkEvent: ReportingServiceTunnelEvent): boolean =>
  networkEvent?.appProto?.toUpperCase() === ReportingServiceAppProto.DNS

export const getRiskScore = (networkEvent: ReportingServiceTunnelEvent): number => Math.round(networkEvent.bisScore)

export const validateTrafficInProgressStatus = (networkEvent: ReportingServiceTunnelEvent): boolean => isNil(networkEvent?.tsTerm)

export const resolveTunnelEventTransfer = (
  networkEvent: Partial<ReportingServiceTunnelEvent>,
  t: TransProps<TFuncKey>['t'],
  bytesFormatterResolver: any,
): string | number =>
  validateTrafficInProgressStatus(networkEvent) ? t('common.inProgress') : bytesFormatterResolver(networkEvent?.bytes_total)

export const computeDuration = (networkEvent: ReportingServiceTunnelEvent, t: TransProps<TFuncKey>['t']): string => {
  if (isNil(networkEvent) || (validateTrafficInProgressStatus(networkEvent) && !checkIsDNS(networkEvent)))
    return t('common.inProgress')

  const duration = Number(networkEvent?.tsTerm) - Number(networkEvent?.tsStart)
  return moment.duration(duration).humanize()
}

export const makeBytesTotalFilter = (filter): Pick<ReportingServiceQueryFilters, ReportingServiceFilter.BytesTotal> => {
  if (filter?.operator === OPERATOR_VALUES.GREATER_OR_EQUAL) {
    return { [ReportingServiceFilter.BytesTotal]: { from: filter?.value } }
  }

  if (filter?.operator === OPERATOR_VALUES.GREATER) {
    return { [ReportingServiceFilter.BytesTotal]: { from: filter?.value + 1 } }
  }

  if (filter?.operator === OPERATOR_VALUES.LESS) {
    return { [ReportingServiceFilter.BytesTotal]: { to: filter?.value - 1 } }
  }

  if (filter?.operator === OPERATOR_VALUES.EQUAL) {
    return { [ReportingServiceFilter.BytesTotal]: { from: filter?.value, to: filter?.value } }
  }

  return { [ReportingServiceFilter.BytesTotal]: { to: filter?.value } }
}

export const computeDataPointStartTimestamp = (endTimestamp: number | string, timeIntervalId: TimeIntervalId): string => {
  const DATA_INTERVAL_OPERATION_UNITS: Record<TimeIntervalId, moment.unitOfTime.DurationConstructor> = {
    [TimeIntervalId.Last24Hours]: 'hours',
    [TimeIntervalId.Today]: 'hours',
    [TimeIntervalId.Yesterday]: 'hours',
    [TimeIntervalId.Last2Days]: 'hours',
    [TimeIntervalId.Last7Days]: 'days',
    [TimeIntervalId.LastWeek]: 'days',
    [TimeIntervalId.ThisWeek]: 'days',
    [TimeIntervalId.LastMonth]: 'days',
    [TimeIntervalId.ThisMonth]: 'days',
    [TimeIntervalId.Last30Days]: 'days',
    [TimeIntervalId.Last60Days]: 'weeks',
    [TimeIntervalId.Last2Months]: 'weeks',
    [TimeIntervalId.Last90Days]: 'weeks',
    [TimeIntervalId.Last3Months]: 'weeks',
    [TimeIntervalId.Last120Days]: 'weeks',
  }

  return moment(endTimestamp).subtract(1, DATA_INTERVAL_OPERATION_UNITS[timeIntervalId]).valueOf().toString()
}

export const formatToTimestamp = (date: moment.Moment) => date?.valueOf().toString()

interface DateRange {
  startDate?: string
  endDate?: string
}
export const makeDefaultDateRange = (locationState?: DateRange): DateRange =>
  !isEmpty(locationState?.startDate) && !isEmpty(locationState?.endDate)
    ? { startDate: locationState.startDate, endDate: locationState.endDate }
    : getDateRangeTimestampString({ timeInterval: EVENTS_DEFAULT_TIME_INTERVAL, nowTime: new Date() })

export const checkIsHiddenAlertType = (item: ReportingServiceAlertInfo) =>
  item?.alertType === ReportingServiceAlertType.Protocol ||
  (item?.alertType === ReportingServiceAlertType.DnsTunneling &&
    !FeaturizationApi.isFeatureEnabled(FeatureName.UESBigDnsTunnelingEnabled))
