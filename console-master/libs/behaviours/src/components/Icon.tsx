import React from 'react'

import { SvgIcon } from '@material-ui/core'

export interface IconProps {
  icon: string
  children?: React.ReactNode
}

export const Icon = React.memo(({ icon, ...props }: IconProps) => (
  <SvgIcon {...props}>
    <use href={icon} />
  </SvgIcon>
))
