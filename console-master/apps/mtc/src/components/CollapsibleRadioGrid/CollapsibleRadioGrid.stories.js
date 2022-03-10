import React from 'react'

import centered from '@storybook/addon-centered'
import { boolean } from '@storybook/addon-knobs/react'
import { storiesOf } from '@storybook/react'

import CollapsibleRadioGrid from './CollapsibleRadioGrid'

const stories = storiesOf('CollapsibleRadioGrid', module)

stories.addDecorator(centered)

const data = [
  {
    category: 'Active Script',
    value: 'alert',
  },
  {
    category: 'Powershell',
    value: 'block',
  },
  {
    category: 'Macros',
    value: 'alert',
  },
]

const columns = [
  {
    header: 'Type',
  },
  {
    header: 'Alert',
    value: 'alert',
  },
  {
    header: 'Block',
    value: 'block',
  },
]

const expandedData = [
  {
    category: 'Exploitation',
    subCategories: [
      {
        category: 'Stack Pivot',
        value: 'ignore',
      },
      {
        category: 'Stack Protect',
        value: 'alert',
      },
      {
        category: 'Overwrite Code',
        value: 'block',
      },
    ],
  },
  {
    category: 'Process Injection',
    subCategories: [
      {
        category: 'Remote Allocation of Memory',
        value: 'terminate',
      },
      {
        category: 'Remote Mapping of Memory',
        value: 'alert',
      },
      {
        category: 'Remote Writing of Memory',
        value: 'block',
      },
    ],
  },
  {
    category: 'Escalation',
    subCategories: [
      {
        category: 'LSASS Read',
        value: 'terminate',
      },
      {
        category: 'Zero Allocate',
        value: 'ignore',
      },
    ],
  },
]

const expandedColumns = [
  {
    header: 'Violation Type',
  },
  {
    header: 'Ignore',
    value: 'ignore',
  },
  {
    header: 'Alert',
    value: 'alert',
  },
  {
    header: 'Block',
    value: 'block',
  },
  {
    header: 'Terminate',
    value: 'terminate',
  },
]

stories.add('default', () => (
  <div style={{ width: '700px' }}>
    <CollapsibleRadioGrid data={data} columns={columns} />
  </div>
))

stories.add('accordion', () => (
  <div style={{ width: '700px' }}>
    <CollapsibleRadioGrid
      data={expandedData}
      columns={expandedColumns}
      selectAll={boolean('Select All', false)}
      disabled={boolean('Disabled', false)}
    />
  </div>
))
