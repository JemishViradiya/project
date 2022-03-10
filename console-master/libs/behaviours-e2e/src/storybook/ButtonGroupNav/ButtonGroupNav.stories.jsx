import React from 'react'

import { Typography } from '@material-ui/core'

import { ButtonGroupNav as ButtonGroupNavComponent, ContentAreaPanel } from '@ues/behaviours'

import { randomString, reallyLongString } from '../utils'

const Button1Content = () => <Typography>{reallyLongString}</Typography>
const Button2Content = () => <Typography>{randomString(3)}</Typography>

const buttons = [
  { label: 'Button1', component: <Button1Content /> },
  { label: 'Button2', component: <Button2Content /> },
  {
    label: 'Button3',
    component: <Button2Content />,
    description: randomString(1),
  },
]

const ButtonGroupNavStory = ({ size }) => (
  <ContentAreaPanel title="Page with ButtonGroupNav">
    <ButtonGroupNavComponent items={buttons} size={size} />
  </ContentAreaPanel>
)

export const ButtonGroupNav = ButtonGroupNavStory.bind({})

ButtonGroupNav.args = {
  size: 'medium',
}

export default {
  title: 'Layout/Page elements/Button Group Nav',
  component: ButtonGroupNavStory,
  argTypes: {
    size: {
      control: {
        type: 'inline-radio',
        options: ['small', 'medium', 'large'],
      },
      defaultValue: { summary: 'medium' },
      description: 'Size',
    },
  },
}
