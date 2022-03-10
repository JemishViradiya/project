import React from 'react'

import { TotalStats } from '@ues-behaviour/dashboard'

import { getData } from './chartData'

const TotalStatsStory = ({ hours, title, subtitle, ...args }) => {
  return (
    <div style={{ height: '40vh', width: '40vw' }}>
      <TotalStats id="totalStatsInStory" data={getData(1, hours)[0]} title={title} subtitle={subtitle} {...args} />
    </div>
  )
}

export const Stats = TotalStatsStory.bind({})

Stats.args = {
  hours: 10,
  title: '99,999',
  subtitle: 'Some quite long description that may take two lines',
}

export default {
  title: 'Charts/Total Stats',
  component: TotalStatsStory,
  argTypes: {
    hours: {
      control: { type: 'number', min: 1 },
      description: 'Used to generate mock data points.',
    },
    title: {
      control: { type: 'text' },
      description: 'Current value title.',
    },
    subtitle: {
      control: { type: 'text' },
      description: 'Text below the title.',
    },
  },
}
