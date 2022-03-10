/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useContext } from 'react'

import { Button, Dialog, List, ListItem, ListItemText } from '@material-ui/core'

import { DialogChildren } from '@ues/behaviours'

import { AddUserContext } from '../AddUserContext'

const SelectUserDialog = props => {
  const { selectUserDialogOpen, setSelectUserDialogOpen, selectUserDialogOptions } = props
  const { postData, getListItemText, setValidForm, t } = useContext(AddUserContext)

  const handleClose = () => {
    setSelectUserDialogOpen(false)
    setValidForm(true)
  }

  const handleListItemClick = user => {
    postData({ ...user, username: user.emailAddress })
    handleClose()
  }

  return (
    <Dialog fullWidth open={selectUserDialogOpen} onClose={handleClose}>
      <DialogChildren
        title={t('users.add.userFoundTitle')}
        description={t('users.add.selectUserNote')}
        content={
          <List>
            {selectUserDialogOptions.map((user, index) => (
              <ListItem button onClick={() => handleListItemClick(user)} key={index}>
                <ListItemText primary={getListItemText(user)} />
              </ListItem>
            ))}
          </List>
        }
        actions={
          <Button variant="outlined" onClick={handleClose}>
            {t('general/form:commonLabels.cancel')}
          </Button>
        }
        onClose={handleClose}
      />
    </Dialog>
  )
}

export default SelectUserDialog
