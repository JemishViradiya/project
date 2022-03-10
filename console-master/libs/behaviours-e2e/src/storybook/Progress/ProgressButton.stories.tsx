import React, { useState } from 'react'

import Box from '@material-ui/core/Box'

import { ProgressButton as EnhancedButton } from '@ues/behaviours'

const inlineRadioType = 'inline-radio'

export const ProgressButton = args => {
  const { color } = args
  const [loading, setLoading] = useState(false)

  const onClick = () => {
    if (!loading) {
      setLoading(true)

      setTimeout(() => {
        setLoading(false)
      }, 2000)
    }
  }

  return (
    <Box>
      <EnhancedButton loading={loading} onClick={onClick} size="medium" variant="contained" color={color} />
    </Box>
  )
}

ProgressButton.args = {
  color: 'primary',
}

export default {
  title: 'Progress',
  parameters: {
    notes: '',
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
  },
}
