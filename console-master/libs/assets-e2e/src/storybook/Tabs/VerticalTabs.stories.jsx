import React, { useState } from 'react'

import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'

import { a11yProps } from '@ues/assets'

import markdown from './Tabs.md'

const VerticalStory = args => {
  const [value, setValue] = useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <div style={{ width: '260px' }}>
      <Tabs orientation="vertical" value={value} onChange={handleChange} aria-label="Vertical tabs example" color="secondary">
        <Tab label="Item One" {...a11yProps(0)} />
        <Tab label="Item Two" {...a11yProps(1)} />
        <Tab label="Item Three" {...a11yProps(2)} />
        <Tab label="Item Four" {...a11yProps(3)} />
        <Tab label="Item Five" {...a11yProps(4)} />
        <Tab label="Item Six" {...a11yProps(5)} />
        <Tab disabled label="Item Seven - Lorem ipsum dolor sit amet, consectetur adipiscing elit." {...a11yProps(6)} />
      </Tabs>
    </div>
  )
}

export const Vertical = VerticalStory.bind({})

export default {
  title: 'Content Tabs/Vertical',
  component: VerticalStory,
  parameters: {
    notes: markdown,
    'in-dsm': { id: '5f8ef627c5dd5ce874e02ad9' },
    controls: { hideNoControlsWarning: true },
  },
}
