import React, { memo } from 'react'

import { LinearProgress } from '@material-ui/core'
import { GridOverlay as MuiGridOverlay } from '@material-ui/x-grid'

const GridLoadingOverlay = memo(() => {
  return (
    <MuiGridOverlay>
      <div style={{ position: 'absolute', top: 0, width: '100%' }}>
        <LinearProgress color="secondary" />
      </div>
    </MuiGridOverlay>
  )
})

export default GridLoadingOverlay
