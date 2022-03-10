/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { SyntheticEvent } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Button, Link as MuiLink } from '@material-ui/core'

import { XGrid } from '@ues-behaviour/x-grid'
import type { UsersBase } from '@ues-data/dlp'
import { Permission } from '@ues-data/shared'
import type { ToolbarProps } from '@ues/behaviours'
import { AppliedFilterPanel, TableProvider, TableToolbar, useSecuredContent } from '@ues/behaviours'

import makeStyles from '../styles'
import { useUsersTableProps } from './useUsersTableProps'

const UsersList = ({ onRowClick }) => {
  useSecuredContent(Permission.ECS_USERS_READ, Permission.ECS_DIRECTORY_READ)
  const { t } = useTranslation(['dlp/common'])
  const classes = makeStyles()

  const handleRowClick = (data: UsersBase, e: SyntheticEvent) => {
    onRowClick(data, e)
  }

  const { tableProps, providerProps, filterLabelProps } = useUsersTableProps({
    handleRowClick: handleRowClick,
  })

  const toolbarProps: ToolbarProps = {
    begin: (
      <MuiLink className={classes.asLink} href={'/uc/platform#/users'}>
        <Button variant="contained" color="secondary">
          {t('users.buttons.manageUsers')}
        </Button>
      </MuiLink>
    ),
    bottom: <AppliedFilterPanel {...providerProps.filterProps} {...filterLabelProps} />,
  }
  return (
    <Box className={classes.container}>
      <TableToolbar {...toolbarProps} />
      <TableProvider {...providerProps}>
        <XGrid {...tableProps} />
      </TableProvider>
    </Box>
  )
}

export default UsersList
