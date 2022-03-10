import React, { useState } from 'react'

import { Button, ButtonGroup as MuiButtonGroup } from '@material-ui/core'

import markdown from './ButtonGroup.md'

export const ButtonGroup = args => {
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(0)
  function onButtonClick(event, index) {
    setSelectedButtonIndex(index)
  }
  const buttons = Array.from(Array(args.buttons).keys())
  return (
    <MuiButtonGroup disabled={args.disabled} color="default" size={args.size} variant="outlined" aria-label="button group">
      {buttons.map(index => (
        <Button
          key={index}
          name={index}
          className={selectedButtonIndex === index ? 'selected' : ''}
          onClick={event => onButtonClick(event, index)}
          disabled={index + 1 === args.disabledButtonIndex}
        >
          Button {index + 1}
        </Button>
      ))}
    </MuiButtonGroup>
  )
}

ButtonGroup.args = {
  size: 'medium',
  disabled: false,
  buttons: 3,
  disabledButtonIndex: 2,
}

const inlineRadioType = 'inline-radio'
export default {
  title: 'Groups/ButtonGroup',
  component: ButtonGroup,
  parameters: {
    notes: markdown,
    'in-dsm': {
      id: '???',
    },
  },
  argTypes: {
    size: {
      control: {
        type: inlineRadioType,
        options: ['small', 'medium', 'large'],
      },
      defaultValue: { summary: 'medium' },
      description: 'Size',
    },
    disabled: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
      description: 'Disabled',
    },
    buttons: {
      control: {
        type: 'number',
        min: 1,
      },
      defaultValue: { summary: '3' },
      description: 'Number of buttons',
    },
    disabledButtonIndex: {
      control: {
        type: 'number',
        min: 1,
      },
      defaultValue: { summary: 2 },
      description: 'The index of the disabled button',
    },
  },
}
