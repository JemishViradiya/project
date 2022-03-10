import React from 'react'

import { action } from '@storybook/addon-actions'

import { HelpLinks } from '@ues/assets'
import { PageTitlePanel } from '@ues/behaviours'

const PageTitlePanelStory = ({ title, subtitle, showHelpButton, showBackButton, multiTitle, borderBottom, ...args }) => {
  title = multiTitle ? ['Gateway', 'Settings'] : title
  return (
    <PageTitlePanel
      goBack={
        showBackButton &&
        (() => {
          action('goBack')
        })
      }
      title={title}
      subtitle={subtitle}
      helpId={showHelpButton && HelpLinks.GatewayService}
      borderBottom={borderBottom}
    />
  )
}

export const PageTitle = PageTitlePanelStory.bind({})

PageTitle.args = {
  title: 'Test profile',
  subtitle: '',
  showHelpButton: true,
  showBackButton: true,
  multiTitle: false,
  borderBottom: true,
}

export default {
  title: 'Layout/Page elements/Page title',
  component: PageTitlePanelStory,
  argTypes: {
    title: {
      control: { type: 'text' },
      description: 'Title.',
    },
    subtitle: {
      control: { type: 'text' },
      description: 'Text below the title.',
    },
    showHelpButton: {
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: true },
      },
    },
    showBackButton: {
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: true },
      },
    },
    multiTitle: {
      control: { type: 'boolean' },
    },
    borderBottom: {
      control: { type: 'boolean' },
    },
  },
}
