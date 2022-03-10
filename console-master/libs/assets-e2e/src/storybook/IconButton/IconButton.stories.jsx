// dependencies
import React from 'react'

import { IconButton as IconButtonStory } from './iconButton.story-templates'
import markdown from './README.md'

export const IconButton = args => <IconButtonStory {...args} />
IconButton.args = {
  color: 'default',
  size: 'small',
  disabled: false,
}

export default {
  title: 'Icon Buttons',
  component: IconButton,
  parameters: { notes: { Introduction: markdown }, 'in-dsm': { id: '5f8609c30fa0e2369d79c275' } },
  argTypes: {
    color: {
      control: {
        type: 'inline-radio',
        options: ['default', 'primary'],
      },
      defaultValue: { summary: 'default' },
      description: 'Color',
    },
    size: {
      control: {
        type: 'inline-radio',
        options: ['small', 'medium'],
      },
      defaultValue: { summary: 'small' },
    },
    disabled: {
      control: {
        type: 'boolean',
      },
      defaultValue: { summary: false },
      description: 'Disabled',
    },
  },
}
