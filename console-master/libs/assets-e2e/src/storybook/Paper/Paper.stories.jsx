import React from 'react'

import { Paper } from '@material-ui/core'

import markdown from './Paper.md'

export default {
  title: 'Paper',
  parameters: { notes: markdown },
}

const paperStyle = {
  width: 64,
  height: 64,
  lineHeight: '64px',
  textAlign: 'center',
  margin: '20px 32px',
}

const containerStyle = { display: 'flex', flexFlow: 'row wrap' }

export const Elevation = () => {
  return (
    <div style={containerStyle}>
      {Array.from(new Array(25), (_, elevation) => (
        <Paper id={elevation} elevation={elevation} style={paperStyle}>
          {elevation}
        </Paper>
      ))}
    </div>
  )
}
