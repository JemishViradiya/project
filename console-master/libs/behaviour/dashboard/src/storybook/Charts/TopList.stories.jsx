import React from 'react'

import { TopList } from '@ues-behaviour/dashboard'

import { getBarData } from './chartData'

const TopListStory = ({ valuesCount, showSecondaryText, ...args }) => {
  const data = getBarData(valuesCount)
  if (showSecondaryText) {
    data.forEach((v, i) => (v.secondary = `Secondary text ${i + 1}`))
  }
  return (
    <div style={{ height: '90vh' }}>
      <TopList data={data} options={args} />
    </div>
  )
}

export const Top = TopListStory.bind({})

Top.args = {
  valuesCount: 10,
  showTooltip: true,
  showSecondaryText: true,
}

export default {
  title: 'Charts/Top List',
  component: TopListStory,
  argTypes: {
    valuesCount: {
      control: { type: 'number', min: 1 },
      description: 'Used to generate mock data.',
    },
    showTooltip: {
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: true },
      },
    },
    showSecondaryText: {
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: true },
      },
    },
  },
}
