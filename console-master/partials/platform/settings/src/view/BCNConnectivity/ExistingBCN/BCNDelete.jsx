import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, IconButton } from '@material-ui/core'

import { BcnApi } from '@ues-data/platform'
import { usePrevious, useStatefulReduxMutation } from '@ues-data/shared'
import { BasicDelete } from '@ues/assets'
import { ConfirmationDialog, useControlledDialog, useSnackbar } from '@ues/behaviours'

const BCNDelete = props => {
  const { rowData } = props
  const { enqueueMessage } = useSnackbar()
  const [dialogStateId, setDialogStateId] = useState()
  const { t } = useTranslation(['platform/common', 'general/form'])

  const { open, onClose } = useControlledDialog({
    dialogId: dialogStateId,
    onClose: useCallback(() => {
      setDialogStateId(undefined)
    }, []),
  })

  const [deleteAction, deleteState] = useStatefulReduxMutation(BcnApi.mutationDeleteConnection, {})
  const prevDeleteState = usePrevious(deleteState)

  useEffect(() => {
    if (BcnApi.isTaskResolved(deleteState, prevDeleteState)) {
      if (deleteState.error) {
        console.log('Error deleting connection ' + deleteState.error)
        enqueueMessage(t('bcn.errors.errorDeletingBCN'), 'error')
      } else {
        enqueueMessage(t('bcn.success.delete'), 'success')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteState, prevDeleteState])

  const deleteBCN = async () => {
    deleteAction({ id: rowData.instanceId })
  }

  return (
    <>
      <ConfirmationDialog
        open={open}
        title={t('bcn.table.delete.title')}
        description={t('bcn.table.delete.description')}
        content={t('bcn.table.delete.content', { name: rowData.displayName })}
        cancelButtonLabel={t('general/form:commonLabels.cancel')}
        confirmButtonLabel={t('general/form:commonLabels.delete')}
        onConfirm={() => {
          /* confirm action */
          setDialogStateId(undefined)
          deleteBCN()
        }}
        onCancel={onClose}
      />
      <Box display="flex" justifyContent="flex-end">
        <IconButton
          aria-label={t('bcn.table.actions.deleteButtonLabel')}
          size="small"
          onClick={() => setDialogStateId(Symbol('confirmation-dialog'))}
          disabled={deleteState?.loading}
        >
          <BasicDelete />
        </IconButton>
      </Box>
    </>
  )
}

export default BCNDelete
