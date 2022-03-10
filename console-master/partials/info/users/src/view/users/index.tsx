//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box } from '@material-ui/core'

import { ContentAreaPanel, PageTitlePanel, SecuredContentBoundary } from '@ues/behaviours'

import useStyles from '../styles'
import UsersList from './usersList'

const Users: React.FC = () => {
  const { t } = useTranslation('dlp/common')
  const classes = useStyles()

  const onRowClick = (params, e) => {
    console.log('params', params)
  }

  return (
    <Box className={classes.container}>
      <PageTitlePanel title={[t('users.mainTitle.assets'), t('users.mainTitle.users')]} />
      <Box className={classes.content}>
        <ContentAreaPanel fullHeight fullWidth ContentWrapper={SecuredContentBoundary}>
          <UsersList onRowClick={onRowClick} />
        </ContentAreaPanel>
      </Box>
    </Box>
  )
}

export default Users
