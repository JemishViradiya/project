import React from 'react'

import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import { ChevronDown } from '@ues/assets'

export const defaultExpansionPanel = () => (
  <Paper elevation={0}>
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ChevronDown />}>
        <Typography variant="h3">Default Expansion Panel</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Typography variant="body2">
          body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde suscipit, quam beatae rerum
          inventore consectetur, neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum quasi quidem
          quibusdam.
        </Typography>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  </Paper>
)

export const standAloneExpansionPanel = () => (
  <Paper elevation={0}>
    <ExpansionPanel>
      <ExpansionPanelSummary className="stand-alone-expansion-panel" expandIcon={<ChevronDown />}>
        <Typography variant="h3">Stand Alone Expansion Panel</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Typography variant="body2">
          body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde suscipit, quam beatae rerum
          inventore consectetur, neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum quasi quidem
          quibusdam.
        </Typography>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  </Paper>
)

export default {
  title: 'Expansion Panel',
  parameters: {
    controls: {
      hideNoControlsWarning: true,
    },
  },
}
