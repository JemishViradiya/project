import React from 'react'
import { useTranslation } from 'react-i18next'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'

import { BasicAdd, BasicDelete } from '@ues/assets'
import { ConfirmationDialog, useTableSelection } from '@ues/behaviours'

import AddDialog from './addDialog'

interface ActionsPropTypes {
  list: string[]
  isAddDialogOpen: boolean
  isDeleteDialogOpen: boolean
  onToggleAddDialog: () => void
  onToggleDeleteDialog: () => void
  onAdd: (folderPath: string) => void
  onDelete: () => void
}

const Actions = ({
  list,
  isAddDialogOpen,
  isDeleteDialogOpen,
  onToggleAddDialog,
  onToggleDeleteDialog,
  onAdd,
  onDelete,
}: ActionsPropTypes): JSX.Element => {
  const { t: translate } = useTranslation(['protect', 'general/form'])

  const { selected } = useTableSelection()

  // --TODO: RBAC roles

  return (
    <>
      <Button
        onClick={onToggleAddDialog}
        startIcon={<BasicAdd />}
        variant="contained"
        color="secondary"
        data-autoid="application-control-exclusion-list-add-button"
      >
        {translate('addExclusion')}
      </Button>
      {selected.length ? (
        <Button
          onClick={onToggleDeleteDialog}
          variant="contained"
          color="primary"
          startIcon={<BasicDelete />}
          data-autoid="application-control-exclusion-list-remove-button"
        >
          {translate('general/form:commonLabels.delete')}
        </Button>
      ) : null}
      <Dialog open={isAddDialogOpen} fullWidth data-autoid="application-control-add-exclusion-dialog">
        <AddDialog list={list} onClose={onToggleAddDialog} onAdd={onAdd} />
      </Dialog>
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        title={translate('deleteExclusion', { count: selected.length })}
        content={translate('doYouWantToDeleteExclusion', {
          count: selected.length,
        })}
        cancelButtonLabel={translate('general/form:commonLabels.cancel')}
        confirmButtonLabel={translate('general/form:commonLabels.delete')}
        onCancel={onToggleDeleteDialog}
        onConfirm={onDelete}
        data-autoid="application-control-exclusion-list-remove-dialog"
      />
    </>
  )
}

export default Actions
