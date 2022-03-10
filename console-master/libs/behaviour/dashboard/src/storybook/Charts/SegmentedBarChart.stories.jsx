import React from 'react'

import { SegmentedBarChart } from '@ues-behaviour/dashboard'

import { getSegmentedBarData } from './chartData'

const SegmentedBarStory = ({ barsCount, segmentsCount, ...args }) => {
  const data = getSegmentedBarData(barsCount, segmentsCount)
  return (
    <div style={{ height: '90vh' }}>
      <SegmentedBarChart data={data} options={args} />
    </div>
  )
}

export const SegmentedBar = SegmentedBarStory.bind({})

SegmentedBar.args = {
  colorScheme: 'default',
  barsCount: 5,
  segmentsCount: 4,
  showLabel: true,
  sort: true,
}

export default {
  title: 'Charts/SegmentedBar',
  component: SegmentedBarStory,
  argTypes: {
    barsCount: {
      control: { type: 'number', min: 1 },
      description: 'Used to generate mock data bars.',
    },
    segmentsCount: {
      control: { type: 'number', min: 1 },
      description: 'Used to generate mock data segments. When using the alert colors, the max is 5.',
    },
    showLabel: {
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: true },
      },
    },
    sort: {
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: true },
      },
    },
    colorScheme: {
      control: { type: 'select', options: ['default', 'alert'] },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
    },
  },
}
