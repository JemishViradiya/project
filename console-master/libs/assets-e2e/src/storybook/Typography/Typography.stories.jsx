import React from 'react'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import markdown from './README.md'

export const typography = () => {
  return (
    <div style={{ width: '40%' }}>
      <Paper elevation={0}>
        <Card>
          <CardContent>
            <Typography variant="h1" gutterBottom>
              h1. Heading
            </Typography>
            <Typography variant="h2" gutterBottom>
              h2. Heading
            </Typography>
            <Typography variant="h3" gutterBottom>
              h3. Heading
            </Typography>
            <Typography variant="h4" gutterBottom>
              h4. Heading
            </Typography>
            <Typography variant="h5" gutterBottom>
              h5. Heading
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
            </Typography>
            <Typography variant="body1" gutterBottom>
              body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde suscipit, quam beatae
              rerum inventore consectetur, neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum quasi quidem
              quibusdam.
            </Typography>
            <Typography variant="body2" gutterBottom>
              body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde suscipit, quam beatae
              rerum inventore consectetur, neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum quasi quidem
              quibusdam.
            </Typography>
            <Typography variant="button" display="block" gutterBottom>
              button text
            </Typography>
            <Typography variant="caption" display="block" gutterBottom>
              caption text
            </Typography>
            <Typography variant="body2" display="block" color="error" gutterBottom>
              Error Color Text
            </Typography>
            <Typography variant="body2" display="block" color="inherit" gutterBottom>
              Inherit Color Text
            </Typography>
            <Typography variant="body2" display="block" color="initial" gutterBottom>
              Initial Color Text
            </Typography>
            <Typography variant="body2" display="block" color="primary" gutterBottom>
              Primary Color Text
            </Typography>
            <Typography variant="body2" display="block" color="secondary" gutterBottom>
              Secondary Color Text
            </Typography>
            <Typography variant="body2" display="block" color="textPrimary" gutterBottom>
              Text Primary Color Text
            </Typography>
            <Typography variant="body2" display="block" color="textSecondary" gutterBottom>
              Text Secondary Color Text
            </Typography>
          </CardContent>
        </Card>
      </Paper>
    </div>
  )
}

export default {
  title: 'Typography',
  parameters: {
    notes: markdown,
    controls: {
      hideNoControlsWarning: true,
    },
  },
}
