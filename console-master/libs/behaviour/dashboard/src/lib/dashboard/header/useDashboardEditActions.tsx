/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { ReactNode } from 'react'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { deleteDashboardMutation } from '@ues-data/dashboard'
import { updateNavApps } from '@ues-data/nav'
import { useStatefulApolloMutation } from '@ues-data/shared'
import type { UseControlledDialogProps } from '@ues/behaviours'
import { useControlledDialog } from '@ues/behaviours'

import { selectState } from '../store'
import { DELETED_DASHBOARD_ID } from '../types'
import { MenuListItem } from '../widgets/MenuListItem'
import { useDashboardWidgets } from './../DashboardProvider'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'
import { EditTitleDialog } from './EditTitleDialog'

export const useDashboardEditActions = (): ReactNode[] => {
  const { t } = useTranslation('dashboard')
  const { dashboardCount } = useDashboardWidgets()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentDashboard = useSelector(selectState)
  const [editDialogStateId, setEditDialogStateId] = useState<UseControlledDialogProps['dialogId']>()
  const { open: openEdit, onClose: onCloseEdit } = useControlledDialog({
    dialogId: editDialogStateId,
    onClose: useCallback(reason => {
      if ('backdropClick' !== reason) setEditDialogStateId(undefined)
    }, []),
  })

  const handleEditTitle = event => {
    setEditDialogStateId(Symbol('editDashboardTitle'))
  }

  const onEditSuccess = useCallback(() => {
    dispatch(updateNavApps(true))
    onCloseEdit()
  }, [dispatch, onCloseEdit])

  const [deleteDialogStateId, setDeleteDialogStateId] = useState<UseControlledDialogProps['dialogId']>()
  const { open: openDelete, onClose: onCloseDelete } = useControlledDialog({
    dialogId: deleteDialogStateId,
    onClose: useCallback(reason => {
      if ('backdropClick' !== reason) setDeleteDialogStateId(undefined)
    }, []),
  })

  const handleDashboardDelete = event => {
    setDeleteDialogStateId(Symbol('deleteDashboard'))
  }

  const onDeleteSuccess = useCallback(() => {
    dispatch(updateNavApps(true))
    onCloseDelete()
    navigate(`/dashboard/${DELETED_DASHBOARD_ID}`)
  }, [dispatch, onCloseDelete, navigate])

  const [deleteDashboardFn] = useStatefulApolloMutation(deleteDashboardMutation, {
    onCompleted: onDeleteSuccess,
    onError: error => console.error(error.message),
    variables: { dashboardId: currentDashboard.id },
  })

  const handleDelete = useCallback(() => {
    deleteDashboardFn({ variables: { dashboardId: currentDashboard.id } })
  }, [deleteDashboardFn, currentDashboard])

  const editTitleDialog = useMemo(() => {
    return (
      <EditTitleDialog
        key="editTitleDialog"
        dashboardId={currentDashboard.id}
        open={openEdit}
        onClose={onCloseEdit}
        onEditSuccess={onEditSuccess}
      />
    )
  }, [currentDashboard.id, onCloseEdit, onEditSuccess, openEdit])

  const deleteDashboardDialog = useMemo(() => {
    return <DeleteConfirmDialog key="deleteConfirmDialog" open={openDelete} onClose={onCloseDelete} handleDelete={handleDelete} />
  }, [handleDelete, onCloseDelete, openDelete])

  const editDialogs = [editTitleDialog, deleteDashboardDialog]

  const editTitle = (
    <MenuListItem key="editTitle" onClick={handleEditTitle}>
      {t('editTitle')}
    </MenuListItem>
  )
  const deleteDashboard = (
    <MenuListItem key="deleteDashboard" disabled={dashboardCount < 2} onClick={handleDashboardDelete}>
      {t('deleteDashboard')}
    </MenuListItem>
  )

  return [editTitle, deleteDashboard, editDialogs]
}
