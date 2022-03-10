import React from 'react'
import { useTranslation } from 'react-i18next'

import type { SimpleFilter } from '@ues/behaviours'
import { OPERATOR_VALUES, QuickSearchFilter, useQuickSearchFilter, useTableFilter } from '@ues/behaviours'

import { ExclusionField } from './constants'

const FolderPathFilter = (): JSX.Element => {
  const { t: translate } = useTranslation(['protect'])
  const label = translate('folderPath')

  const filterProps = useTableFilter<SimpleFilter<string>>()

  const folderPathFilterProps = useQuickSearchFilter({
    key: ExclusionField.path,
    label,
    filterProps,
    defaultOperator: OPERATOR_VALUES.CONTAINS,
    debounceInterval: 300,
    requireMinimumCharacters: false,
  })

  return <QuickSearchFilter {...folderPathFilterProps} label={label} />
}

export { FolderPathFilter }
