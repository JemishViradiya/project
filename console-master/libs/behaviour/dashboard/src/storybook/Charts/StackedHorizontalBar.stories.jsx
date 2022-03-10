import React from 'react'

import { useTheme } from '@material-ui/core'

import { StackedHorizontalBar } from '@ues-behaviour/dashboard'

import { getCustomPalette, getStackedHorizontalBarData } from './chartData'

const StackedHorizontalBarStory = ({ ...args }) => {
  const theme = useTheme()
  const data = getStackedHorizontalBarData()
  const customPalette = getCustomPalette(theme)
  return (
    <div style={{ maxWidth: '500px' }}>
      <StackedHorizontalBar data={data} {...args} customPalette={customPalette} />
    </div>
  )
}

export const stackedHorizontalBar = StackedHorizontalBarStory.bind({})

export default {
  title: 'Charts',
  component: StackedHorizontalBar,
}
