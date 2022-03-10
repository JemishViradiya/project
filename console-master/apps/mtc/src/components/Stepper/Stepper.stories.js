import React from 'react'

import { storiesOf } from '@storybook/react'

import Stepper from './index.js'

const stories = storiesOf('Stepper', module)

const steps = [
  {
    label: 'Step 1',
    content: <p>{"I'm on step 1"}</p>,
  },
  {
    label: 'Step 2',
    content: <p>{"I'm on step 2"}</p>,
  },
]

stories.add('Basic Stepper', () => <Stepper steps={steps} />)
