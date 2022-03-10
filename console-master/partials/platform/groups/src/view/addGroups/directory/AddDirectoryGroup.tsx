/* eslint-disable jsx-a11y/no-autofocus */
import React, { memo, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import {
  CircularProgress,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Paper,
  Popper,
  TextField,
  Typography,
} from '@material-ui/core'

import type { Group } from '@ues-data/platform'
import { GroupsApi, queryDirectoryInstance } from '@ues-data/platform'
import { Permission, usePrevious, useStatefulAsyncQuery, useStatefulReduxMutation, useStatefulReduxQuery } from '@ues-data/shared'
import { HelpLinkScope, PageBase, usePlatformHelpLink } from '@ues-platform/shared'
import { BasicCancel, useInputFormControlStyles } from '@ues/assets'
import { useSecuredContent, useSnackbar } from '@ues/behaviours'

import { DirectoryGroupSection } from '../../common/DirectoryGroupSection'
import { listStyles, paperStyles } from '../../common/styles'
import { useDelayedProfileAssignment } from '../../common/useDelayedProfileAssignment'

const SearchDirectory: React.FC<{ onDirectorySelected: (d) => void }> = memo(({ onDirectorySelected }) => {
  const { t } = useTranslation(['platform/common', 'profiles', 'general/form'])
  const { paper } = paperStyles()
  const listClasses = listStyles()
  const { root, iconButton } = useInputFormControlStyles()
  const [search, setSearch] = useState<string>('')
  const textField = useRef<HTMLDivElement>()

  const { data, loading } = useStatefulReduxQuery(GroupsApi.queryDirectoryGroups, { variables: search })

  return (
    <Paper variant="outlined" className={paper}>
      <Typography variant="h2">{t('general/form:commonLabels.search')}</Typography>
      <TextField
        autoFocus
        fullWidth
        placeholder={t('groups.add.directory.searchPlaceholder')}
        className="no-label"
        value={search}
        onChange={e => setSearch(e.target.value)}
        classes={{ root }}
        ref={textField}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {loading ? (
                <CircularProgress />
              ) : (
                <IconButton classes={{ root: iconButton }} onClick={() => setSearch('')}>
                  {search && <BasicCancel />}
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
      />
      <Popper open={!!(search && data && data.length > 0)} anchorEl={textField.current} placement="bottom-start">
        <Paper style={{ width: textField.current ? textField.current.offsetWidth : 0 }}>
          {data && data.length > 0 && (
            <List classes={listClasses}>
              {data.map((dir, i) => (
                <ListItem
                  key={dir.dataSourceGroupId}
                  button
                  dense
                  onClick={() =>
                    onDirectorySelected({
                      name: dir.name,
                      dataSourceConnectionId: dir.dataSourceConnectionId,
                      dataSourceGroupId: dir.dataSourceGroupId,
                      dataSourceName: dir.directorySourceName,
                    })
                  }
                >
                  <ListItemText id={dir.dataSourceGroupId} primary={dir.name} />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Popper>
    </Paper>
  )
})

const AddDirectoryGroup = () => {
  useSecuredContent(Permission.ECS_USERS_CREATE)
  const { t } = useTranslation(['platform/common', 'profiles', 'general/form'])
  const navigate = useNavigate()
  const [directoryGroup, setDirectoryGroup] = useState<Group>(null)
  const snackbar = useSnackbar()
  const policiesProps = useDelayedProfileAssignment()

  const { data: directoryInstance, loading: directoryLoading } = useStatefulAsyncQuery(queryDirectoryInstance, {
    variables: { directoryInstanceId: directoryGroup?.dataSourceConnectionId },
  })

  const [createGroupsAction, createTask] = useStatefulReduxMutation(GroupsApi.mutationCreateGroup)
  const prevCreateTask = usePrevious(createTask)

  useEffect(() => {
    if (GroupsApi.isTaskResolved(createTask, prevCreateTask)) {
      if (createTask.error) {
        snackbar.enqueueMessage(t('groups.create.errorMessage'), 'error')
      } else {
        snackbar.enqueueMessage(t('groups.create.successMessage'), 'success')
        navigate(-1)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createTask, prevCreateTask])

  return (
    <PageBase
      title={t('groups.add.directory.title')}
      goBack={() => navigate(-1)}
      borderBottom
      padding
      showSpinner={directoryLoading || createTask?.loading}
      helpId={usePlatformHelpLink(HelpLinkScope.USER_GROUPS)}
    >
      {!directoryGroup && <SearchDirectory onDirectorySelected={setDirectoryGroup} />}
      {directoryGroup && directoryInstance && (
        <DirectoryGroupSection
          group={directoryGroup}
          isOnboardingSupported={directoryInstance?.syncEnableOnboarding}
          onSubmitAction={createGroupsAction}
          policiesProps={policiesProps}
        />
      )}
    </PageBase>
  )
}

export default AddDirectoryGroup
