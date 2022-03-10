import type { CSSProperties } from 'react'
import React from 'react'

import { Typography } from '@material-ui/core'

import { BasicHelp } from '@ues/assets'

const styles: Record<string, CSSProperties> = {
  app: {
    padding: '5vh 5%',
    width: '100%',
    height: '100%',
    maxHeight: 500,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
  },
  placeholder: {
    opacity: 0.5,
    width: 132,
    height: 132,
    alignSelf: 'center',
  },
}

const Authentication = React.memo(() => {
  return (
    <div style={styles.app}>
      <Typography variant="h2">Authentication</Typography>
      <BasicHelp style={styles.placeholder} />
    </div>
  )
})
Authentication.displayName = 'Authentication'

export default Authentication
