import React from 'react'

import type { SimpleFilter } from '@ues/behaviours'
import { RadioFilter as RadioFilterComp, useFilter, useRadioFilter } from '@ues/behaviours'

export const RadioFilter = ({ closeAfterSelect }: { closeAfterSelect?: boolean } = {}) => {
  const filterProps = useFilter<SimpleFilter<string>>()
  const props = useRadioFilter({
    filterProps,
    key: 'test',
  })

  return (
    <RadioFilterComp
      label="Radio Filter"
      items={['Frozen yoghurt', 'Ice cream sandwich', 'Eclair', 'Cupcake', 'Gingerbread']}
      {...props}
      closeAfterSelect={closeAfterSelect}
    />
  )
}

RadioFilter.args = {
  closeAfterSelect: false,
}
RadioFilter.argTypes = {
  closeAfterSelect: {
    control: {
      type: 'boolean',
    },
    description: 'Close filter popup after value selected.',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: false },
    },
  },
}
RadioFilter.parameters = {
  docs: { source: { code: 'Disabled. Blocked by https://jirasd.rim.net/browse/UES-6921' } },
}
