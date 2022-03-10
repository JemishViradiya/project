/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useContext } from 'react'

import { Box, CircularProgress, Fade, Grid, List, ListItem, ListItemText, Paper, Popper, Typography } from '@material-ui/core'

import { ConfirmationState, useConfirmation } from '@ues/behaviours'

import { AddUserContext } from '../AddUserContext'
import { USER_DETAILS_TEMPLATE } from '../USER_DETAILS_TEMPLATE'
import { useStyles } from './styles'

const UserList = props => {
  const { anchorEl, popperWidth, searchOptionsOpen, emptyResponse, handleSearchClose } = props
  const {
    searchValue,
    spinnerActive,
    fetchedUsers,
    getListItemText,
    setFormVisible,
    setSelectedUser,
    userDetails,
    setUserDetails,
    setValidForm,
    setResetGroup,
    t,
  } = useContext(AddUserContext)
  const styles = useStyles()
  const confirmation = useConfirmation()

  const handleListSelect = async user => {
    handleSearchClose()
    setFormVisible(true)
    if (user !== 'new') {
      setSelectedUser(user)
      const checkNull = str => {
        return str !== null ? str : ''
      }
      const tempUserDetails = { ...USER_DETAILS_TEMPLATE }
      Object.keys(tempUserDetails).forEach(x => {
        tempUserDetails[x] = checkNull(user[x])
      })
      setUserDetails(prevState => ({ ...prevState, ...tempUserDetails }))
    } else {
      if (
        userDetails.firstName !== '' ||
        userDetails.lastName !== '' ||
        userDetails.displayName !== '' ||
        userDetails.emailAddress !== ''
      ) {
        const confirmationState = await confirmation({
          title: t('users.add.unsaved.title'),
          description: t('users.add.unsaved.content'),
          cancelButtonLabel: t('general/form:commonLabels.cancel'),
          confirmButtonLabel: t('general/form:commonLabels.leavePage'),
        })
        if (confirmationState !== ConfirmationState.Canceled) {
          setUserDetails(prevState => ({ ...prevState, ...USER_DETAILS_TEMPLATE }))
          setSelectedUser(null)
          setValidForm(false)
        }
      } else {
        setUserDetails(prevState => ({ ...prevState, ...USER_DETAILS_TEMPLATE }))
        setSelectedUser(null)
        setValidForm(false)
        setResetGroup(true)
      }
      setUserDetails(prevState => ({ ...prevState, ...USER_DETAILS_TEMPLATE }))
      setSelectedUser(null)
      setValidForm(false)
      setResetGroup(true)
    }
  }

  const getDataSource = user => {
    return t(`users.add.dataSource.${user.dataSource}`)
  }

  return (
    <Popper id="userList" open={searchOptionsOpen} anchorEl={anchorEl} placement="bottom" transition style={{ zIndex: 2 }}>
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper>
            {searchValue !== '' && (
              <Box
                className={styles.popperPaper}
                style={{
                  width: popperWidth,
                }}
              >
                {(spinnerActive || fetchedUsers.length > 0 || emptyResponse) && (
                  <Grid container>
                    <Grid item xs={12}>
                      <List>
                        {spinnerActive && (
                          <Box display="flex" justifyContent="center">
                            <CircularProgress variant="indeterminate" size="20px" />
                          </Box>
                        )}
                        {!spinnerActive &&
                          searchValue !== '' &&
                          fetchedUsers.map((user, index) => (
                            <ListItem button dense key={index} onClick={() => handleListSelect(user)}>
                              <ListItemText>
                                <Typography variant="body2">{getListItemText(user)}</Typography>
                              </ListItemText>
                              <ListItemText className={styles.dataSourcePanel}>
                                <Typography variant="body2">{getDataSource(user)}</Typography>
                              </ListItemText>
                            </ListItem>
                          ))}
                        {emptyResponse && !spinnerActive && !fetchedUsers.length && (
                          <ListItem>
                            <ListItemText>
                              <Typography variant="subtitle1">{t('users.message.noUsersFound')}</Typography>
                            </ListItemText>
                          </ListItem>
                        )}
                      </List>
                    </Grid>
                  </Grid>
                )}
              </Box>
            )}
            <Box
              elevation={0}
              style={{
                width: popperWidth,
              }}
            >
              <ListItem button onClick={() => handleListSelect('new')} className={styles.addNewUserPanel}>
                <ListItemText className={styles.addNewUserText} primary={t('users.add.addNewUser')} />
              </ListItem>
            </Box>
          </Paper>
        </Fade>
      )}
    </Popper>
  )
}

export default UserList
