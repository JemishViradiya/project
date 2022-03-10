//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'

import { Config } from '@ues-gateway/shared'
import {
  OPERATOR_VALUES,
  QuickSearchFilter,
  RadioFilter,
  useQuickSearchFilter,
  useRadioFilter,
  useTableFilter,
} from '@ues/behaviours'

import { SAAS_APPS_FILTER_LOCALIZATION_KEYS } from '../../constants'
import { ColumnDataKey } from '../../types'

const { GATEWAY_TRANSLATIONS_KEY } = Config

const QUICK_SEARCH_FILTER_DEBOUNCE_INTERVAL = 600

export const NameFilterComponent: React.FC = () => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])

  const filterProps = useTableFilter()
  const props = useQuickSearchFilter({
    filterProps,
    key: ColumnDataKey.Name,
    defaultOperator: OPERATOR_VALUES.CONTAINS,
    debounceInterval: QUICK_SEARCH_FILTER_DEBOUNCE_INTERVAL,
  })

  return <QuickSearchFilter label={t('common.name')} {...props} />
}

export const DescriptionFilterComponent: React.FC = () => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])

  const filterProps = useTableFilter()
  const props = useQuickSearchFilter({
    filterProps,
    key: ColumnDataKey.Description,
    defaultOperator: OPERATOR_VALUES.CONTAINS,
    debounceInterval: QUICK_SEARCH_FILTER_DEBOUNCE_INTERVAL,
  })

  return <QuickSearchFilter label={t('common.description')} {...props} />
}

export const SaasAppsFilterComponent: React.FC = () => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])

  const filterProps = useTableFilter()
  const props = useRadioFilter({ filterProps, key: ColumnDataKey.SaasApps })
  const items = Object.values(SAAS_APPS_FILTER_LOCALIZATION_KEYS).map(item => t(item))

  return <RadioFilter label={t('networkServices.saasApps')} items={items} {...props} />
}
