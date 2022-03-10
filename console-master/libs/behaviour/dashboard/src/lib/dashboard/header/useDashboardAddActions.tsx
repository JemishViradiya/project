/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { ReactNode } from 'react'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { UseControlledDialogProps } from '@ues/behaviours'
import { useControlledDialog, useSnackbar } from '@ues/behaviours'

import { MenuListItem } from '../widgets/MenuListItem'
import { useDashboardWidgets } from './../DashboardProvider'
import type { DashboardProps } from './../types'
import { AddNewDashboardDialog } from './AddNewDashboardDialog'
import { CopyDashboardDialog } from './CopyDashboardDialog'

const MAX_ALLOWED_DASHBOARDS = 10

export const useDashboardAddActions = (outOfBoxConfigs?: DashboardProps[]): ReactNode[] => {
  const { t } = useTranslation('dashboard')
  const snackbar = useSnackbar()
  const { dashboardCount, setAddWidgetsDrawerOpen } = useDashboardWidgets()

  const handleAddWidgets = event => {
    setAddWidgetsDrawerOpen(true)
  }

  const [addNewDialogStateId, setAddNewDialogStateId] = useState<UseControlledDialogProps['dialogId']>()

  const { open: openAddNew, onClose: onCloseAddNew } = useControlledDialog({
    dialogId: addNewDialogStateId,
    onClose: useCallback(reason => {
      if ('backdropClick' !== reason) setAddNewDialogStateId(undefined)
    }, []),
  })

  const [copyDialogStateId, setCopyDialogStateId] = useState<UseControlledDialogProps['dialogId']>()

  const { open: openCopy, onClose: onCloseCopy } = useControlledDialog({
    dialogId: copyDialogStateId,
    onClose: useCallback(reason => {
      if ('backdropClick' !== reason) setCopyDialogStateId(undefined)
    }, []),
  })

  const handleAddNew = event => {
    if (dashboardCount < MAX_ALLOWED_DASHBOARDS) {
      setAddNewDialogStateId(Symbol('addNewDashboard'))
    } else {
      snackbar.enqueueMessage(t('maxAllowedDashboardsWarning', { maxAllowed: MAX_ALLOWED_DASHBOARDS }), 'warning')
    }
  }

  const handleCopy = event => {
    if (dashboardCount < MAX_ALLOWED_DASHBOARDS) {
      setCopyDialogStateId(Symbol('copyDashboard'))
    } else {
      snackbar.enqueueMessage(t('maxAllowedDashboardsWarning', { maxAllowed: MAX_ALLOWED_DASHBOARDS }), 'warning')
    }
  }

  const addNewDialog = useMemo(() => {
    return <AddNewDashboardDialog key="addNewDialog" open={openAddNew} onClose={onCloseAddNew} outOfBoxConfigs={outOfBoxConfigs} />
  }, [onCloseAddNew, openAddNew, outOfBoxConfigs])

  const copyDialog = useMemo(() => {
    return <CopyDashboardDialog key="copyDialog" open={openCopy} onClose={onCloseCopy} />
  }, [onCloseCopy, openCopy])

  const addDialogs = [addNewDialog, copyDialog]

  const addWidgets = (
    <MenuListItem key="addWidgets" onClick={handleAddWidgets}>
      {t('addWidgets')}
    </MenuListItem>
  )
  const addNewDashboard = (
    <MenuListItem key="addNewDashboard" onClick={handleAddNew}>
      {t('addNewDashboard')}
    </MenuListItem>
  )
  const duplicateDashboard = (
    <MenuListItem key="duplicateDashboard" onClick={handleCopy}>
      {t('duplicateDashboard')}
    </MenuListItem>
  )

  return [addWidgets, addNewDashboard, duplicateDashboard, addDialogs]
}
