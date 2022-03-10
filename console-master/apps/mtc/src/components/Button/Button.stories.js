import React from 'react'

import { action } from '@storybook/addon-actions'
import centered from '@storybook/addon-centered'
import { boolean } from '@storybook/addon-knobs/react'
import { storiesOf } from '@storybook/react'

import Button from './'
import SplitButton from './split'

const stories = storiesOf('Button', module)

stories.addDecorator(centered)

stories.add('flat button', () => (
  <Button onClick={action('Clicked')} disabled={boolean('Disabled', false)}>
    So flat
  </Button>
))

stories.add('outlined button', () => (
  <Button outlined onClick={action('Clicked')} disabled={boolean('Disabled', false)}>
    So outline
  </Button>
))

stories.add('with tooltip', () => (
  <Button
    tooltip={{
      active: true,
      message: "I'm a toolip",
    }}
    onClick={action('Clicked')}
    disabled={boolean('Disabled', false)}
  >
    Tooltip
  </Button>
))

const options = ['Option #1', 'Option #2', 'Option #3']
const totalCount = 0

stories.add('split button', () => (
  <SplitButton
    options={options}
    totalCount={totalCount}
    onClick={action('Clicked')} // eslint-disable-line
  />
))
