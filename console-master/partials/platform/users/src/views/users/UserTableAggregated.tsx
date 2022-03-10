/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Backdrop, Box, Card, CircularProgress, Link, makeStyles, Paper, Typography } from '@material-ui/core'

import { XGrid } from '@ues-behaviour/x-grid'
import { FeatureName, useFeatures } from '@ues-data/shared'
import { Permission } from '@ues-data/shared-types'
import { HelpLinkScope, usePlatformHelpLink } from '@ues-platform/shared'
import type { TableColumn } from '@ues/behaviours'
import {
  AppliedFilterPanel,
  PageTitlePanel,
  TableProvider,
  TableToolbar,
  useBasicTable,
  useFilterLabels,
  usePageTitle,
  useSecuredContent,
  useTableFilter,
} from '@ues/behaviours'

import { useDeleteUsers } from './deleteUsers/useDeleteUsers'
import { useExpirePasscode } from './expirePasscode/useExpirePasscode'
import { useColumns } from './filters'
import { useResendInvitation } from './resendInvitation/useResendInvitation'
import { UserTableActions } from './UserTableActions'
import { getDataSourceItems } from './userUtils'
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

const AppliedFilters: React.FC<{ columns: TableColumn[] }> = ({ columns }) => {
  const { t } = useTranslation(['platform/common'])
  const filterProps = useTableFilter()

  const itemLabels = useMemo(() => getDataSourceItems(t).itemsLabels, [t])
  const filterLabelProps = useFilterLabels(filterProps.activeFilters, columns, itemLabels)

  return <AppliedFilterPanel {...filterProps} {...filterLabelProps} />
}

const UserTableAggregated = () => {
  useSecuredContent(Permission.ECS_USERS_READ)
  const features = useFeatures()
  const cronosNavigation = features.isEnabled(FeatureName.UESCronosNavigation)

  const { t } = useTranslation(['platform/common'])
  const { outerContainer, paperContainer, backdrop } = useStyles()
  const navigate = useNavigate()

  const COLUMNS = useColumns()

  const { providerProps, tableProps, totalCount, selectedCount, serverSideSelectionModel, refetch } = useUserTable({
    columns: COLUMNS,
  })
  const { onResendInvitation, resendProgressState } = useResendInvitation(
    providerProps.selectedProps,
    selectedCount,
    serverSideSelectionModel,
  )

  const { handleExpirePasscodes, expireUsersPasscodesLoading } = useExpirePasscode(
    providerProps.selectedProps,
    selectedCount,
    serverSideSelectionModel,
    refetch,
  )

  const { handleDelete, deleteLoading } = useDeleteUsers(
    providerProps.selectedProps,
    selectedCount,
    serverSideSelectionModel,
    refetch,
  )

  const onAdd = () => {
    navigate('./add')
  }

  usePageTitle(t('users.grid.allUsers'))

  return (
    <Box className={outerContainer}>
      <PageTitlePanel
        title={[cronosNavigation ? t('navigation.assets') : t('navigation.gateway'), t('users.grid.allUsers')]}
        borderBottom
        helpId={usePlatformHelpLink(HelpLinkScope.USERS)}
      />
      <Card variant="outlined" className={paperContainer}>
        <TableProvider {...providerProps}>
          <TableToolbar
            bottom={<AppliedFilters columns={COLUMNS} />}
            begin={
              <UserTableActions
                onDelete={handleDelete}
                onAdd={onAdd}
                onResendInvitation={onResendInvitation}
                onExpirePasscodes={handleExpirePasscodes}
                selectedCount={selectedCount}
              />
            }
            end={<Typography variant="body2">{t('users.grid.resultsCount', { value: totalCount })}</Typography>}
          />
          <XGrid {...tableProps} noRowsMessageKey={'general/form:commonLabels.noData'} />
        </TableProvider>
      </Card>
      <Backdrop className={backdrop} open={expireUsersPasscodesLoading || resendProgressState || deleteLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  )
}

export default UserTableAggregated
