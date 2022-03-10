import React, { useState } from 'react'

import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'

import { a11yProps } from '@ues/assets'

import markdown from './Tabs.md'

const HorizontalStory = args => {
  const [value, setValue] = useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Tabs value={value} onChange={handleChange} color="secondary">
      <Tab label="Device list" {...a11yProps(0)} />
      <Tab label="Device tags" {...a11yProps(1)} />
      <Tab label="Device items" {...a11yProps(2)} />
      <Tab label="Device tab - disabled" {...a11yProps(3)} disabled />
    </Tabs>
  )
}

export const Horizontal = HorizontalStory.bind({})

export default {
  title: 'Content Tabs/Horizontal',
  component: HorizontalStory,
  parameters: {
    notes: markdown,
    'in-dsm': { id: '5f8ef5e14d7a1142bc3ef59c' },
    controls: { hideNoControlsWarning: true },
  },
}
