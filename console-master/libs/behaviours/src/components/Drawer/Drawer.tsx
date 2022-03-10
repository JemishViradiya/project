import React, { useCallback } from 'react'

import { ClickAwayListener, Drawer as MuiDrawer, IconButton, Typography } from '@material-ui/core'

import { BasicClose } from '@ues/assets'

import { ActionsMenu } from './conponents'
import { useStyles } from './styles'
import type { DrawerProps } from './types'

export const Drawer: React.FC<DrawerProps> = props => {
  const { title, children, open, onClickAway, toggleDrawer, actions } = props
  const classes = useStyles(props)

  const onCloseClick = useCallback(() => toggleDrawer(), [toggleDrawer])

  const renderActions = useCallback(() => {
    if (actions.length > 1) {
      return <ActionsMenu actions={actions} />
    }

    const { icon, onClick } = actions[0]

    return (
      <IconButton onClick={onClick} size="small" role="button">
        {icon}
      </IconButton>
    )
  }, [actions])

  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <MuiDrawer open={open} classes={{ paper: classes.paper }} variant="persistent" anchor="right">
        <div className={classes.title}>
          <Typography variant="h2">{title}</Typography>
          <div>
            {actions && actions.length && renderActions()}
            <IconButton size="small" onClick={onCloseClick} role="button">
              <BasicClose />
            </IconButton>
          </div>
        </div>
        {children}
      </MuiDrawer>
    </ClickAwayListener>
  )
}
