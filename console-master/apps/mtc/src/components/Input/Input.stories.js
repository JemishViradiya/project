import React from 'react'

import { action } from '@storybook/addon-actions'
import centered from '@storybook/addon-centered'
import { boolean, text } from '@storybook/addon-knobs/react'
import { storiesOf } from '@storybook/react'

import { Text } from './'

const stories = storiesOf('Input', module)

stories.addDecorator(centered)

stories.add('Simple Text', () => (
  <Text
    label={text('Label', 'Label')}
    helperText={text('Helper Text', 'I am helping')}
    onChange={action('On change event fired')}
    disabled={boolean('Disabled', false)}
    fullWidth
  />
))
