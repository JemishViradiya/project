/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { AxiosError } from 'axios'
import axios from 'axios'
import cn from 'classnames'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { Backdrop, IconButton, Link } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'

import type { DirectoryInstance } from '@ues-data/platform'
import { DIRECTORY_TYPE_KEY, DirectoryApi, USERS_AND_GROUPS } from '@ues-data/platform'
import { usePrevious, useStatefulReduxMutation, useStatefulReduxQuery } from '@ues-data/shared'
import { Permission } from '@ues-data/shared-types'
import { BasicDelete, BasicSync, I18nFormats, StatusHigh, StatusSuccess } from '@ues/assets'
import type { TableColumn } from '@ues/behaviours'
import { BasicTable, TableProvider, TableToolbar, useSecuredContent, useSnackbar, useSort } from '@ues/behaviours'

import { useDirectoryPermissions } from './azure/directoryHooks'
import { CompanyDirectoryTableActions } from './CompanyDirectoryActions'
import makeStyles from './CompanyDirectoryStyles'
import { deleteConnectionErrorMessages } from './companyDirectoryUtils'
import DeleteConnectionDialog from './dialogs/DeleteConnectionDialog'
import SyncDirectoryDialog from './dialogs/SyncDirectoryDialog'
import type { SyncStateProps } from './types'

const CANCEL_TOKEN = axios.CancelToken
let source = CANCEL_TOKEN.source()

// eslint-disable-next-line sonarjs/cognitive-complexity
const CompanyDirectory = memo(() => {
  useSecuredContent(Permission.ECS_DIRECTORY_READ)
  const { t, i18n } = useTranslation(['platform/common', 'platform/time', 'general/form'])
  const classes = makeStyles()
  const navigate = useNavigate()
  const { canUpdate, canDelete } = useDirectoryPermissions()

  const sortingProps = useSort('name', 'asc')

  const [deleteConnectionDialogProps, setDeleteConnectionDialogProps] = useState({ isOpen: false, id: '' })
  const [openSyncConnectionDialog, setOpenSyncConnectionDialog] = useState({
    isOpen: false,
    id: '',
  })
  const { enqueueMessage } = useSnackbar()

  const {
    data: connections,
    error: connectionsError,
    loading: loadingConnections,
  } = useStatefulReduxQuery(DirectoryApi.queryCompanyDirectories, { variables: { sortOrder: sortingProps.sortDirection } })

  const [removeDirectoryStartAction, removeTask] = useStatefulReduxMutation(DirectoryApi.mutationRemoveDirectory)
  const prevRemoveTask = usePrevious(removeTask)

  const [syncStartAction, syncTask] = useStatefulReduxMutation(DirectoryApi.mutationSyncDirectory)
  const prevSyncTask = usePrevious(syncTask)

  const [cancelSyncAction, cancelSyncTask] = useStatefulReduxMutation(DirectoryApi.mutationCancelSyncDirectory)
  const prevCancelSyncTask = usePrevious(cancelSyncTask)

  useEffect(() => {
    if (connectionsError) {
      enqueueMessage(t('directory.error.retrieveConnections'), 'error')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionsError])

  const handleDeleteClick = connectionId => {
    setDeleteConnectionDialogProps({ isOpen: true, id: connectionId })
  }

  const handleCloseDeleteDialog = () => {
    setDeleteConnectionDialogProps(prevState => ({
      ...prevState,
      isOpen: false,
    }))
  }

  const handleCloseSyncDialog = () => {
    setOpenSyncConnectionDialog(prevState => ({ ...prevState, isOpen: false }))
  }

  const showSuccess = () => {
    enqueueMessage(t('directory.success.deleteConnection'), 'success')
  }

  const handleSubmitSync = (connectionId, syncType) => {
    syncStartAction({ id: connectionId, type: syncType })
  }

  useEffect(() => {
    if (DirectoryApi.isTaskResolved(syncTask, prevSyncTask)) {
      if (syncTask.error) {
        enqueueMessage(t('directory.error.syncConnection'), 'error')
      }
      handleCloseSyncDialog()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncTask, prevSyncTask])

  const handleConfirmDelete = async () => {
    removeDirectoryStartAction({ id: deleteConnectionDialogProps.id })
  }

  useEffect(() => {
    if (DirectoryApi.isTaskResolved(removeTask, prevRemoveTask)) {
      if (removeTask.error) {
        const errorCode = (removeTask.error as AxiosError).response?.data?.subStatusCode
        const errorMessage = deleteConnectionErrorMessages.get(errorCode) ?? 'directory.error.deleteConnection'

        enqueueMessage(t(errorMessage), 'error')
      } else {
        showSuccess()
      }
      handleCloseDeleteDialog()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [removeTask, prevRemoveTask])

  const handleSyncClick = async connectionId => {
    setOpenSyncConnectionDialog({ isOpen: true, id: connectionId })
  }

  const cancelSync = async connectionId => {
    cancelSyncAction({ id: connectionId })
  }

  useEffect(() => {
    if (DirectoryApi.isTaskResolved(cancelSyncTask, prevCancelSyncTask)) {
      if (cancelSyncTask.error) {
        enqueueMessage(t('directory.error.syncCancel'), 'error')
      } else {
        showSuccess()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cancelSyncTask, prevCancelSyncTask])

  const handleCancelSync = (e, connectionId) => {
    e.preventDefault()
    cancelSync(connectionId)
  }

  useEffect(() => {
    source = CANCEL_TOKEN.source()
    return () => {
      source.cancel('Request cancelled')
    }
  }, [])

  function formatDate(date) {
    return i18n.format(new Date(date), I18nFormats.DateTime)
  }

  function renderSyncButton(connection: DirectoryInstance) {
    const connectionId = connection.id
    const connectionName = connection.name
    return (
      <>
        {canUpdate && (
          <IconButton size="small" title={t('directory.sync.action.start')} onClick={() => handleSyncClick(connectionId)}>
            <BasicSync key={connectionId} />
          </IconButton>
        )}
        {openSyncConnectionDialog.isOpen && openSyncConnectionDialog.id === connectionId && (
          <SyncDirectoryDialog
            connectionId={connectionId}
            connectionName={connectionName}
            open={openSyncConnectionDialog.isOpen}
            defaultSyncType={USERS_AND_GROUPS}
            onCancel={handleCloseSyncDialog}
            onSubmit={handleSubmitSync}
          />
        )}
      </>
    )
  }

  function renderDeleteButton(connection) {
    return (
      canDelete && (
        <>
          <IconButton size="small" title={t('directory.removeConnection')} onClick={() => handleDeleteClick(connection.id)}>
            <BasicDelete key={connection.id} />
          </IconButton>
          {deleteConnectionDialogProps.id === connection.id && (
            <DeleteConnectionDialog
              connectionId={connection.id}
              connectionName={connection.name}
              open={deleteConnectionDialogProps.isOpen}
              onClose={handleCloseDeleteDialog}
              onConfirmDelete={handleConfirmDelete}
            />
          )}
        </>
      )
    )
  }

  const SyncState: React.FC<SyncStateProps> = React.memo(({ connection }) => {
    const syncStatus = connection['syncStatus']
    if (typeof syncStatus === 'undefined' || typeof syncStatus.syncState === 'undefined') return <>&nbsp;</>
    // syncStatus.syncState = 'CANCELED' // DEBUG
    if (syncStatus.syncState === 'RUNNING') {
      return (
        <>
          <div className={classes.syncStateDiv}>
            <CircularProgress
              variant="indeterminate"
              className={cn(classes.img, classes.circularProgress)}
              size="20px"
              title={t(`directory.sync.state.RUNNING`)}
            />
            <Typography className={classes.syncStatusLabel}>{t(`directory.sync.state.${syncStatus.syncState}`)}</Typography>
          </div>
          {canUpdate && (
            <Link
              title={t('directory.sync.action.cancel')}
              role="link"
              onClick={e => handleCancelSync(e, connection.id)}
              key={connection.id}
              className={classes.link}
            >
              {t('general/form:commonLabels.cancel')}
            </Link>
          )}
        </>
      )
    } else {
      if (syncStatus.syncState === 'SUCCEEDED') {
        return (
          <span className={classes.syncStatusImg} title={t(`directory.sync.state.SUCCEEDED`)}>
            <StatusSuccess key={connection.id} className={cn(classes.img, classes.success)} />
            <Typography display="inline">{syncStatus.syncEnd ? formatDate(syncStatus.syncEnd) : ''}</Typography>
          </span>
        )
      } else if (syncStatus.syncState === 'FAILED' || syncStatus.syncState === 'CANCELED') {
        return (
          <span className={classes.syncStatusImg} title={t(`directory.sync.state.FAILED`)}>
            <StatusHigh key={connection.id} className={cn(classes.img, classes.error)} />
            <Typography display="inline">{syncStatus.syncStart ? formatDate(syncStatus.syncStart) : ''}</Typography>
          </span>
        )
      } else {
        console.error('Unknown sync state ' + syncStatus.syncState)

        return <Typography variant="h4"> {syncStatus.syncState}</Typography>
      }
    }
  })

  const renderName = useCallback((rowData, navigate) => {
    return (
      <Link
        key={rowData.name}
        onClick={() => {
          navigate(`/companyDirectory/azure/${rowData.id}`)
        }}
      >
        {rowData.name}
      </Link>
    )
  }, [])

  const renderType = (rowData, t) => {
    return <>{t('directory.type.' + rowData[DIRECTORY_TYPE_KEY])}</>
  }

  const renderSyncState = rowData => {
    return <SyncState connection={rowData} />
  }

  const COLUMNS: TableColumn[] = useMemo(
    () => [
      {
        label: t('directory.tableHeader.connection'),
        dataKey: 'name',
        width: 40,
        renderCell: data => renderName(data, navigate),
        persistent: true,
        sortable: true,
      },
      {
        label: t('directory.tableHeader.type'),
        dataKey: 'type',
        renderCell: data => renderType(data, t),
        persistent: true,
      },
      {
        label: t('directory.tableHeader.lastSync'),
        dataKey: 'syncState',
        renderCell: data => renderSyncState(data),
        persistent: true,
      },
      {
        label: t('directory.tableHeader.sync'),
        dataKey: 'syncAction',
        renderCell: data => renderSyncButton(data),
        persistent: true,
        icon: true,
      },
      {
        dataKey: 'action',
        renderCell: data => renderDeleteButton(data),
        icon: true,
        align: 'right',
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [renderName, renderSyncButton, renderSyncState, t],
  )
  const idFunction = rowData => rowData.id

  const onAdd = () => {
    navigate(`/companyDirectory/azure`)
  }

  return (
    <>
      <Typography paragraph align="left" className={classes.descriptionLabel}>
        {t('directory.description')}
      </Typography>
      <TableProvider
        basicProps={{ columns: COLUMNS, idFunction: idFunction, loading: loadingConnections }}
        sortingProps={sortingProps}
      >
        <TableToolbar begin={<CompanyDirectoryTableActions onAdd={onAdd} />} />

        <BasicTable noDataPlaceholder={t('noData')} data={connections ?? []} title={t('directory.tableTitle')} />
      </TableProvider>

      <Backdrop className={classes.backdrop} open={removeTask?.loading || syncTask?.loading || cancelSyncTask?.loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
})

export default CompanyDirectory
