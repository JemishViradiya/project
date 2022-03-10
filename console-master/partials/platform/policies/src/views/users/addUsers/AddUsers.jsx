/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import axios from 'axios'
import cn from 'classnames'
import { CONFLICT } from 'http-status-codes'
import { debounce } from 'lodash-es'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { Box, Card, CircularProgress, Container, Grid, Link, Typography, useTheme } from '@material-ui/core'

import { queryDirectoryConfigured, queryDirectoryUsers, UsersApi } from '@ues-data/platform'
import { Permission, useStatefulAsyncMutation, useStatefulAsyncQuery, useUesSession } from '@ues-data/shared'
import { HelpLinkScope, PageBase, usePlatformHelpLink } from '@ues-platform/shared'
import { HelpLinks, useHelpLink, useMuiPaperDefaultWidthStyles } from '@ues/assets'
import { TransferList, useSecuredContent, useSnackbar } from '@ues/behaviours'

import { prepareUserData } from '../userUtils'
import { AddUserContext } from './AddUserContext'
import AdditionalUserDetailsForm from './forms/AdditionalUserDetailsForm'
import SaveButtons from './forms/SaveButtons'
import SearchBar from './forms/SearchBar'
import SelectUserDialog from './forms/SelectUserDialog'
import UserDetailsForm from './forms/UserDetailsForm'
import { useStyles } from './styles'
import { USER_DETAILS_TEMPLATE } from './USER_DETAILS_TEMPLATE'
import { useTransferListProps } from './useTransferListProps'

const FETCH_ERROR_MESSAGE = 'users.message.error.fetch'
const FETCH_GROUPS_ERROR_MESSAGE = 'users.details.configuration.groups.errors.fetchUser'
const CANCEL_TOKEN = axios.CancelToken
var source = CANCEL_TOKEN.source()

const AddUsers = () => {
  useSecuredContent(Permission.ECS_USERS_CREATE)
  const directoryInfoURL = useHelpLink(HelpLinks.DirectoryInfo)
  const { tenantId } = useUesSession()
  const navigate = useNavigate()
  const styles = useStyles()
  const { t } = useTranslation(['platform/common', 'platform/validation', 'general/form'])
  const [formVisible, setFormVisible] = useState(false)
  const [userDetails, setUserDetails] = useState({ ...USER_DETAILS_TEMPLATE })
  const [selectedUser, setSelectedUser] = useState(null)
  const [fetchedUsers, setFetchedUsers] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [validForm, setValidForm] = useState(false)
  const [selectUserDialogOpen, setSelectUserDialogOpen] = useState(false)
  const [selectUserDialogOptions, setSelectUserDialogOptions] = useState([])
  const { enqueueMessage } = useSnackbar()
  const theme = useTheme()
  const [search, setSearch] = useState(null)
  const [newUser, setNewUser] = useState(false)
  const [emptyResponse, setEmptyResponse] = useState(false)
  const [assignedGroups, setAssignedGroups] = useState([])
  const [resetGroup, setResetGroup] = useState(false)

  const { data: directoryConfigured, loading: loadingDirectoryConfigured } = useStatefulAsyncQuery(queryDirectoryConfigured)

  const { data, loading: directoryUsersLoading, error, refetch } = useStatefulAsyncQuery(queryDirectoryUsers, {
    variables: { tenantId, search },
    skip: !search,
  })

  const { data: dataGroups, error: loadGroupsError, refetch: refetchGroups } = useStatefulAsyncQuery(UsersApi.getNonDirectoryGroups)

  const updateSearch = value => {
    if (!value) {
      setEmptyResponse(false)
      return setFetchedUsers([])
    }
    value === search ? refetch() : setSearch(value)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchUsers = useCallback(debounce(updateSearch, 500), [search])

  useEffect(() => {
    fetchUsers()
    // Cancel the debounce on useEffect cleanup.
    return fetchUsers.cancel
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, fetchUsers])

  useEffect(() => {
    if (search === userDetails.emailAddress) {
      if (data?.length > 0) {
        setSelectUserDialogOpen(true)
        setSelectUserDialogOptions(data)
      } else {
        postData(
          {
            ...userDetails,
            dataSource: 'cur',
            username: userDetails.emailAddress, //The details for this change are described in Jira issue:"https://jirasd.rim.net/browse/UES-2746https://jirasd.rim.net/browse/UES-2746"
            country: 'CA',
            suppressEmail: true, // The details for this change are described in Jira issue:"https://jirasd.rim.net/browse/UES-5258"
          },
          newUser,
        )
      }
    } else if (data && data.length > 0) {
      setEmptyResponse(false)
      setFetchedUsers(data)
    } else {
      setEmptyResponse(!directoryUsersLoading)
    }
    if (error) {
      enqueueMessage(t(FETCH_ERROR_MESSAGE), 'error')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error])

  useEffect(() => {
    source = CANCEL_TOKEN.source()
    return () => {
      source.cancel(t('requestCanceled'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const clearSearch = () => {
    setSearchValue('')
    setFetchedUsers([])
    fetchUsers('')
    setFormVisible(false)
    setSelectedUser(null)
    setUserDetails({ ...USER_DETAILS_TEMPLATE })
    setAssignedGroups([])
  }

  const [createUser, createUserState] = useStatefulAsyncMutation(UsersApi.createUser, {})
  const [addUserToGroupsAction] = useStatefulAsyncMutation(UsersApi.addUserToGroups, {})

  const globalLoading = useMemo(() => {
    return createUserState?.loading || (directoryUsersLoading && search === userDetails.emailAddress)
  }, [createUserState, directoryUsersLoading, search, userDetails])

  const postData = (userData, addNewUser) => {
    const user = prepareUserData(userData)

    createUser({ user })
      .then(data => {
        clearSearch()
        if (addNewUser) {
          setSelectedUser(null)
        } else {
          navigate('/users')
        }
        if (data?.error) {
          if (data?.error?.response?.status === CONFLICT) {
            return handleReject('conflict')
          } else {
            return handleReject()
          }
        }
        if (assignedGroups.length) {
          addUserToGroupsAction({ userId: data.data.id, groups: assignedGroups })
        }
        enqueueMessage(t('users.message.success.create'), 'success')
      })
      .catch(handleReject)
  }

  const handleReject = (suffix = 'submit') => {
    setSelectedUser(null)
    enqueueMessage(t(`users.message.error.${suffix}`), 'error')
    console.log(t(`users.message.error.${suffix}`) + error)
  }

  const postUser = addNewUser => {
    setNewUser(addNewUser)
    const user =
      selectedUser === null
        ? {
            ...userDetails,
            dataSource: 'cur',
            username: userDetails.emailAddress, // The details for this change are described in Jira issue:"https://jirasd.rim.net/browse/UES-2746https://jirasd.rim.net/browse/UES-2746"
            country: 'CA',
            suppressEmail: true, // The details for this change are described in Jira issue:"https://jirasd.rim.net/browse/UES-5258"
          }
        : selectedUser.dataSource === 'cur'
        ? { ...selectedUser, username: selectedUser.emailAddress, suppressEmail: true }
        : selectedUser
    if (selectedUser !== null) {
      postData(user, addNewUser)
    } else {
      setSearch(user.emailAddress)
      if (user.emailAddress === search) {
        refetch()
      }
    }
  }

  const getListItemText = user => {
    const values = [user.displayName, `(${user.emailAddress})`]
    return values.filter(x => x !== null).join(' ')
  }

  const goBack = () => {
    navigate('/')
  }

  const transferListProps = useTransferListProps({
    setAssignedGroups,
    selectedUser,
    dataGroups,
    resetGroup,
    loadGroupsError,
    newUser,
    handleError: () => {
      enqueueMessage(t(FETCH_GROUPS_ERROR_MESSAGE), 'error')
      refetchGroups()
    },
  })

  const classes = useMuiPaperDefaultWidthStyles(theme)

  const TransferListComponent = useCallback(() => {
    setResetGroup(false)
    return <TransferList {...transferListProps} />
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transferListProps.allValues, transferListProps.rightVallues])

  return (
    <PageBase
      title={t('users.add.title')}
      goBack={goBack}
      showSpinner={globalLoading}
      borderBottom
      padding
      bottomPadding
      helpId={usePlatformHelpLink(HelpLinkScope.USERS)}
    >
      {loadingDirectoryConfigured ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <AddUserContext.Provider
          value={{
            selectedUser: selectedUser,
            setSelectedUser: setSelectedUser,
            userDetails: userDetails,
            setUserDetails: setUserDetails,
            searchValue: searchValue,
            setSearchValue: setSearchValue,
            spinnerActive: directoryUsersLoading,
            fetchedUsers: fetchedUsers,
            setFormVisible: setFormVisible,
            setValidForm: setValidForm,
            fetchUsers: fetchUsers,
            resetFetchedUsers: () => setFetchedUsers([]),
            postData: postData,
            getListItemText: getListItemText,
            clearSearch: clearSearch,
            setResetGroup: setResetGroup,
            t: t,
            emptyResponse: emptyResponse,
          }}
        >
          <Card classes={{ ...classes }} variant="outlined">
            <SelectUserDialog
              selectUserDialogOpen={selectUserDialogOpen}
              setSelectUserDialogOpen={setSelectUserDialogOpen}
              selectUserDialogOptions={selectUserDialogOptions}
            />
            <Container className={styles.container}>
              <Grid container align="left">
                {directoryConfigured && <SearchBar />}
                {(formVisible || !directoryConfigured) && (
                  <>
                    <Grid item xs={12}>
                      <Box pt={1} className={cn({ [styles.detailsTitle]: !directoryConfigured })}>
                        <Typography variant="h2">{t('users.add.userDetails')}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={7}>
                      <Grid container>
                        <UserDetailsForm
                          userDetails={userDetails}
                          editable={!selectedUser}
                          setUserDetails={setUserDetails}
                          setValidForm={setValidForm}
                        />
                      </Grid>
                    </Grid>
                    {!directoryConfigured && (
                      <Box display="flex" justifyContent="flex-end" width="100%" mt={3}>
                        <Typography variant="body2">
                          <Link target="_blank" href={directoryInfoURL}>
                            {t('users.add.directoryHelp.link')}
                          </Link>
                        </Typography>
                      </Box>
                    )}
                    {selectedUser && <AdditionalUserDetailsForm userDetails={userDetails} />}
                  </>
                )}
              </Grid>
            </Container>
          </Card>
          {(formVisible || !directoryConfigured) && (
            <Box mt={6}>
              <Card classes={{ ...classes }} variant="outlined">
                <Typography variant="h2" gutterBottom>
                  {t('users.add.groups.heading')}
                </Typography>
                <TransferListComponent />
              </Card>
            </Box>
          )}
          <SaveButtons postUser={postUser} disabled={!validForm || globalLoading || !userDetails?.emailAddress} />
        </AddUserContext.Provider>
      )}
    </PageBase>
  )
}

export default AddUsers
