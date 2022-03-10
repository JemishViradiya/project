import React from 'react'

import { CheckboxFilter as CheckboxFilterComp, SimpleFilter, useCheckboxFilter, useFilter } from '@ues/behaviours'

export const CheckboxFilter = ({ disabled, chipIcon }: { disabled?: boolean; chipIcon?: boolean } = {}) => {
  const filterProps = useFilter<SimpleFilter<string[]>>()
  const props = useCheckboxFilter({
    filterProps,
    key: 'test-checkbox',
  })

  return (
    <CheckboxFilterComp
      label="Checkbox Filter"
      items={['Frozen yoghurt', 'Ice cream sandwich', 'Eclair', 'Cupcake', 'Gingerbread']}
      {...props}
      disabled={disabled}
      chipIcon={chipIcon}
    />
  )
}

CheckboxFilter.args = {
  disabled: false,
  chipIcon: false,
}
CheckboxFilter.argTypes = {
  disabled: {
    control: {
      type: 'boolean',
    },
    description: 'Disable filter component.',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: false },
    },
  },
  chipIcon: {
    control: {
      type: 'boolean',
    },
    description: 'Use chip anchor icon.',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: false },
    },
  },
}
