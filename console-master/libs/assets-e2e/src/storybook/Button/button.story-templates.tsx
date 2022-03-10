import { omit } from 'lodash-es'
import React from 'react'

import type { ButtonProps as MuiButtonProps } from '@material-ui/core'
import { Button as MuiButton } from '@material-ui/core'

import { ArrowCaretDown, BasicSave } from '@ues/assets'

interface ButtonProps extends MuiButtonProps {
  withStartIcon?: boolean
  withEndIcon?: boolean
}

const getStartIcon = withIcon => {
  return withIcon ? { startIcon: <BasicSave /> } : {}
}
const getEndIcon = withIcon => {
  return withIcon ? { endIcon: <ArrowCaretDown /> } : {}
}

export const Button = (props: ButtonProps) => {
  let buttonProps = omit(props, ['withStartIcon', 'withEndIcon'])
  buttonProps = {
    ...buttonProps,
    ...getStartIcon(props.withStartIcon),
    ...getEndIcon(props.withEndIcon),
  }
  return <MuiButton {...buttonProps} />
}
