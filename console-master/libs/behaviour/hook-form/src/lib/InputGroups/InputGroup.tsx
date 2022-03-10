//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { omit } from 'lodash-es'
import React from 'react'

import { Box, IconButton } from '@material-ui/core'

import { BasicClose } from '@ues/assets'

import FormField from '../Form/fields'
import type { FormFieldInterface } from '../Form/types'
import useStyles from './styles'
import type { InputGroupProps } from './types'

const InputGroup: React.FC<InputGroupProps> = ({
  disabled,
  fields,
  onBlur,
  onChange,
  onRemove,
  hideRemoveButton,
  index,
  onAutoFocus,
}) => {
  const classes = useStyles()

  return (
    <Box className={classes.inputGroup}>
      {fields.map((field, fieldIndex) =>
        typeof field.renderComponent === 'function' ? (
          field.renderComponent({ field, onChange, index, autoFocus: onAutoFocus(fieldIndex) })
        ) : (
          <FormField
            key={field.name}
            formField={
              {
                ...omit(field, ['renderComponent']),
                disabled: field.disabled || disabled,
                autoFocus: onAutoFocus(fieldIndex),
              } as FormFieldInterface
            }
            onChange={onChange}
            onBlur={onBlur}
          />
        ),
      )}
      {!disabled && (
        <Box className={classes.removeButtonWrapper}>
          {!hideRemoveButton && (
            <IconButton size="small" onClick={onRemove} aria-label={`remove-input-group-button-${index}`}>
              <BasicClose />
            </IconButton>
          )}
        </Box>
      )}
    </Box>
  )
}

export default InputGroup
