/* eslint-disable sonarjs/no-duplicate-string */
/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Backdrop, Box, Card, CircularProgress, makeStyles } from '@material-ui/core'

import { queryDirectoryConfigured } from '@ues-data/platform'
import { useFeatures, useStatefulAsyncQuery } from '@ues-data/shared'
import { FeatureName, Permission } from '@ues-data/shared-types'
import { HelpLinkScope, usePlatformHelpLink } from '@ues-platform/shared'
import {
  AppliedFilterPanel,
  InfiniteTable,
  InfiniteTableProvider,
  PageTitlePanel,
  TableToolbar,
  usePageTitle,
  useSecuredContent,
} from '@ues/behaviours'

import { GroupTableActions } from './GroupTableActions'
import { GroupTableExport } from './GroupTableExport'
import { useColumns } from './useColumns'
import { useGroupsTable } from './useGroupsTable'

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

const GroupsTableWrapper = () => {
  useSecuredContent(Permission.ECS_USERS_READ)
  const { data: directoryConfigured, loading: loadingDirectoryConfigured } = useStatefulAsyncQuery(queryDirectoryConfigured)

  return <GroupsTable directoryConfigured={directoryConfigured} loadingDirectoryConfigured={loadingDirectoryConfigured} />
}

const GroupsTable = ({ directoryConfigured, loadingDirectoryConfigured }) => {
  const { t } = useTranslation(['platform/common', 'profiles', 'general/form'])
  usePageTitle(t('platform/common:groups.title'))
  const { outerContainer, paperContainer, backdrop } = useStyles()
  const features = useFeatures()
  const cronosNavigation = features.isEnabled(FeatureName.UESCronosNavigation)

  const columns = useColumns()

  const { tableProps, providerProps, filterPanelProps, onDelete, showLoading } = useGroupsTable({ columns })

  return (
    <Box className={outerContainer}>
      <PageTitlePanel
        title={[cronosNavigation ? t('navigation.assets') : t('navigation.gateway'), t('groups.title')]}
        borderBottom
        helpId={usePlatformHelpLink(HelpLinkScope.USER_GROUPS)}
      />
      <Card className={paperContainer} variant="outlined">
        <InfiniteTableProvider {...providerProps}>
          <TableToolbar
            bottom={<AppliedFilterPanel {...filterPanelProps} />}
            begin={
              <GroupTableActions
                selectedItems={providerProps.selectedProps?.selected}
                onDelete={onDelete}
                directoriesConfigured={directoryConfigured}
                addBlocked={loadingDirectoryConfigured}
              />
            }
            end={<GroupTableExport />}
          />
          <InfiniteTable {...tableProps} noDataPlaceholder={t('noData')} />
        </InfiniteTableProvider>
      </Card>
      <Backdrop className={backdrop} open={showLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  )
}

export default GroupsTableWrapper
