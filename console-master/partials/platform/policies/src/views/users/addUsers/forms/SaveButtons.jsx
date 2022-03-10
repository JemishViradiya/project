/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential. *   Do not reproduce without permission in writing.
 */
import React, { useContext } from 'react'

import { Button } from '@material-ui/core'

import { FormButtonPanel } from '@ues/behaviours'

import { AddUserContext } from '../AddUserContext'

const SaveButtons = props => {
  const { postUser, disabled } = props
  const { t } = useContext(AddUserContext)

  const buttons = [
    {
      variant: 'outlined',
      disabled: disabled,
      onClick: () => handleClick(),
      text: t('general/form:commonLabels.save'),
      color: 'default',
      style: { margin: 10 },
      key: 'saveButton',
    },
    {
      variant: 'contained',
      color: 'primary',
      disabled: disabled,
      onClick: () => handleClick('newUser'),
      text: t('button.saveAndNew'),
      style: { margin: 10 },
      key: 'saveAndNewButton',
    },
  ]

  const handleClick = newUser => {
    postUser(newUser === 'newUser')
  }

  return (
    <FormButtonPanel show={true}>
      {buttons.map(button => (
        <Button {...button}>{button.text}</Button>
      ))}
    </FormButtonPanel>
  )
}

export default SaveButtons
