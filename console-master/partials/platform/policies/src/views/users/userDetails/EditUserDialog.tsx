import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Dialog, Grid } from '@material-ui/core'

import { DialogChildren } from '@ues/behaviours'

import AdditionalUserDetailsForm from '../addUsers/forms/AdditionalUserDetailsForm'
import UserDetailsForm from '../addUsers/forms/UserDetailsForm'

export const EditUserDialog = ({ open, onClose, onSubmit, userDetails, readonly }) => {
  const { t } = useTranslation(['platform/common', 'general/form'])
  const [editedUser, setEditedUser] = useState(userDetails)
  const [isFormValid, setFormValid] = useState(true)

  useEffect(() => {
    if (open) {
      setEditedUser(userDetails)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <DialogChildren
        title={t(readonly ? 'users.details.title' : 'users.details.edit.title')}
        content={
          <Grid container component="div">
            <UserDetailsForm
              userDetails={editedUser}
              editable={!readonly}
              setUserDetails={setEditedUser}
              setValidForm={setFormValid}
            />
            {userDetails?.dataSourceConnectionId && <AdditionalUserDetailsForm userDetails={editedUser} />}
          </Grid>
        }
        actions={
          <>
            <Button variant="contained" color="primary" onClick={onClose}>
              {t(readonly ? 'general/form:commonLabels.close' : 'general/form:commonLabels.cancel')}
            </Button>
            {!readonly && (
              <Button variant="contained" color="primary" disabled={!isFormValid} onClick={() => onSubmit(editedUser)}>
                {t('general/form:commonLabels.save')}
              </Button>
            )}
          </>
        }
        onClose={onClose}
      />
    </Dialog>
  )
}
