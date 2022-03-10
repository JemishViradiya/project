//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import clsx from 'clsx'
import React from 'react'

import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  toolbarWrapper: { marginBottom: `${theme.spacing(4)}px !important` },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    '& > *:not(:last-child)': {
      marginRight: theme.spacing(4),
    },
  },
}))

export interface ToolbarProps {
  begin?: React.ReactNode
  end?: React.ReactNode
  top?: React.ReactNode
  bottom?: React.ReactNode
}

const Toolbar: React.FC<ToolbarProps> = React.memo(({ begin, end, top, bottom }) => {
  const { toolbar, flexContainer, toolbarWrapper } = useStyles()

  return (
    <div className={toolbarWrapper} role="toolbar">
      {top && <div>{top}</div>}
      <div className={clsx((begin || end) && toolbar)}>
        <div className={flexContainer}>{begin}</div>
        <div className={flexContainer}>{end}</div>
      </div>
      {bottom && <div>{bottom}</div>}
    </div>
  )
})

export default Toolbar
