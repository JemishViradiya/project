import React from 'react'

import { PieChart } from '@ues-behaviour/dashboard'

import { getPieData } from './chartData'
import markdown from './PieChart.md'

const PieStory = ({ sectorsCount, ...args }) => {
  const data = getPieData(sectorsCount)
  return <PieChart title="PieChart" data={data} height={400} additionalProps={args} />
}

export const Pie = PieStory.bind({})

Pie.args = {
  colorScheme: 'default',
  sectorsCount: 5,
  showLegend: true,
  scrollableLegend: true,
  verticalAlign: false,
  donut: true,
  selectable: true,
}

export default {
  title: 'Charts/Pie',
  component: PieStory,
  parameters: {
    notes: markdown,
  },
  argTypes: {
    sectorsCount: {
      control: { type: 'number', min: 1 },
      description: 'Used to generate mock data sectors. When using the alert colors, the max is 5.',
    },
    colorScheme: {
      control: { type: 'select', options: ['default', 'alert'] },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
    },
    showLegend: {
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: true },
      },
    },
    scrollableLegend: {
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: true },
      },
    },
    verticalAlign: {
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
    },
    donut: {
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: true },
      },
    },
    selectable: {
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: true },
      },
    },
  },
}
