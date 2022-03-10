/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Backdrop, Box, Card, CircularProgress, Link, makeStyles, Typography } from '@material-ui/core'

import { XGrid } from '@ues-behaviour/x-grid'
import { FeatureName, useFeatures } from '@ues-data/shared'
import { Permission } from '@ues-data/shared-types'
import type { SimpleFilter } from '@ues/behaviours'
import {
  AppliedFilterPanel,
  FILTER_TYPES,
  OPERATOR_VALUES,
  PageTitlePanel,
  QuickSearchFilter,
  RadioFilter,
  TableProvider,
  TableToolbar,
  useFilterLabels,
  usePageTitle,
  useQuickSearchFilter,
  useRadioFilter,
  useSecuredContent,
  useTableFilter,
} from '@ues/behaviours'

import { useResendInvitation } from './resendInvitation/useResendInvitation'
import { UserTableActions } from './UserTableActions'
import { renderDataSource } from './userUtils'
import { useUserTable } from './useUserTable'

const useStyles = makeStyles(theme => ({
  outerContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  paperContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing(6),
  },
  backdrop: {
    zIndex: theme.zIndex.snackbar,
  },
}))

const StringFilterComponent = ({ fieldName, label }) => {
  const filterProps = useTableFilter<SimpleFilter<string>>()
  const props = useQuickSearchFilter({ filterProps, key: fieldName, defaultOperator: OPERATOR_VALUES.CONTAINS })
  return <QuickSearchFilter label={label} operators={[]} {...props} />
}
const getDataSourceItems = t => {
  const dataSourceItems = {
    // eslint-disable-next-line sonarjs/no-duplicate-string
    cur: t('users.add.dataSource.cur'),
    azure: t('users.add.dataSource.azure'),
    ldap: t('users.add.dataSource.ldap'),
    active_directory: t('users.add.dataSource.active_directory'),
  }
  return { items: Object.keys(dataSourceItems), itemsLabels: dataSourceItems }
}

const DataSourceFilterComponent = ({ fieldName, label, t }) => {
  const filterProps = useTableFilter<SimpleFilter<string>>()
  const props = useRadioFilter({ filterProps, key: fieldName })
  return <RadioFilter label={label} {...getDataSourceItems(t)} {...props} />
}

const renderDisplayName = (data, navigate) => {
  return (
    <Link
      onClick={() => {
        navigate(`/users/${data.id}`)
      }}
      role="link"
      aria-label={`userDetails`}
    >
      {data.displayName}
    </Link>
  )
}
const UserTable = () => {
  useSecuredContent(Permission.ECS_USERS_READ)
  const { t } = useTranslation(['platform/common'])
  const { outerContainer, paperContainer, backdrop } = useStyles()
  const navigate = useNavigate()
  const itemLabels = useMemo(() => getDataSourceItems(t).itemsLabels, [t])
  const features = useFeatures()
  const cronosNavigation = features.isEnabled(FeatureName.UESCronosNavigation)

  const COLUMNS = useMemo(
    () => [
      {
        label: t('users.grid.displayName'),
        dataKey: 'displayName',
        renderCell: data => renderDisplayName(data, navigate),
        persistent: true,
        sortable: true,
        filterType: FILTER_TYPES.QUICK_SEARCH,
        renderFilter: () => <StringFilterComponent fieldName={'displayName'} label={t('users.grid.displayName')} />,
        gridColDefProps: { flex: 3 },
      },
      {
        label: t('users.grid.emailAddress'),
        dataKey: 'emailAddress',
        renderCell: data => data.emailAddress,
        sortable: true,
        filterType: FILTER_TYPES.QUICK_SEARCH,
        renderFilter: () => <StringFilterComponent fieldName={'emailAddress'} label={t('users.grid.emailAddress')} />,
        gridColDefProps: { minWidth: 190, flex: 2 },
      },
      {
        label: t('users.grid.dataSource.header'),
        dataKey: 'dataSource',
        width: 40,
        renderCell: data => renderDataSource(data.dataSource, t),
        sortable: true,
        filterType: FILTER_TYPES.RADIO,
        renderFilter: () => <DataSourceFilterComponent fieldName={'dataSource'} label={t('users.grid.dataSource.header')} t={t} />,
        gridColDefProps: { minWidth: 150 },
      },
    ],
    [t, navigate],
  )

  const { providerProps, filterPanelProps, onDelete, showLoading, tableProps, totalCount } = useUserTable({
    columns: COLUMNS,
  })
  const filterPanelLabels = useFilterLabels(filterPanelProps.activeFilters, COLUMNS, itemLabels)
  const { onResendInvitation, resendProgressState } = useResendInvitation(providerProps.selectedProps)

  const onAdd = () => {
    navigate('/users/add')
  }

  usePageTitle(t('users.grid.allUsers'))

  return (
    <Box className={outerContainer}>
      <PageTitlePanel
        title={[cronosNavigation ? t('navigation.assets') : t('navigation.gateway'), t('users.grid.allUsers')]}
        borderBottom
      />
      <Card variant="outlined" className={paperContainer}>
        <TableProvider {...providerProps}>
          <TableToolbar
            bottom={<AppliedFilterPanel {...filterPanelProps} {...filterPanelLabels} />}
            begin={<UserTableActions onDelete={onDelete} onAdd={onAdd} onResendInvitation={onResendInvitation} />}
            end={<Typography variant="body2">{t('users.grid.resultsCount', { value: totalCount })}</Typography>}
          />
          <XGrid {...tableProps} noRowsMessageKey={'general/form:commonLabels.noData'} />
        </TableProvider>
      </Card>
      <Backdrop className={backdrop} open={showLoading || resendProgressState}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  )
}

export default UserTable
