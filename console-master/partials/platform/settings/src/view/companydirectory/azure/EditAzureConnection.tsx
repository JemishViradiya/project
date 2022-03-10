/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { AxiosError } from 'axios'
import React, { memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router'

import { Backdrop, Button, CircularProgress, Tab, Tabs } from '@material-ui/core'

import type { DirectoryInstanceSyncSchedule } from '@ues-data/platform'
import {
  convertForRest,
  DirectoryApi,
  directoryNotFound,
  ONLINE_STATUS_KEY,
  queryDirectoryInstance,
  syncSettingsMap,
} from '@ues-data/platform'
import { usePrevious, useStatefulAsyncQuery, useStatefulReduxMutation } from '@ues-data/shared'
import { Permission, UnknownResourceError } from '@ues-data/shared-types'
import { HelpLinkScope, isCompleted, PageBase, TabPanel, usePlatformHelpLink } from '@ues-platform/shared'
import { FormButtonPanel, usePageTitle, useSecuredContent, useSnackbar } from '@ues/behaviours'

import { useDirectoryPermissions } from './directoryHooks'
import useStyles from './EditAzureConnectionStyles'
import { SyncScheduleTable } from './SyncScheduleTable'
import SyncSettings from './SyncSettings'
import type { DirectorySyncSettings } from './types'

const syncSettingKeys = Object.keys(syncSettingsMap)

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  }
}

const initSyncSettings = (conn): DirectorySyncSettings => {
  return syncSettingKeys.reduce((o, x) => {
    o[x] = conn[x]
    return o
  }, {}) as DirectorySyncSettings
}

const CompanyDirectoryEdit = memo(() => {
  useSecuredContent(Permission.ECS_DIRECTORY_READ)

  const { t } = useTranslation(['platform/common', 'platform/time', 'general/form'])
  usePageTitle(t('platform/common:companyDirectoryConnectionDetails'))
  const { canRead, canUpdate } = useDirectoryPermissions()

  const classes = useStyles()
  const navigate = useNavigate()
  const tabClasses = { root: classes.root }

  const params = useParams()

  const connectionLoadingState = useStatefulAsyncQuery(queryDirectoryInstance, {
    variables: { directoryInstanceId: params.id },
  })
  const prevConnectionLoadingState = usePrevious(connectionLoadingState)
  const { data: connection, error: connectionsError } = connectionLoadingState

  const [schedules, setSchedules] = useState<(DirectoryInstanceSyncSchedule & { id?: string })[]>(null)
  const [syncSettings, setSyncSettings] = useState<DirectorySyncSettings>(null)
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false)
  const [tabIndex, setTabIndex] = useState(0)
  const { enqueueMessage } = useSnackbar()

  const [editDirectoryStartAction, editTask] = useStatefulReduxMutation(DirectoryApi.mutationEditDirectory)
  const prevEditTask = usePrevious(editTask)

  useEffect(() => {
    if (connectionsError) {
      if (directoryNotFound(connectionsError as AxiosError)) {
        throw new UnknownResourceError()
      } else {
        enqueueMessage(t('directory.error.retrieveConnections'), 'error')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionsError])

  useEffect(() => {
    if (isCompleted(connectionLoadingState, prevConnectionLoadingState) && connection) {
      setSyncSettings(initSyncSettings(connection))
      setSchedules(connection.directorySyncSchedules)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionLoadingState, prevConnectionLoadingState])

  useEffect(() => {
    if (DirectoryApi.isTaskResolved(editTask, prevEditTask)) {
      if (editTask.error) {
        enqueueMessage(t('directory.error.updateConnection'), 'error')
      } else {
        goBack()
        enqueueMessage(t('form.success'), 'success')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editTask, prevEditTask])

  const handleTabChange = (_event, newValue) => {
    setTabIndex(newValue)
  }

  function onSubmit() {
    const updatedConnection = {
      ...connection,
      ...syncSettings,
      directorySyncSchedules: schedules.map(c => convertForRest(c)),
    }
    delete updatedConnection[ONLINE_STATUS_KEY]

    editDirectoryStartAction(updatedConnection)
  }

  const goBack = () => {
    navigate(-1)
  }

  const handleAddSchedule = newSchedule => setSchedules([...schedules, newSchedule])

  const handleRemoveSchedule = scheduleId => {
    setSchedules(schedules.filter(s => s.id !== scheduleId))
  }

  return (
    <PageBase
      title={t('directory.azureConnection.edit')}
      goBack={goBack}
      showSpinner={editTask?.loading}
      borderBottom={true}
      bottomPadding
      overflowAuto
      canAccess={canRead}
      helpId={usePlatformHelpLink(HelpLinkScope.DIRECTORY_CONNECTIONS)}
    >
      {schedules && syncSettings && (
        <>
          <Tabs value={tabIndex} onChange={handleTabChange}>
            <Tab label={t('directory.syncSettings.tab')} {...a11yProps(0)} classes={tabClasses} />
            <Tab label={t('directory.syncSchedule.tab')} {...a11yProps(1)} classes={tabClasses} />
          </Tabs>

          <TabPanel value={tabIndex} index={0} className={classes.tabPanel} padding>
            <SyncSettings
              syncSettings={syncSettings}
              disableSubmitButton={setSubmitButtonDisabled}
              onSettingsUpdate={setSyncSettings}
            />
          </TabPanel>
          <TabPanel value={tabIndex} index={1} className={classes.tabPanel} padding>
            <SyncScheduleTable schedules={schedules} onAddSchedule={handleAddSchedule} onRemoveSchedule={handleRemoveSchedule} />
          </TabPanel>

          <FormButtonPanel show={canUpdate}>
            <Button variant="outlined" onClick={goBack} aria-label="Cancel">
              {t('general/form:commonLabels.cancel')}
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              value="submit"
              onClick={onSubmit}
              disabled={submitButtonDisabled}
            >
              {t('general/form:commonLabels.save')}
            </Button>
          </FormButtonPanel>
        </>
      )}

      <Backdrop className={classes.backdrop} open={connectionLoadingState.loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </PageBase>
  )
})

export default CompanyDirectoryEdit
