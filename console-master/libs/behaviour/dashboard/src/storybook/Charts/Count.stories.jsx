import React from 'react'

import { Count } from '@ues-behaviour/dashboard'
import { DeviceMobile } from '@ues/assets'

const CountStory = ({ count, description, showChange, prevCount, isIncreaseGood, ...args }) => {
  return (
    <div style={{ height: '90vh' }}>
      <Count
        count={count}
        description={description}
        icon={DeviceMobile}
        showChange={showChange}
        isIncreaseGood={isIncreaseGood}
        prevCount={prevCount}
      />
    </div>
  )
}

export const withChange = CountStory.bind({})

withChange.args = {
  count: 100,
  description: 'Mobile devices with threat alerts',
  showChange: true,
  isIncreaseGood: true,
  prevCount: 20,
}

export default {
  title: 'Charts/Count',
  component: CountStory,
  argTypes: {
    count: {
      control: { type: 'number' },
      description: 'The Count value',
    },
    description: {
      control: { type: 'text' },
      description: 'Text below the Count value',
    },
    showChange: {
      control: { type: 'boolean' },
      description: 'Whether to display Change',
    },
    isIncreaseGood: {
      control: { type: 'boolean' },
      description:
        'Use positive background color if a numerical increase from prevCount to Count is Good, otherwise treat inceases as Bad',
    },
    prevCount: {
      control: { type: 'number' },
      description: 'The previous count',
    },
  },
}
