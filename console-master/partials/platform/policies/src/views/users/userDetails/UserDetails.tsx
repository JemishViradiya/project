/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import {
  Box,
  Card,
  CircularProgress,
  FormControl,
  IconButton,
  makeStyles,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from '@material-ui/core'

import type { PlatformUser } from '@ues-data/platform'
import { queryUserById, UsersApi } from '@ues-data/platform'
import {
  FeatureName,
  Permission,
  useErrorCallback,
  useFeatures,
  usePermissions,
  usePrevious,
  useStatefulAsyncMutation,
  useStatefulAsyncQuery,
} from '@ues-data/shared'
import { HelpLinkScope, usePlatformHelpLink } from '@ues-platform/shared'
import { ArrowChevronDown, ArrowChevronUp, User } from '@ues/assets'
import {
  ConfirmationState,
  PageTitlePanel,
  Tabs,
  useConfirmation,
  usePageTitle,
  useRoutedTabsProps,
  useSecuredContent,
  useSnackbar,
} from '@ues/behaviours'

import { actionIsAllowed, isCompleted, renderDataSource, userActions, userActionsTranslations } from '../userUtils'
import { EditUserDialog } from './EditUserDialog'
import { Routes } from './routes'
import { useEditUserDialog } from './useEditUserDialog'
import { useTOTPEnrollment } from './useTOTPEnrollment'

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
            <Typography variant="caption">{renderDataSource(userData?.dataSource, t)}</Typography>
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
  const confirmation = useConfirmation()
  const { hasPermission } = usePermissions()

  const [totpEnrolled, setTotpEnrolled] = useState(false)

  const { loading, data: userData, error, refetch } = useStatefulAsyncQuery(queryUserById, {
    variables: {
      id: params.id,
      fetchPolicy: 'cache-and-network',
    },
  })
  const [deleteUsersFn, deleteUsersResponse] = useStatefulAsyncMutation(UsersApi.deleteUsers, {})
  const prevDeleteState = usePrevious(deleteUsersResponse)

  useErrorCallback(error, () => enqueueMessage(t('users.details.error.fetch'), 'error'))

  const handleDelete = useCallback(async () => {
    const confirmationState = await confirmation({
      title: t('users.delete.title'),
      description: t('users.delete.description', { user: userData?.displayName }),
      cancelButtonLabel: t('general/form:commonLabels.cancel'),
      confirmButtonLabel: t('general/form:commonLabels.delete'),
      maxWidth: 'xs',
    })

    if (confirmationState === ConfirmationState.Confirmed) {
      deleteUsersFn({
        selectionModel: { allSelected: false, selected: [params.id] },
      })
    }
  }, [deleteUsersFn, userData, params.id, confirmation, t])

  useEffect(() => {
    if (isCompleted(deleteUsersResponse, prevDeleteState)) {
      if (deleteUsersResponse.error || deleteUsersResponse.data?.failed?.length > 0) {
        // eslint-disable-next-line sonarjs/no-duplicate-string
        enqueueMessage(t('users.message.error.delete'), 'error')
      } else {
        enqueueMessage(t('users.message.success.delete'), 'success')
        navigate(-1)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteUsersResponse])

  const { openEditDialog, isEditOpen, onEditClose, onSaveEdit } = useEditUserDialog(refetch)
  const { handleRemoval } = useTOTPEnrollment(setTotpEnrolled, userData?.displayName, hasPermission)
  const [readonly, setReadonly] = useState(true)
  const { isEnabled } = useFeatures()
  const eidTOTPEnrollmentEnabled = isEnabled(FeatureName.UESTOTPEnrollmentEnabled)

  const handleSelectAction = useCallback(
    event => {
      const canUpdate = hasPermission(Permission.ECS_USERS_UPDATE)

      switch (event.target.value) {
        case userActions.REMOVE_TOTP_ENROLLMENT:
          handleRemoval()
          break
        case userActions.DELETE_USER:
          handleDelete()
          break
        case userActions.VIEW_USER_DETAILS:
          setReadonly(true)
          openEditDialog()
          break
        case userActions.EDIT_USER_DETAILS:
          setReadonly(!canUpdate)
          openEditDialog()
          break
        default:
          break
      }
    },
    [handleRemoval, handleDelete, openEditDialog, hasPermission],
  )

  const actions = (
    <FormControl variant="outlined" size="small" className={classNames.actions}>
      <Select
        id="userActions"
        displayEmpty
        renderValue={() => t('users.details.actions.title')}
        value={''}
        onChange={handleSelectAction}
      >
        {Object.values(userActions)
          .filter(action => actionIsAllowed(action, hasPermission, userData?.dataSource, totpEnrolled, eidTOTPEnrollmentEnabled))
          .map(action => (
            <MenuItem key={action} value={action}>
              {t(userActionsTranslations[action])}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  )

  const goBack = useCallback(() => {
    navigate(-1)
  }, [navigate])

  const tabsProps = useRoutedTabsProps({ tabs: Routes, navigateProps: { replace: true } })
  const cronosHelpLink = usePlatformHelpLink(HelpLinkScope.USERS)
  const helpLink = cronosHelpLink || Routes.find(route => route.path === tabsProps.value)?.helpLink

  return (
    <Box className={classNames.outerContainer}>
      <Box display="flex" flexDirection="column" flex="1">
        <PageTitlePanel
          goBack={goBack}
          title={[t('users.grid.allUsers'), userData?.displayName]}
          helpId={helpLink}
          actions={actions}
        />
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
        {userData && (
          <EditUserDialog
            open={isEditOpen}
            onClose={onEditClose}
            onSubmit={onSaveEdit}
            userDetails={userData}
            readonly={readonly}
          />
        )}
      </Box>
    </Box>
  )
}

export default UserDetails
