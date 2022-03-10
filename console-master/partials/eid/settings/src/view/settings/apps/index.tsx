import React from 'react'

import { Typography } from '@material-ui/core'

const styles = {
  app: {
    padding: '5vh 5%',
  },
}

const OIDCApps = React.memo(() => {
  return (
    <div style={styles.app}>
      <Typography variant="h2">Authorized Apps</Typography>
      <Typography variant="h4" gutterBottom>
        Manage Authorized EID Applications here
      </Typography>
    </div>
  )
})
OIDCApps.displayName = 'oidcApps'

export default OIDCApps
