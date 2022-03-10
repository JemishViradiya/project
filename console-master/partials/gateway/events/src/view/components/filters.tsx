//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { TlsVersions } from '@ues-data/gateway'
import { Config } from '@ues-gateway/shared'
import {
  CheckboxFilter,
  DatetimeRangeFilter,
  NUMERIC_OPERATORS,
  NumericNoRangeFilter,
  OPERATOR_VALUES,
  QuickSearchFilter,
  RadioFilter,
  STRING_OPERATORS,
  useCheckboxFilter,
  useDatetimeRangeFilter,
  useNumericNoRangeFilter,
  useQuickSearchFilter,
  useRadioFilter,
  useTableFilter,
} from '@ues/behaviours'

import { EventsContext } from '../context'
import {
  ACTION_LOCALIZATION_KEYS,
  ANOMALY_FILTER_LOCALIZATION_KEYS,
  NETWORK_ROUTE_LOCALIZATION_KEYS,
  QUICK_SEARCH_FILTER_DEBOUNCE_INTERVAL,
} from './constants'
import { EventsColumnDataKey } from './types'

const { GATEWAY_TRANSLATIONS_KEY } = Config

const FIELD_MATCH_OPERATORS = [
  OPERATOR_VALUES.CONTAINS,
  OPERATOR_VALUES.DOES_NOT_CONTAIN,
  OPERATOR_VALUES.EQUAL,
  OPERATOR_VALUES.STARTS_WITH,
  OPERATOR_VALUES.ENDS_WITH,
]

export const UserFilterComponent: React.FC = () => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])

  const filterProps = useTableFilter()
  const props = useQuickSearchFilter({
    filterProps,
    key: EventsColumnDataKey.User,
    defaultOperator: OPERATOR_VALUES.CONTAINS,
    debounceInterval: QUICK_SEARCH_FILTER_DEBOUNCE_INTERVAL,
  })

  return (
    <QuickSearchFilter
      label={t('common.user')}
      {...props}
      operators={
        // TODO when `DOES_NOT_CONTAIN` is supported, remove line below and reuse default operators
        STRING_OPERATORS.filter(operator => operator !== OPERATOR_VALUES.DOES_NOT_CONTAIN)
      }
    />
  )
}

export const TransferredTotalFilterComponent: React.FC = () => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const filterProps = useTableFilter()

  const props = useNumericNoRangeFilter({
    filterProps,
    key: EventsColumnDataKey.TransferredTotal,
    defaultOperator: OPERATOR_VALUES.LESS_OR_EQUAL,
    onlyPositive: true,
  })

  return <NumericNoRangeFilter label={t('common.transferred')} {...props} operators={NUMERIC_OPERATORS} />
}

export const DateRangeFilterComponent: React.FC = () => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])

  const filterProps = useTableFilter()
  const props = useDatetimeRangeFilter({ filterProps, key: EventsColumnDataKey.DateRange })

  return <DatetimeRangeFilter label={t('common.dateRange')} {...props} />
}

export const DestinationFilterComponent: React.FC = () => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])

  const filterProps = useTableFilter()
  const props = useQuickSearchFilter({
    filterProps,
    key: EventsColumnDataKey.Destination,
    defaultOperator: OPERATOR_VALUES.CONTAINS,
    debounceInterval: QUICK_SEARCH_FILTER_DEBOUNCE_INTERVAL,
  })

  return <QuickSearchFilter label={t('common.destination')} operators={FIELD_MATCH_OPERATORS} {...props} />
}

export const DestinationPortFilterComponent: React.FC = () => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])

  const filterProps = useTableFilter()
  const props = useQuickSearchFilter({
    filterProps,
    key: EventsColumnDataKey.DestinationPort,
    defaultOperator: OPERATOR_VALUES.EQUAL,
    debounceInterval: QUICK_SEARCH_FILTER_DEBOUNCE_INTERVAL,
  })

  return <QuickSearchFilter label={t('events.destinationPort')} {...props} operators={[]} />
}

export const SourceIpFilterComponent: React.FC = () => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])

  const filterProps = useTableFilter()
  const props = useQuickSearchFilter({
    filterProps,
    key: EventsColumnDataKey.SourceIp,
    defaultOperator: OPERATOR_VALUES.CONTAINS,
  })

  return <QuickSearchFilter label={t('common.source')} operators={[]} {...props} />
}

export const ActionFilterComponent: React.FC = () => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])

  const filterProps = useTableFilter()
  const props = useRadioFilter({ filterProps, key: EventsColumnDataKey.Action })
  const items = Object.values(ACTION_LOCALIZATION_KEYS).map(item => t(item))

  return <RadioFilter label={t('common.action')} items={items} {...props} />
}

export const NetworkRouteFilterComponent: React.FC = () => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])

  const filterProps = useTableFilter()
  const props = useRadioFilter({ filterProps, key: EventsColumnDataKey.NetworkRoute })
  const items = Object.values(NETWORK_ROUTE_LOCALIZATION_KEYS).map(item => t(item))

  return <RadioFilter label={t('events.networkRoute')} items={items} {...props} />
}

export const TlsVersionFilterComponent: React.FC = () => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])

  const filterProps = useTableFilter()
  const props = useRadioFilter({ filterProps, key: EventsColumnDataKey.TlsVersion })
  const items = Object.values(TlsVersions).filter(item => item !== TlsVersions.UNDETERMINED)

  return <RadioFilter label={t('events.tls.version')} items={items} {...props} />
}

export const AnomalyFilterComponent: React.FC = () => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])

  const filterProps = useTableFilter()
  const props = useCheckboxFilter({ filterProps, key: EventsColumnDataKey.Anomaly })
  const items = Object.values(ANOMALY_FILTER_LOCALIZATION_KEYS).map(item => t(item))

  return <CheckboxFilter label={t('events.anomaly')} items={items} {...props} />
}

export const AppProtocolFilterComponent: React.FC = () => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])

  const filterProps = useTableFilter()
  const props = useQuickSearchFilter({
    filterProps,
    key: EventsColumnDataKey.AppProtocol,
    defaultOperator: OPERATOR_VALUES.CONTAINS,
    debounceInterval: QUICK_SEARCH_FILTER_DEBOUNCE_INTERVAL,
  })

  return <QuickSearchFilter label={t('events.appProtocol')} operators={FIELD_MATCH_OPERATORS} {...props} />
}

export const AppliedRuleFilterComponent: React.FC = () => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])

  const filterProps = useTableFilter()
  const props = useQuickSearchFilter({
    filterProps,
    key: EventsColumnDataKey.RuleNames,
    defaultOperator: OPERATOR_VALUES.CONTAINS,
    debounceInterval: QUICK_SEARCH_FILTER_DEBOUNCE_INTERVAL,
  })

  return <QuickSearchFilter label={t('events.appliedRules')} operators={FIELD_MATCH_OPERATORS} {...props} />
}

export const CategoryFilterComponent: React.FC = () => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const {
    categories: { categories },
  } = useContext(EventsContext)

  const filterProps = useTableFilter()
  const props = useCheckboxFilter({ filterProps, key: EventsColumnDataKey.Category })
  const items = categories.map(item => item.name)

  return <CheckboxFilter label={t('events.eventAlerts.category')} items={items} {...props} />
}
