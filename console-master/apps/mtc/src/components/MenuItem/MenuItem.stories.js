import React from 'react'

import centered from '@storybook/addon-centered'
import { boolean } from '@storybook/addon-knobs/react'
import { storiesOf } from '@storybook/react'

import MenuItem from '../MenuItem'

const stories = storiesOf('MenuItem', module)

stories.addDecorator(centered)

stories.add('default', () => (
  <div style={{ width: '700px' }}>
    <MenuItem
      onClose={() => console.log('Close callback click!')} //eslint-disable-line
      closeIcon={boolean('Close Icon', true)}
      description="A very nice description that is also quite long."
      disabled={boolean('Disabled', false)}
      id="some-unique-id"
      selected={boolean('Selected', false)}
      onSelect={id => console.log(`Selected ${id} callback click!`)} //eslint-disable-line
      title="Im a title!"
    />
  </div>
))

stories.add('small', () => (
  <div style={{ width: '250px' }}>
    <MenuItem
      onClose={() => console.log('Close callback click!')} //eslint-disable-line
      closeIcon={boolean('Close Icon', true)}
      description="A very nice description that is also quite long."
      id="some-unique-id-small-version"
      selected={boolean('Selected', false)}
      onSelect={id => console.log(`Selected ${id} callback click!`)} //eslint-disable-line
      disabled={boolean('Disabled', false)}
      title="Im a title!"
    />
  </div>
))
