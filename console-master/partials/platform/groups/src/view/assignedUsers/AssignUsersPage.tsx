/* eslint-disable jsx-a11y/no-autofocus */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import {
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Paper,
  Popper,
  TextField,
  Typography,
  useTheme,
} from '@material-ui/core'

import type { GroupUser } from '@ues-data/platform'
import { GroupsApi } from '@ues-data/platform'
import { Permission, usePrevious, useStatefulApolloQuery, useStatefulReduxMutation, useStatefulReduxQuery } from '@ues-data/shared'
import { HelpLinkScope, PageBase, usePlatformHelpLink } from '@ues-platform/shared'
import { BasicCancel, BasicSearch, useInputFormControlStyles } from '@ues/assets'
import { FormButtonPanel, useSecuredContent, useSnackbar } from '@ues/behaviours'

import { listStyles, paperStyles } from '../common/styles'

const useStyles = makeStyles(theme => ({
  usersField: {
    '& .MuiInputBase-root': {
      display: 'flex',
      flexFlow: 'wrap',
      alignItems: 'center',
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      paddingRight: theme.spacing(10),
    },
    '& input': {
      padding: 0,
      height: 32, // Chip height
    },
    '& .MuiChip-root': {
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    '& .MuiInputAdornment-root': {
      position: 'absolute',
      right: theme.spacing(2),
    },
  },
}))

const AssignUsersPage = () => {
  useSecuredContent(Permission.ECS_USERS_UPDATE)
  const { groupId } = useParams()
  const { t } = useTranslation(['platform/common', 'profiles', 'general/form'])
  const navigate = useNavigate()
  const snackbar = useSnackbar()
  const { paper } = paperStyles()
  const listClasses = listStyles()
  const { root, iconButton } = useInputFormControlStyles()
  const [checked, setChecked] = React.useState({})
  const [search, setSearch] = useState<string>('')
  const textField = useRef<HTMLDivElement>()
  const { usersField } = useStyles()
  const theme = useTheme()

  const { data: group } = useStatefulReduxQuery(GroupsApi.queryGroup, { variables: groupId })

  const { data, loading } = useStatefulApolloQuery(GroupsApi.queryGroupNonMembers, {
    skip: !search,
    variables: { id: groupId, searchTerm: search && `*${search}*` },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
  })

  const [addUsersAction, addTask] = useStatefulReduxMutation(GroupsApi.mutationAddUsers)
  const prevAddTask = usePrevious(addTask)

  useEffect(() => {
    if (GroupsApi.isTaskResolved(addTask, prevAddTask)) {
      if (addTask.error) {
        snackbar.enqueueMessage(t('groups.usersTable.addUserError'), 'error')
      } else {
        snackbar.enqueueMessage(t('groups.usersTable.addUserSuccess'), 'success')
        navigate(-1)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addTask, prevAddTask])

  const handleToggle = useCallback(
    (value: GroupUser) => () => {
      const currentIndex = checked[value.id]
      const newChecked = { ...checked }

      if (currentIndex === undefined) {
        newChecked[value.id] = value
      } else {
        delete newChecked[value.id]
      }

      setChecked(newChecked)
    },
    [checked],
  )

  const deleteItem = useCallback(
    id => () => {
      const newChecked = { ...checked }
      delete newChecked[id]
      setChecked(newChecked)
    },
    [checked],
  )

  const CheckedAdronment = () => {
    return (
      <>
        {Object.values(checked).map((v: GroupUser, index) => (
          <Chip
            key={`chip-${index}`}
            size="medium"
            label={v.displayName}
            deleteIcon={<BasicCancel />}
            onDelete={deleteItem(v.id)}
            variant="outlined"
          />
        ))}
      </>
    )
  }

  return (
    <PageBase
      title={t('groups.usersTable.addUserTitle', { name: group?.name })}
      goBack={() => navigate(-1)}
      borderBottom
      padding
      showSpinner={addTask?.loading}
      helpId={usePlatformHelpLink(HelpLinkScope.USER_GROUPS)}
    >
      <Paper variant="outlined" className={paper}>
        <Typography variant="h2">{t('general/form:commonLabels.search')}</Typography>
        <TextField
          autoFocus
          fullWidth
          placeholder={t('groups.usersTable.searchPlaceholder')}
          value={search}
          onChange={e => setSearch(e.target.value)}
          classes={{ root }}
          className={usersField}
          ref={textField}
          role="search"
          InputProps={{
            startAdornment: <CheckedAdronment />,
            endAdornment: (
              <InputAdornment position="end">
                {loading ? (
                  <CircularProgress size={20} />
                ) : (
                  <IconButton classes={{ root: iconButton }} onClick={() => setSearch('')}>
                    {search ? <BasicCancel /> : <BasicSearch />}
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
        />
        <Popper
          open={!!(search && data?.groupNonMembers?.elements && data?.groupNonMembers?.elements.length > 0)}
          anchorEl={textField.current}
          placement="bottom-start"
          style={{ zIndex: theme.zIndex.modal }}
        >
          <Paper style={{ width: textField.current ? textField.current.offsetWidth : 0 }}>
            {data?.groupNonMembers && data?.groupNonMembers?.elements.length > 0 && (
              <List classes={listClasses}>
                {data?.groupNonMembers?.elements.map((user, i) => (
                  <ListItem key={user.id} button dense onClick={handleToggle(user)}>
                    <ListItemIcon>
                      <Checkbox
                        size="small"
                        checked={checked[user.id] !== undefined}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': `label_${i}` }}
                      />
                    </ListItemIcon>
                    <ListItemText id={user.id} primary={user.displayName} />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Popper>
      </Paper>
      <FormButtonPanel show={Object.keys(checked).length > 0}>
        <Button variant="contained" onClick={() => navigate(-1)}>
          {t('general/form:commonLabels.cancel')}
        </Button>
        <Button color="primary" variant="contained" onClick={() => addUsersAction({ id: groupId, users: Object.values(checked) })}>
          {t('general/form:commonLabels.save')}
        </Button>
      </FormButtonPanel>
    </PageBase>
  )
}

export default AssignUsersPage
