import React from 'react'

import { BarChart } from '@ues-behaviour/dashboard'

import { getBarData } from './chartData'

const BarStory = ({ barsCount, ...args }) => {
  const data = getBarData(barsCount)
  return (
    <div style={{ height: '90vh' }}>
      <BarChart data={data} options={args} />
    </div>
  )
}

export const Bar = BarStory.bind({})

Bar.args = {
  barsCount: 5,
  showLabel: true,
  sort: true,
}

export default {
  title: 'Charts/Bar',
  component: BarStory,
  argTypes: {
    barsCount: {
      control: { type: 'number', min: 1 },
      description: 'Used to generate mock data bars.',
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
  },
}
