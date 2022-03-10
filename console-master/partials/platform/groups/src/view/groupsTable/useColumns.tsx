/* eslint-disable sonarjs/no-duplicate-string */
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Link as MuiLink } from '@material-ui/core'

import { BasicAllow } from '@ues/assets'
import type { SimpleFilter } from '@ues/behaviours'
import {
  BooleanFilter,
  FILTER_TYPES,
  NUMERIC_OPERATORS,
  NumericNoRangeFilter,
  OPERATOR_VALUES,
  QuickSearchFilter,
  STRING_OPERATORS,
  useBooleanFilter,
  useNumericNoRangeFilter,
  useQuickSearchFilter,
  useTableFilter,
} from '@ues/behaviours'

const GroupLink = props => {
  const { groupDetails } = props
  const link = groupDetails.dataSourceConnectionId ? `directory/${groupDetails.id}?tabId=0` : `local/${groupDetails.id}?tabId=0`
  return (
    <MuiLink component={Link} key={groupDetails.name} to={link}>
      {groupDetails.name}
    </MuiLink>
  )
}

const renderOnboarding = data => {
  return data && <BasicAllow fontSize="small" />
}

const OnboardingFilterComponent = () => {
  const { t } = useTranslation(['platform/common', 'general/form'])
  const filterProps = useTableFilter<SimpleFilter<boolean>>()
  const props = useBooleanFilter({ filterProps, key: 'isOnboardingEnabled' })
  return <BooleanFilter label={t('groups.table.onboarding')} optionLabel={t('general/form:commonLabels.enabled')} {...props} />
}

const SearchFilterComponent = () => {
  const { t } = useTranslation(['platform/common'])
  const filterProps = useTableFilter<SimpleFilter<string>>()
  const props = useQuickSearchFilter({ filterProps, key: 'name', defaultOperator: OPERATOR_VALUES.CONTAINS })
  return (
    <QuickSearchFilter
      label={t('groups.table.groupName')}
      operators={STRING_OPERATORS.filter(op => op !== OPERATOR_VALUES.DOES_NOT_CONTAIN)}
      {...props}
    />
  )
}

const UserCountFilterComponent = () => {
  const { t } = useTranslation(['platform/common'])
  const filterProps = useTableFilter<SimpleFilter<number>>()
  const props = useNumericNoRangeFilter({
    filterProps,
    key: 'userCount',
    defaultOperator: OPERATOR_VALUES.GREATER,
    onlyPositive: true,
  })
  return <NumericNoRangeFilter label={t('groups.table.numUsers')} {...props} operators={NUMERIC_OPERATORS} />
}

export const useColumns = () => {
  const { t } = useTranslation(['platform/common'])

  return useMemo(
    () => [
      {
        label: t('groups.table.groupName'),
        dataKey: 'name',
        width: 240,
        renderCell: (rowData: any, rowDataIndex: number) => <GroupLink groupDetails={rowData} />,
        persistent: true,
        sortable: true,
        filterType: FILTER_TYPES.QUICK_SEARCH,
        renderFilter: () => <SearchFilterComponent />,
      },
      {
        label: t('groups.table.numUsers'),
        dataKey: 'userCount',
        width: 130,
        renderCell: (rowData: any, rowDataIndex: number) => <span>{rowData?.relationships?.users?.count ?? 0}</span>,
        filterType: FILTER_TYPES.NUMERIC_NO_RANGE,
        renderFilter: () => <UserCountFilterComponent />,
        sortable: true,
      },
      {
        label: t('groups.table.onboarding'),
        dataKey: 'isOnboardingEnabled',
        renderCell: (rowData: any, rowDataIndex: number) => renderOnboarding(rowData.isOnboardingEnabled),
        sortable: true,
        filterType: FILTER_TYPES.BOOLEAN,
        renderFilter: () => <OnboardingFilterComponent />,
      },
      {
        label: t('groups.table.directoryLink'),
        dataKey: 'directoryLink',
      },
    ],
    [t],
  )
}
