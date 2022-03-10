import React from 'react'

import type { IconButtonProps } from '@material-ui/core'
import { Icon, IconButton as MuiIconButton } from '@material-ui/core'

import { BasicDelete } from '@ues/assets'

import { partialAction as action } from '../utils/actions'

export const IconButton = (props: IconButtonProps) => {
  return (
    <MuiIconButton {...props} onClick={action('onClick')}>
      <Icon component={BasicDelete} />
    </MuiIconButton>
  )
}
