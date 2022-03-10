import React from 'react'

import { Box, Slide } from '@material-ui/core'

import useStyles from './styles'

interface StickyActionsProps {
  open: boolean
  actions: React.ReactNode
  position?: 'sticky' | 'absolute'
}

export const StickyActions: React.FC<StickyActionsProps> = ({ open, actions, position = 'sticky' }) => {
  const classes = useStyles()

  return (
    open && (
      <Box className={classes.buttons} position={position}>
        {actions}
      </Box>
    )
  )
}
