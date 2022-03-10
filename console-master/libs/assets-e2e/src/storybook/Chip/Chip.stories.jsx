/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-restricted-globals */
// dependencies
import React from 'react'

import markdown from './Chip.md'
import { Chip as MyChip } from './chip.story-templates.tsx'

const inlineRadioType = 'inline-radio'
const sourceCode = `

import { defaultChipProps, User } from '@ues/assets'

const selectable = false

const handleDelete = () => {
  console.info('You clicked the delete icon.')
}

const handleClick = () => {
  console.info('You clicked the Chip.')
}

return (
<Chip
  color="default"
  disabled={false}
  label="Chip"
  size="small"
  variant="outlined"
  icon={<User />}
  clickable
  selectable
  onClick={handleClick}
  onDelete={handleDelete}
  {...defaultChipProps}
/>
)
`

export const Chip = args => <MyChip {...args} />
Chip.args = {
  variant: 'outlined',
  size: 'small',
  color: 'default',
  disabled: false,
  selectable: false,
  clickable: false,
  deletable: false,
  withIcon: false,
  label: 'Chip',
}

export default {
  title: 'Chip',
  component: Chip,
  parameters: {
    notes: { Introduction: markdown },
    'in-dsm': { id: '5f88a762b50e29673a1d3788' },
    docs: {
      source: {
        code: sourceCode,
        expand: true,
      },
    },
  },
  argTypes: {
    color: {
      control: {
        type: inlineRadioType,
        options: ['default', 'primary', 'secondary'],
      },
      defaultValue: { summary: 'default' },
      description: 'Color',
    },

    disabled: {
      control: {
        type: 'boolean',
      },
      defaultValue: { summary: false },
      description: 'Disabled',
    },
    size: {
      control: {
        type: inlineRadioType,
        options: ['small', 'medium'],
      },
      defaultValue: { summary: 'small' },
      description: 'Size',
    },
    variant: {
      control: {
        type: inlineRadioType,
        options: ['outlined', 'default'],
      },
      defaultValue: { summary: 'default' },
      description: 'Variant',
    },
    selectable: {
      control: {
        type: 'boolean',
      },
      defaultValue: { summary: false },
      description: 'Selectable',
    },
    deletable: {
      control: {
        type: 'boolean',
      },
      defaultValue: { summary: false },
      description: 'Deletable, appears with a delete icon. <pre>onDelete={handleDelete}</pre>',
    },
    clickable: {
      control: {
        type: 'boolean',
      },
      defaultValue: { summary: false },
      description: 'Clickable. <pre>onClick={handleClick}</pre>',
    },

    withIcon: {
      control: {
        type: 'boolean',
      },
      defaultValue: { summary: false },
      description: 'With an icon. <pre> startIcon=&lt;User /&gt;</pre>',
    },

    defaultProps: {
      table: {
        disable: true,
      },
    },
    label: {
      table: {
        disable: true,
      },
    },
  },
}
