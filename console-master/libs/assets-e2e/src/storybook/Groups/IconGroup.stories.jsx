import React, { useState } from 'react'

import { Button, ButtonGroup as MuiButtonGroup } from '@material-ui/core'

import { BasicAdd, BasicCalendar, BasicDelete, BasicDownload, BasicUser, ChartBar } from '@ues/assets'

import markdown from './IconGroup.md'

const icons = [<BasicCalendar />, <BasicDelete />, <BasicUser />, <BasicAdd />, <BasicDownload />, <ChartBar />]

export const IconGroup = args => {
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(0)

  function onButtonClick(event, index) {
    setSelectedButtonIndex(index)
  }

  const buttons = Array.from(Array(args.buttons).keys())
  return (
    <MuiButtonGroup size={args.size} variant="outlined" disabled={args.disabled} aria-label="button group">
      {buttons.map(index => (
        <Button
          key={index}
          name={index}
          startIcon={icons[index % icons.length]}
          className={selectedButtonIndex === index ? 'selected' : ''}
          onClick={event => onButtonClick(event, index)}
          disabled={index + 1 === args.disabledButtonIndex}
        />
      ))}
    </MuiButtonGroup>
  )
}

IconGroup.args = {
  size: 'medium',
  disabled: false,
  buttons: 3,
  disabledButtonIndex: 2,
}

const inlineRadioType = 'inline-radio'
export default {
  title: 'Groups/IconGroups',
  component: IconGroup,
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
}
