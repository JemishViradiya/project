//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

/* eslint-disable sonarjs/cognitive-complexity */

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { Box, IconButton, Tooltip } from '@material-ui/core'

import { ArrowLeft, BasicCopy, BasicDelete } from '@ues/assets'
import { ConfirmationState, PageTitlePanel, useConfirmation } from '@ues/behaviours'

import { GATEWAY_TRANSLATIONS_KEY } from '../../config'
import { useBigPermissions } from '../../hooks'
import type { DiscardChangesButtonProps } from '../discard-changes-button'
import { DiscardChangesButton } from '../discard-changes-button'
import { LoadingProgress } from '../loading-progress'
import { StickyActions } from '../sticky-actions'
import { EntityDetailsViewContext } from './context'
import { useEntity404ErrorHandler, useIsCopyMode, useMutationListeners } from './hooks'
import { useStyles } from './styles'
import type { EntityDetailsViewProps } from './types'

const EntityDetailsView: React.FC<EntityDetailsViewProps> = ({
  children,
  copyAction,
  pageHeading,
  parentPage,
  permissions = [],
  readOnly = false,
  redux,
  removeAction,
  saveAction,
  deleteConfirmationProps,
}) => {
  const { canCreate, canUpdate, canDelete } = useBigPermissions(permissions[0], permissions[1])

  const [formValidationStates, setFormValidationStates] = useState<Record<string, boolean>>({})
  const [actionButtonSubmitted, setActionButtonSubmitted] = useState<boolean>(false)

  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const confirmation = useConfirmation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const classes = useStyles()
  const { id } = useParams()
  const { isCopyMode } = useIsCopyMode()

  const hasUnsavedChanges = useSelector(redux.selectors.getHasUnsavedChanges)
  const fetchEntityTask = useSelector(redux.selectors.getEntityTask)
  const isEntityDefinitionValid = useSelector(
    redux.selectors.getIsEntityDefinitionValid ? redux.selectors.getIsEntityDefinitionValid : () => true,
  )

  useEntity404ErrorHandler(fetchEntityTask, parentPage)

  useEffect(() => {
    return () => {
      if (redux?.actions?.exitView) {
        dispatch(redux.actions.exitView())
      }
      setActionButtonSubmitted(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { saveEntity, saveEntityTask, removeEntityTask, removeEntity } = useMutationListeners({
    saveAction,
    removeAction,
    parentPage,
  })

  const taskLoading = [saveEntityTask?.loading, removeEntityTask?.loading].some(Boolean)

  const handleDelete = async () => {
    const confirmationState = await confirmation({
      title: t('common.deleteConfirmation'),
      description: t('common.doYouWantToDelete', { '0': fetchEntityTask?.data?.name }),
      cancelButtonLabel: t('common.buttonCancel'),
      confirmButtonLabel: t('common.buttonDelete'),
      ...deleteConfirmationProps,
    })

    if (confirmationState === ConfirmationState.Confirmed) {
      setActionButtonSubmitted(true)
      removeEntity({ id })
    }
  }

  const handleCopy = () => {
    if (copyAction?.onNavigateTo) {
      navigate(copyAction.onNavigateTo())
    }
  }

  const handleSave = () => {
    const args = saveAction?.getArgs ? saveAction.getArgs() : {}

    saveEntity({ ...args, id })
  }

  const discardChangesButtonProps: DiscardChangesButtonProps = {
    shouldDisableActionButton: taskLoading,
    parentPage,
  }

  const isAddMode = id === undefined
  const isAddOrCopyMode = isAddMode || isCopyMode
  const permittedToAddOrUpdate = isAddOrCopyMode ? canCreate : canUpdate
  const writable = permittedToAddOrUpdate && !readOnly

  const shouldEnableCopyAction = copyAction && canCreate && !readOnly
  const shouldEnableRemoveAction = removeAction && canDelete && !readOnly
  const shouldEnableSaveAction = saveAction && permittedToAddOrUpdate && !readOnly

  const shouldDisableFormField = !writable || taskLoading
  const shouldDisablePanelActionButton = taskLoading || hasUnsavedChanges || readOnly
  const shouldDisableSaveButton = useMemo(() => {
    const isFormInValid = Object.values(formValidationStates).includes(false)

    return !isEntityDefinitionValid || taskLoading || isFormInValid
  }, [formValidationStates, isEntityDefinitionValid, taskLoading])

  const updateFormValidationStates = useCallback(states => setFormValidationStates({ ...formValidationStates, ...states }), [
    formValidationStates,
  ])

  return fetchEntityTask?.loading ? (
    <LoadingProgress alignSelf="center" />
  ) : (
    <EntityDetailsViewContext.Provider
      value={{
        writable,
        shouldDisableFormField,
        updateFormValidationStates,
      }}
    >
      <Box className={classes.container}>
        <PageTitlePanel
          title={pageHeading.title}
          subtitle={pageHeading.subtitle}
          helpId={pageHeading?.helpId}
          goBackComponent={<DiscardChangesButton iconButton={<ArrowLeft />} {...discardChangesButtonProps} />}
          actions={
            <Box display="flex" alignItems="center">
              {shouldEnableCopyAction && (
                <Tooltip title={t('common.copy')}>
                  <IconButton size="small" disabled={shouldDisablePanelActionButton} onClick={handleCopy}>
                    <BasicCopy />
                  </IconButton>
                </Tooltip>
              )}
              {shouldEnableRemoveAction && (
                <Tooltip title={t('common.buttonDelete')}>
                  <IconButton size="small" disabled={shouldDisablePanelActionButton} onClick={handleDelete}>
                    <BasicDelete />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          }
        />
        {children}
      </Box>

      {shouldEnableSaveAction && (
        <StickyActions
          disableCancelButton={taskLoading}
          disableConfirmButton={shouldDisableSaveButton}
          isAddMode={isAddOrCopyMode}
          show={hasUnsavedChanges}
          hideConfirmation={actionButtonSubmitted || fetchEntityTask?.error}
          loading={saveEntityTask?.loading}
          onSave={handleSave}
          parentPage={parentPage}
        />
      )}
    </EntityDetailsViewContext.Provider>
  )
}

export { EntityDetailsView }
export { useEntityDetailsViewCopyModeListener } from './hooks'
export * from './base-form'
export * from './context'
