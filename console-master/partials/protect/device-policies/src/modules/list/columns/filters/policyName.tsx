import React from 'react'
import { useTranslation } from 'react-i18next'

import { DevicePolicyListItemField } from '@ues-data/epp'
import type { SimpleFilter } from '@ues/behaviours'
import { OPERATOR_VALUES, QuickSearchFilter, useQuickSearchFilter, useTableFilter } from '@ues/behaviours'

const PolicyNameFilter = (): JSX.Element => {
  const { t: translate } = useTranslation(['protect'])
  const label = translate('policyName')

  const filterProps = useTableFilter<SimpleFilter<string>>()

  const policyNameFilterProps = useQuickSearchFilter({
    key: DevicePolicyListItemField.policy_name,
    label,
    filterProps,
    defaultOperator: OPERATOR_VALUES.CONTAINS,
    debounceInterval: 300,
    requireMinimumCharacters: false,
  })

  return (
    <QuickSearchFilter
      {...policyNameFilterProps}
      label={label}
      // autoIdPrefix={`policy-list-${col.dataKey}-filter`}
    />
  )
}

export default PolicyNameFilter
