/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { Box, Card, CircularProgress, IconButton, makeStyles, Typography, useTheme } from '@material-ui/core'

import type { PlatformUser } from '@ues-data/platform'
import { queryUserById, UsersApi } from '@ues-data/platform'
import { Permission, useErrorCallback, useFeatures, useStatefulAsyncQuery } from '@ues-data/shared'
import { ArrowChevronDown, ArrowChevronUp, User } from '@ues/assets'
import { PageTitlePanel, Tabs, usePageTitle, useRoutedTabsProps, useSecuredContent, useSnackbar } from '@ues/behaviours'

import { Routes } from './routes'

const useStyles = makeStyles(theme => ({
  outerContainer: {
    display: 'flex',
    flexFlow: 'column nowrap',
    width: '100%',
  },
  innerContainer: {
    height: '100%',
    margin: theme.spacing(6),
  },
  fullHeight: {
    height: '100%',
  },
  actions: {
    marginBottom: 0,
    marginRight: theme.spacing(2),
  },
  round: {
    backgroundColor: theme.palette.grey[300],
    height: 120,
    width: 120,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    width: 260,
    borderBottom: 'none',
    padding: `${theme.spacing(4)}px ${theme.spacing(6)}px`,
  },
  label: {
    wordBreak: 'break-word',
    textAlign: 'center',
  },
}))

const UserInfo: React.FC<{ userData?: PlatformUser }> = React.memo(
  ({ userData }): JSX.Element => {
    const { t } = useTranslation(['platform/common', 'general/form'])
    const theme = useTheme()
    const { round, userInfo, label } = useStyles()
    const [showSource, setShowSource] = useState(false)

    return (
      <Card variant="outlined" className={userInfo} role="heading" aria-label={t('users.details.title')}>
        <Box pb={6} display="flex" justifyContent="center">
          <div className={round}>
            <User style={{ fontSize: 60 }} htmlColor={theme.palette.background.paper} />
          </div>
        </Box>
        <Box display="flex" justifyContent="center" className={label}>
          <Typography variant="subtitle1">{userData?.displayName || userData?.emailAddress}</Typography>
        </Box>
        <Box display="flex" justifyContent="center" className={label}>
          <Typography variant="caption">{userData?.emailAddress}</Typography>
        </Box>
        <Box display="flex" justifyContent="center">
          <IconButton size="small" onClick={() => setShowSource(!showSource)}>
            {showSource ? <ArrowChevronUp /> : <ArrowChevronDown />}
          </IconButton>
        </Box>
        {showSource && (
          <Box display="flex" justifyContent="center">
            <Typography variant="caption">{t(`users.add.dataSource.${userData?.dataSource}`)}</Typography>
          </Box>
        )}
      </Card>
    )
  },
)

const UserDetails = () => {
  useSecuredContent(Permission.ECS_USERS_READ)
  const { t } = useTranslation(['platform/common', 'general/form'])
  usePageTitle(t('users.details.title'))

  const { enqueueMessage } = useSnackbar()
  const params = useParams()
  const navigate = useNavigate()
  const classNames = useStyles()

  const { loading, data: userData, error, refetch } = useStatefulAsyncQuery(queryUserById, {
    variables: {
      id: params.id,
      //fetchPolicy: 'cache-and-network',
    },
  })

  useErrorCallback(error, () => enqueueMessage(t('users.details.error.fetch'), 'error'))

  const goBack = useCallback(() => {
    navigate(-1)
  }, [navigate])

  const tabsProps = useRoutedTabsProps({ tabs: Routes, navigateProps: { replace: true } })

  return (
    <Box className={classNames.outerContainer}>
      <Box display="flex" flexDirection="column" flex="1">
        <PageTitlePanel goBack={goBack} title={[t('users.grid.allUsers'), userData?.displayName]} />
        {!loading ? (
          <Box className={classNames.innerContainer}>
            <Tabs
              tabsTitle={<UserInfo userData={userData} />}
              fullScreen
              orientation="vertical"
              {...tabsProps}
              aria-label={t('users.userTabs')}
            />
          </Box>
        ) : (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default UserDetails
