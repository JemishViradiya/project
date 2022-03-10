/* eslint-disable react-hooks/exhaustive-deps */
/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import cn from 'classnames'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { Backdrop, Box, Button, IconButton, Link, Typography } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'

import type { Connections } from '@ues-data/emm'
import { ConnectionApi } from '@ues-data/emm'
import {
  Permission,
  usePermissions,
  usePrevious,
  useStatefulAsyncQuery,
  useStatefulReduxMutation,
  useStatefulReduxQuery,
} from '@ues-data/shared'
import { BasicDelete, HelpLinks, StatusHigh, StatusSuccess } from '@ues/assets'
import type { TableColumn } from '@ues/behaviours'
import {
  BasicTable,
  ContentArea,
  ContentAreaPanel,
  PageTitlePanel,
  SecuredContent,
  TableProvider,
  TableToolbar,
  usePageTitle,
  useSnackbar,
  useSort,
} from '@ues/behaviours'

import { AddConnections } from './add/AddConnections'
import DeleteConnectionDialog from './DeleteConnectionDialog'
import makeStyles from './EmmConnectionsStyles'
import ForceDeleteConnectionDialog from './ForceDeleteConnectionDialog'

// eslint-disable-next-line sonarjs/cognitive-complexity
const EmmConnections = memo(() => {
  const { t } = useTranslation(['emm/connection'])

  usePageTitle(t('emm.page.title'))
  const [deleteConnectionDialogProps, setDeleteConnectionDialogProps] = useState({ isOpen: false, connectionType: '' })
  const [forceDeleteConnectionDialogProps, setForceDeleteConnectionDialogProps] = useState({
    isOpen: false,
    connectionType: '',
  })
  const { enqueueMessage } = useSnackbar()
  const classes = makeStyles()
  const navigate = useNavigate()

  const sortingProps = useSort('type', 'asc')
  const { data: connectionsResponse, loading: connectionLoading, error: connectionsError } = useStatefulReduxQuery(
    ConnectionApi.queryConnections,
  )
  const [connections, setConnections] = useState([])
  const [timer, setTimer] = useState(null)
  const [connectionType, setConnectionType] = useState('')
  const [removeConnectionAction, removeTask] = useStatefulReduxMutation(ConnectionApi.mutationRemoveConnection)
  const prevRemoveTask = usePrevious(removeTask)

  const [retryConnectionAction, retryTask] = useStatefulReduxMutation(ConnectionApi.mutationRetryConnections)
  const prevRetryTask = usePrevious(retryTask)
  const { data: searchResponse, error: searchError } = useStatefulAsyncQuery(ConnectionApi.queryConnectionsAsync, {
    variables: { type: connectionType },
  })

  const { hasPermission } = usePermissions()
  const hasCreatePermission = hasPermission(Permission.ECS_MDM_CREATE)
  const hasDeletePermission = hasPermission(Permission.ECS_MDM_DELETE)
  const hasUpdatePermission = hasPermission(Permission.ECS_MDM_UPDATE)

  useEffect(() => {
    if (searchResponse && searchResponse !== undefined) {
      setConnectionType('')
      let conn = [...connections]
      conn = conn.map(item => {
        if (item.type === searchResponse.type) {
          return searchResponse
        } else {
          return item
        }
      })
      setConnections(conn)
    }
  }, [searchResponse])

  useEffect(() => {
    if (searchError) {
      enqueueMessage(t('emm.page.error.retrieveConnection', { type: connectionType }), 'error')
    }
  }, [searchError])

  useEffect(() => {
    if (connectionsError) {
      enqueueMessage(t('emm.page.error.retrieveConnections'), 'error')
    }
  }, [connectionsError])

  const processConnectionResponse = () => {
    const connectionArr = []
    if (connectionsResponse['status'] === 207) {
      for (const connResponse of Array.from(connectionsResponse['data'].responses)) {
        connectionArr.push(connResponse['body'])
      }
    } else {
      return connectionsResponse['data']
    }
    return connectionArr
  }

  useEffect(() => {
    setConnections(connectionsResponse ? processConnectionResponse() : [])
  }, [connectionsResponse])

  const isValidRecord = rowData => {
    return Object.prototype.hasOwnProperty.call(rowData, 'activationType')
  }

  useEffect(() => {
    if (connections) {
      connections.forEach(connection => {
        if (
          connection &&
          connection.type &&
          connection.type === 'UEM' &&
          connection.configuration &&
          connection.configuration.state === 'ERROR' &&
          connection.configuration.errorState
        ) {
          enqueueMessage(
            t('emm.table.data.state.error.message.' + connection.configuration.errorState, {
              uemTenantId: connection.configuration.uemTenantId,
            }),
            'error',
          )
        }

        if (
          connection &&
          connection.type &&
          connection.type === 'UEM' &&
          connection.configuration &&
          ['INITIALIZED', 'AUTHORIZED'].includes(connection.configuration.state)
        ) {
          if (timer) {
            clearTimeout(timer)
          }
          const newTimer = setTimeout(() => {
            setConnectionType(connection.type)
          }, 5000)
          setTimer(newTimer)
        } else {
          setTimer(null)
        }
      })
    }
    return () => clearTimeout(timer)
  }, [connections])

  const clearReduxState = () => connectionsResponse && (connectionsResponse['data'] = [])

  const SuccessStateComponent = useCallback(() => {
    return (
      <span className={classes.syncStateDiv} title={t('emm.table.data.state.success')}>
        <StatusSuccess className={cn(classes.img, classes.success)} />
        <Typography>{t('emm.table.data.state.success')}</Typography>
      </span>
    )
  }, [])
  const InProgressStateComponent = useCallback(() => {
    return (
      <div className={classes.syncStateDiv}>
        <CircularProgress
          variant="indeterminate"
          className={cn(classes.img, classes.circularProgress)}
          size="20px"
          title={t('emm.table.data.state.inProgress')}
        />
        <Typography>{t('emm.table.data.state.inProgress')}</Typography>
      </div>
    )
  }, [])
  const ErrorStateComponent = useCallback(attributes => {
    const requireRetry = attributes.requireRetry
    const connection = attributes.connection
    return (
      <div className={classes.syncStateDiv}>
        <span className={classes.syncStateDiv} title={t(`emm.table.data.state.error.default`)}>
          <StatusHigh className={cn(classes.img, classes.error)} />
          <Typography>{t('emm.table.data.state.error.default')}</Typography>
        </span>
        {requireRetry ? (
          <Link
            className={classes.syncStatusLink}
            onClick={() => {
              retryConnection(connection)
            }}
          >
            {t('emm.table.data.state.retry')}
          </Link>
        ) : null}
      </div>
    )
  }, [])

  const renderName = rowData => {
    if (isValidRecord(rowData)) {
      const tenantId =
        rowData.type === 'INTUNE'
          ? rowData.configuration.aadTenantName && rowData.configuration.aadTenantName !== null
            ? rowData.configuration.aadTenantName
            : rowData.configuration.aadTenantId
          : rowData.configuration.uemTenantId
      return <Typography variant="body2">{tenantId}</Typography>
    } else {
      return <Typography variant="body2">-</Typography>
    }
  }

  const renderType = (rowData, t) => {
    return <>{t('emm.page.connection.type.' + rowData.type.toLowerCase())}</>
  }

  const renderStatus = rowData => {
    if (isValidRecord(rowData)) {
      if (rowData && rowData.type && rowData.type === 'INTUNE') {
        return <SuccessStateComponent />
      } else if (rowData && rowData.type && rowData.type === 'UEM') {
        switch (rowData.configuration.state) {
          case 'ACTIVE':
            return <SuccessStateComponent />
          case 'INITIALIZED':
            return <InProgressStateComponent />
          case 'AUTHORIZED':
            return <InProgressStateComponent />
          case 'ERROR':
            return <ErrorStateComponent requireRetry={true} connection={rowData} />
          default:
            return <ErrorStateComponent />
        }
      }
    } else {
      return <ErrorStateComponent />
    }
  }

  useEffect(() => {
    if (ConnectionApi.isTaskResolved(retryTask, prevRetryTask) && retryTask.error) {
      try {
        const error = JSON.parse(retryTask.error.message)
        if (error['status']) {
          enqueueMessage(t('server.error.retry.addFailed'), 'error')
        }
      } catch (error) {
        if (retryTask?.error && retryTask.error['config']?.method === 'delete') {
          enqueueMessage(t('server.error.retry.default'), 'error')
        } else {
          enqueueMessage(t('server.error.retry.addFailed'), 'error')
        }
      }
    }
  }, [retryTask, prevRetryTask])

  useEffect(() => {
    if (ConnectionApi.isTaskResolved(removeTask, prevRemoveTask)) {
      if (removeTask.error) {
        const deleteConnectionErrorMessage = t('emm.page.error.deleteConnection', {
          connectionName: deleteConnectionDialogProps.connectionType,
        })
        enqueueMessage(deleteConnectionErrorMessage, 'error')
        switch (deleteConnectionDialogProps.connectionType) {
          case 'INTUNE':
            handleForceDeleteClick()
            break
          case 'UEM':
            if (
              removeTask.error['response'] &&
              removeTask.error['response']['status'] &&
              removeTask.error['response']['status'] === 418
            ) {
              handleForceDeleteClick()
            }
            if (timer) {
              setConnectionType('UEM')
            }
            break
        }
      } else {
        enqueueMessage(t('emm.delete.success'), 'success')
        handleCloseForceDeleteDialog()
      }
      handleCloseDeleteDialog()
    }
  }, [removeTask, prevRemoveTask])

  const handleForceDeleteClick = () => {
    setForceDeleteConnectionDialogProps({ isOpen: true, connectionType: deleteConnectionDialogProps.connectionType })
  }
  const handleCloseForceDeleteDialog = () => {
    setForceDeleteConnectionDialogProps(prevState => ({
      ...prevState,
      isOpen: false,
    }))
  }
  const handleConfirmForceDelete = async () => {
    if (deleteConnectionDialogProps.connectionType === 'UEM' && timer) {
      clearTimeout(timer)
    }
    removeConnectionAction({ type: forceDeleteConnectionDialogProps.connectionType, force: true })
  }

  const handleDeleteClick = connectionType => {
    setDeleteConnectionDialogProps({ isOpen: true, connectionType: connectionType })
  }

  const handleCloseDeleteDialog = () => {
    setDeleteConnectionDialogProps(prevState => ({
      ...prevState,
      isOpen: false,
    }))
  }

  const handleConfirmDelete = async () => {
    if (deleteConnectionDialogProps.connectionType === 'UEM' && timer) {
      clearTimeout(timer)
    }
    removeConnectionAction({ type: deleteConnectionDialogProps.connectionType, force: false })
  }

  function renderDeleteButton(rowData) {
    const connectionType = rowData.type
    return (
      <>
        {hasDeletePermission ? (
          <IconButton size="small" key={connectionType} onClick={e => handleDeleteClick(connectionType)}>
            <BasicDelete />
          </IconButton>
        ) : null}
        {deleteConnectionDialogProps.connectionType === connectionType && (
          <DeleteConnectionDialog
            connectionType={connectionType}
            open={deleteConnectionDialogProps.isOpen}
            onClose={handleCloseDeleteDialog}
            onConfirmDelete={handleConfirmDelete}
          />
        )}
      </>
    )
  }

  const renderAppConfig = (rowData: Connections) => {
    if (hasUpdatePermission && rowData.type === 'INTUNE' && isValidRecord(rowData) && rowData.activationType === 'MDM') {
      return (
        <Button
          color="primary"
          variant="contained"
          key={rowData.type}
          onClick={() => {
            clearReduxState()
            navigate(window.location.hash.substring(1) + '/intune/appconfig')
          }}
        >
          {t('emm.page.connection.generateAppConfigButton')}
        </Button>
      )
    } else {
      return
    }
  }

  const COLUMNS: TableColumn[] = useMemo(
    () => [
      {
        label: t('emm.table.tenant'),
        dataKey: 'serverName',
        width: 40,
        renderCell: data => renderName(data),
        persistent: false,
        sortable: false,
      },
      {
        label: t('emm.table.type'),
        dataKey: 'type',
        renderCell: data => renderType(data, t),
        persistent: false,
        sortable: false,
      },
      {
        label: t('emm.table.status'),
        dataKey: 'status',
        renderCell: data => renderStatus(data),
        persistent: false,
      },
      {
        dataKey: 'activationType',
        renderCell: data => renderAppConfig(data),
        persistent: false,
        icon: false,
      },
      {
        dataKey: 'action',
        renderCell: data => renderDeleteButton(data),
        icon: true,
        align: 'right',
      },
    ],
    [renderAppConfig, renderDeleteButton, renderName, t],
  )

  const idFunction = rowData => rowData.id

  const retryConnection = connection => {
    retryConnectionAction({ newConnection: connection })
  }

  return (
    <>
      <Box className={classes.outerContainer}>
        <PageTitlePanel title={[t('SettingsLabel'), t('emm.page.title')]} helpId={HelpLinks.EmmConnection} />
        <ContentArea>
          <SecuredContent requiredPermissions={Permission.ECS_MDM_READ}>
            <ContentAreaPanel fullWidth>
              <TableProvider basicProps={{ columns: COLUMNS, idFunction: idFunction }} sortingProps={sortingProps}>
                {hasCreatePermission && (
                  <TableToolbar begin={<AddConnections connections={connections} clearReduxState={clearReduxState} />} />
                )}
                <BasicTable noDataPlaceholder={t('noData')} data={connections} />
              </TableProvider>
            </ContentAreaPanel>
          </SecuredContent>
        </ContentArea>
      </Box>
      <Backdrop className={classes.backdrop} open={removeTask?.loading || connectionLoading || retryTask?.loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <ForceDeleteConnectionDialog
        connectionType={forceDeleteConnectionDialogProps.connectionType}
        open={forceDeleteConnectionDialogProps.isOpen}
        onClose={handleCloseForceDeleteDialog}
        onConfirmDelete={handleConfirmForceDelete}
      />
    </>
  )
})

export default EmmConnections
