import * as React from 'react'

import { Card, CardContent, CardHeader, CircularProgress } from '@material-ui/core'

const boxStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }
const cardStyle = { width: 200, height: 200 }

export const SessionLoading = (): JSX.Element => {
  return (
    <div style={boxStyle}>
      <Card elevation={3} style={cardStyle}>
        <CardHeader title={'Loading your session'} />
        <CardContent>
          <CircularProgress />
        </CardContent>
      </Card>
    </div>
  )
}
