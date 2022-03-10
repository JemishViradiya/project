/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React from 'react'

import { Button, Dialog, FormControl, MenuItem } from '@material-ui/core'

import { DialogChildren, Select, useControlledDialog } from '@ues/behaviours'

import { getI18CommonName, getI18Name, useTranslation } from '../common/i18n'

export interface AuthenticatorProps {
  id: symbol
  unusedAuthenticators: any[]
  onConfirm: (arg0: string) => void
  onCancel: () => void
}

const AddAuthenticator: React.FC<AuthenticatorProps> = ({ id, unusedAuthenticators, onCancel, onConfirm }) => {
  const { t } = useTranslation()
  const [authenticator, setAuthenticator] = React.useState<string>(null)

  const closeHandler = () => {
    onCancel()
    setAuthenticator(null)
  }

  const submitHandler = () => {
    onConfirm(authenticator)
    setAuthenticator(null)
  }

  const { open, onClose } = useControlledDialog({
    dialogId: id,
    onClose: closeHandler,
  })

  const handleChange = event => {
    setAuthenticator(event.target.value)
  }

  const Content = (): JSX.Element => {
    const label = t(getI18Name('addAuthenticatorsDialog.dropdownLabel'))
    return (
      <FormControl style={{ minWidth: 210 }} variant="filled" size="small">
        <Select
          displayEmpty={false}
          label={label}
          id={label}
          title={label}
          onChange={handleChange}
          value={authenticator ?? ''}
          size="small"
          variant="filled"
        >
          {unusedAuthenticators?.map(key => (
            <MenuItem value={key['name']} key={key['name']}>
              {key['name']}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    )
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogChildren
        title={t(getI18Name('addAuthenticatorsDialog.title'))}
        onClose={onClose}
        content={<Content />}
        actions={
          <>
            <Button variant="outlined" onClick={onClose}>
              {t(getI18CommonName('cancel'))}
            </Button>
            <Button variant="contained" color="primary" type="submit" onClick={submitHandler} disabled={!authenticator}>
              {t(getI18CommonName('save'))}
            </Button>
          </>
        }
      />
    </Dialog>
  )
}

export default AddAuthenticator
