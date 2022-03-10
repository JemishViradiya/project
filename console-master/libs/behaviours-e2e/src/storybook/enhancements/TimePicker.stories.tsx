import React from 'react'

import { useState } from '@storybook/addons'

import { Box } from '@material-ui/core'

import { boxPaddingProps } from '@ues/assets'
import { TimePicker as TimePickerComponent } from '@ues/behaviours'

const timeFormatMap = {
  0: 'HH:mm',
  1: 'hh:mm a',
}

export const TimePicker = args => {
  const [time, setTime] = useState(new Date())

  return (
    <Box {...boxPaddingProps}>
      <TimePickerComponent {...args} value={time} onChange={setTime} />
    </Box>
  )
}

TimePicker.args = {
  label: 'Enter time',
  minutesStep: 5,
  ampm: true,
}

export default {
  title: 'Enhancements/Input/Time Picker',

  argTypes: {
    ampm: {
      control: {
        type: 'boolean',
      },
    },
    minutesStep: {
      control: {
        type: 'number',
        min: 1,
        max: 30,
        defaultValue: { summary: 5 },
      },
    },
  },
}
