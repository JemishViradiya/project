/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Backdrop, Box, Card, CircularProgress, makeStyles } from '@material-ui/core'

import type { SimpleFilter } from '@ues/behaviours'
import {
  AppliedFilterPanel,
  FILTER_TYPES,
  InfiniteTable,
  InfiniteTableProvider,
  OPERATOR_VALUES,
  QuickSearchFilter,
  STRING_OPERATORS,
  TableToolbar,
  useQuickSearchFilter,
  useTableFilter,
} from '@ues/behaviours'

import { UsersTableActions } from './UsersTableActions'
import { useUsersTable } from './useUsersTable'

const useStyles = makeStyles(theme => ({
  paperContainer: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
  },
  flexPaper: {
    flex: '1 1 auto',
    width: 1024,
    display: 'flex',
    flexDirection: 'column',
  },
  backdrop: {
    zIndex: theme.zIndex.snackbar,
  },
  autosizeWrapperScroll: {
    overflowX: 'hidden',
  },
}))

const SearchFilterComponent = ({ fieldKey }) => {
  const { t } = useTranslation(['platform/common', 'profiles'])
  const filterProps = useTableFilter<SimpleFilter<string>>()
  const props = useQuickSearchFilter({ filterProps, key: fieldKey, defaultOperator: OPERATOR_VALUES.CONTAINS })
  return (
    <QuickSearchFilter
      label={t(`groups.usersTable.${fieldKey}`)}
      operators={STRING_OPERATORS.filter(op => op !== OPERATOR_VALUES.DOES_NOT_CONTAIN)}
      {...props}
    />
  )
}

const UsersTable = ({ groupId, readonly = false }: { groupId: string; readonly?: boolean }) => {
  const { t } = useTranslation(['platform/common', 'profiles'])
  const { paperContainer, flexPaper, backdrop, autosizeWrapperScroll } = useStyles()

  const COLUMNS = useMemo(
    () => [
      {
        label: t('groups.usersTable.displayName'),
        dataKey: 'displayName',
        sortable: true,
        filterType: FILTER_TYPES.QUICK_SEARCH,
        renderFilter: () => <SearchFilterComponent fieldKey="displayName" />,
      },
      {
        label: t('groups.usersTable.emailAddress'),
        dataKey: 'emailAddress',
        filterType: FILTER_TYPES.QUICK_SEARCH,
        renderFilter: () => <SearchFilterComponent fieldKey="emailAddress" />,
      },
    ],
    [t],
  )

  const { tableProps, providerProps, filterPanelProps, onDelete, showLoading } = useUsersTable({
    groupId,
    readonly,
    columns: COLUMNS,
  })

  return (
    <Box className={paperContainer}>
      <Card className={flexPaper} variant="outlined">
        <TableToolbar
          bottom={<AppliedFilterPanel {...filterPanelProps} />}
          begin={
            !readonly && (
              <UsersTableActions selectedItems={providerProps?.selectedProps?.selected} onDelete={onDelete} id={groupId} />
            )
          }
        />
        <InfiniteTableProvider {...providerProps}>
          <InfiniteTable {...tableProps} extraClasses={autosizeWrapperScroll} noDataPlaceholder={t('noData')} />
        </InfiniteTableProvider>
      </Card>
      <Backdrop className={backdrop} open={showLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  )
}

export default UsersTable
