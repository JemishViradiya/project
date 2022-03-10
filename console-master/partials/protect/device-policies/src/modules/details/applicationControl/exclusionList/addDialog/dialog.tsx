import React from 'react'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'

import AddForm, { useAddForm } from './addForm'
import Content from './content'
import Title from './title'

interface AddDialogPropTypes {
  list: string[]
  onClose: () => void
  onAdd: (folderPath: string) => void
}

const AddDialog = ({ list, onClose, onAdd }: AddDialogPropTypes): JSX.Element => {
  const { formState, inputProps, onSubmit } = useAddForm(list, onAdd)

  return (
    <form onSubmit={onSubmit} noValidate>
      <Title />
      <Content>
        <AddForm.PathInput formState={formState} inputProps={inputProps} list={list} />
      </Content>
      <DialogActions>
        <AddForm.CancelButton onClick={onClose} />
        <AddForm.SubmitButton />
      </DialogActions>
    </form>
  )
}

export default AddDialog
