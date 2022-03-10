import React from 'react'

import { Typography } from '@material-ui/core'

import { ContentArea, ContentAreaPanel } from '@ues/behaviours'

const ContentAreaPanelStoryComponent = ({ title, subtitle, fullWidth }) => {
  return (
    <ContentArea>
      <ContentAreaPanel title={title} subtitle={subtitle} fullWidth={fullWidth}>
        <Typography variant="body2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
          aliqua. Rhoncus dolor purus non enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper
          risus in hendrerit gravida rutrum quisque non tellus. Convallis convallis tellus id interdum velit laoreet id donec
          ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit adipiscing bibendum est ultricies integer
          quis. Cursus quis viverra nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo
          quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus at augue. At augue eget arcu dictum varius duis at
          consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa sapien faucibus et molestie ac.
        </Typography>
      </ContentAreaPanel>
    </ContentArea>
  )
}

export const ContentAreaPanelStory = ContentAreaPanelStoryComponent.bind({})

ContentAreaPanelStory.args = {
  title: 'Page title',
  subtitle: 'Page subtitle',
  fullWidth: false,
}

export default {
  title: 'Layout/Page specs/Content area panel',
  component: ContentAreaPanelStoryComponent,
  argTypes: {
    title: {
      control: { type: 'text' },
      description: 'Page title (optional)',
    },
    subtitle: {
      control: { type: 'text' },
      description: 'Page subtitle (optional)',
    },
    fullWidth: {
      conro: { type: 'boolean' },
      description: 'Use full width',
    },
  },
}
