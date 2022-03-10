import React from 'react'

import { useTheme } from '@material-ui/core'

import { LineChart } from '@ues-behaviour/dashboard'

import { getCustomPalette, getData, getDataWithCustomColorPalette } from './chartData'

const LineStoryDefaultColors = ({ seriesNum, hours, ...args }) => {
  const data = getData(seriesNum, hours)
  return <LineChart data={data} height={400} additionalProps={args} />
}

export const DefaultColors = LineStoryDefaultColors.bind({})

DefaultColors.args = {
  hours: 10,
  seriesNum: 1,
  showLegend: true,
  showTooltip: true,
  showZoom: true,
}

const LineStoryCustomColors = ({ hours, ...args }) => {
  const theme = useTheme()
  const data = getDataWithCustomColorPalette(hours)
  const customPalette = getCustomPalette(theme)

  return <LineChart data={data} height={400} additionalProps={args} customPalette={customPalette} />
}

export const CustomColors = LineStoryCustomColors.bind({})

CustomColors.args = {
  hours: 10,
  seriesNum: 1,
  showLegend: true,
  showTooltip: true,
  showZoom: true,
}

export default {
  title: 'Charts/Line',
  component: LineChart,
  argTypes: {
    hours: {
      control: { type: 'number', min: 1 },
      description: 'Used to generate mock data points.',
    },
    seriesNum: {
      control: { type: 'number', min: 1 },
      description: 'Used to generate mock data points.',
    },
    showLegend: {
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: true },
      },
    },
    showTooltip: {
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: true },
      },
    },
    showZoom: {
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: true },
      },
    },
  },
}
