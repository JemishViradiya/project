import React from 'react'

import { Typography } from '@material-ui/core'

import { ContentArea, ContentAreaPanel } from '@ues/behaviours'

export const ContentAreaComponent = () => {
  return (
    <ContentArea>
      <ContentAreaPanel title="First panel">
        <Typography>Hey! I am the first ContentAreaPanel.</Typography>
      </ContentAreaPanel>
      <ContentAreaPanel title="Second panel">
        <Typography>And I am the second ContentAreaPanel.</Typography>
      </ContentAreaPanel>
    </ContentArea>
  )
}

export default {
  title: 'Layout/Page specs/Content area',
  parameters: {
    controls: { hideNoControlsWarning: true },
  },
}
