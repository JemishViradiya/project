import React from 'react'

import { IconListWithValues } from '@ues-behaviour/dashboard'
import { StatusCritical, StatusHigh } from '@ues/assets'

const getData = () => [
  { icon: StatusCritical, color: '#7a1b10', label: 'Label 1', count: 14 },
  { icon: StatusHigh, color: '#d52c16', label: 'Label 2', count: 10 },
]

const IconListStory = ({ onClick, ...args }) => {
  const data = getData()

  if (onClick) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    data.forEach((v, i) => (v.onInteraction = () => {}))
  }

  return (
    <div style={{ height: '90vh', maxWidth: '250px' }}>
      <IconListWithValues data={data} options={args} />
    </div>
  )
}

export const iconListWithValues = IconListStory.bind({})

iconListWithValues.args = {
  onClick: true,
}

export default {
  title: 'Charts/List',
  component: IconListStory,
  argTypes: {
    onClick: {
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: true },
      },
    },
  },
}
