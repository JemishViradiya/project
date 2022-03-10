//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'

import { Config } from '@ues-gateway/shared'
import { OPERATOR_VALUES, QuickSearchFilter, useQuickSearchFilter, useTableFilter } from '@ues/behaviours'

import { ColumnDataKey } from '../../types'

const { GATEWAY_TRANSLATIONS_KEY } = Config

export const NameFilterComponent: React.FC = () => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])

  const filterProps = useTableFilter()
  const props = useQuickSearchFilter({
    filterProps,
    key: ColumnDataKey.Name,
    defaultOperator: OPERATOR_VALUES.CONTAINS,
    debounceInterval: 600,
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
    debounceInterval: 600,
  })

  return <QuickSearchFilter label={t('common.description')} {...props} />
}
