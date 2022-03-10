//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { ChangeEvent } from 'react'
import React from 'react'

import { InputBase } from '@material-ui/core'

import { enhancedSearchActions, useEnhancedSearchContext } from '../EnhancedSearchProvider'

export const InputRenderer = ({ params, classes, placeholder, inputRef, autoFocus }) => {
  const { dispatch } = useEnhancedSearchContext()

  const { InputProps, InputLabelProps, ...rest } = params
  return (
    <div>
      <InputBase
        {...params.InputLabelProps}
        {...params.InputProps}
        {...rest}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autoFocus}
        inputRef={inputRef}
        placeholder={placeholder}
        className={classes.inputField}
        endAdornment={undefined}
        onClick={(e: ChangeEvent<HTMLInputElement>) => {
          if (e.target.tagName === 'INPUT') {
            dispatch(enhancedSearchActions.setCurrentOptionsShow({ show: true }))
          }
        }}
      />
    </div>
  )
}
