/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React from 'react'

import useStyles from './styles'

interface ToolbarProps {
  begin?: React.ReactNode
  center?: React.ReactNode
  end?: React.ReactNode
}

export const Toolbar: React.FC<ToolbarProps> = ({ begin, center, end }) => {
  const classes = useStyles()

  return (
    <div className={classes.toolbar}>
      <div>{begin}</div>
      <div>{center}</div>
      <div>{end}</div>
    </div>
  )
}
