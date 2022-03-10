import React from 'react'

import centered from '@storybook/addon-centered'
import { boolean } from '@storybook/addon-knobs/react'
import { storiesOf } from '@storybook/react'

import CheckList from './'

const stories = storiesOf('CheckList', module)
const data = [
  {
    label: 'Thing 1',
    accessor: '1',
    value: false,
  },
  {
    label: 'Thing 2',
    accessor: '2',
    value: true,
  },
  {
    label: 'Thing 3',
    accessor: '3',
    value: false,
  },
  {
    label: 'Thing 4',
    accessor: '4',
    value: true,
  },
  {
    label: 'Thing 5',
    accessor: '5',
    value: false,
  },
]

stories.addDecorator(centered)

stories.add('checkbox list', () => (
  <CheckList
    data={data}
    dense={boolean('Dense View', false)}
    selectAll={boolean('Select All', true)}
    filter={boolean('Filter', true)}
    dividers={boolean('Dividers', true)}
    errorState={boolean('Error State', false)}
  />
))
