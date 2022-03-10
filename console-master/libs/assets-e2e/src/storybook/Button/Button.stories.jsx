import React from 'react'

import markdown from './Button.md'
import { Button as MyButton } from './button.story-templates.tsx'

const inlineRadioType = 'inline-radio'

export const Button = args => <MyButton {...args}>Button</MyButton>
Button.args = {
  variant: 'outlined',
  size: 'medium',
  color: 'default',
  disabled: false,
  withStartIcon: '',
  withEndIcon: '',
  label: 'Button',
}

export default {
  title: 'Button',
  component: Button,
  parameters: {
    notes: markdown,
    'in-dsm': {
      id: '5faed930deee3845dcf7ffce',
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
    size: {
      control: {
        type: inlineRadioType,
        options: ['small', 'medium', 'large'],
      },
      defaultValue: { summary: 'medium' },
      description: 'Size',
    },
    variant: {
      control: {
        type: inlineRadioType,
        options: ['outlined', 'contained', 'text'],
      },
      defaultValue: { summary: 'contained' },
      description: 'Variant',
    },
    disabled: {
      control: {
        type: 'boolean',
      },
      defaultValue: { summary: false },
      description: 'Disabled',
    },
    withStartIcon: {
      control: {
        type: 'boolean',
      },
      defaultValue: { summary: false },
      description: 'With start icon. <pre> startIcon=&lt;Icon component={BasicSave} /&gt;</pre>',
    },
    withEndIcon: {
      control: {
        type: 'boolean',
      },
      defaultValue: { summary: false },
      description: 'With end icon. <pre> endIcon=&lt;Icon component={ArrowCaretDown} /&gt;</pre>',
    },
    onClick: {
      action: 'clicked',
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
