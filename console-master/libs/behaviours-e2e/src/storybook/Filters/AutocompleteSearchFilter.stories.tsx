import React, { useCallback, useState } from 'react'

import type { SimpleFilter } from '@ues/behaviours'
import {
  AutocompleteSearchFilter as AutocompleteSearchFilterComponent,
  OPERATOR_VALUES,
  useAutocompleteSearchFilter,
  useFilter,
} from '@ues/behaviours'

function getAutocompleteValues(value) {
  return ['Chris Vargas', 'Chris Nienow', 'Clara Balistreri', 'Evan Kovacek', 'Fidel DuBuque', 'Francis Hayes'].filter(e =>
    e.includes(value),
  )
}

export const AutocompleteSearchFilter = ({
  allowFreeInput,
  minCharacters,
  debounceInterval,
  helperText,
}: { allowFreeInput?: boolean; minCharacters?: number; debounceInterval?: number; helperText?: string } = {}) => {
  const filterProps = useFilter<SimpleFilter<string>>()
  const [options, setOptions] = useState([])

  const getOptions = useCallback(value => {
    const suggest = value ? getAutocompleteValues(value) : []
    setOptions(suggest)
  }, [])

  const clearOptions = useCallback(() => {
    setOptions([])
  }, [])

  const props = useAutocompleteSearchFilter({
    filterProps,
    key: 'name',
    defaultOperator: OPERATOR_VALUES.CONTAINS,
    options,
    getOptions,
    clearOptions,
    allowFreeInput,
    minCharacters,
    debounceInterval,
  })
  return <AutocompleteSearchFilterComponent label="Autocomplete search filter" {...props} helperText={helperText} />
}

AutocompleteSearchFilter.args = {
  allowFreeInput: true,
  minCharacters: 3,
  debounceInterval: 300,
  helperText: 'Input helper text ',
}
AutocompleteSearchFilter.argTypes = {
  allowFreeInput: {
    control: {
      type: 'boolean',
    },
    defaultValue: { summary: true },
    description: 'Allow input any values',
  },
  minCharacters: {
    control: {
      type: 'number',
    },
    defaultValue: { summary: 0 },
    description: 'Minimal characters number for suggestions search',
  },
  debounceInterval: {
    control: {
      type: 'number',
      min: 0,
      max: 1000,
    },
    defaultValue: { summary: 300 },
    description: 'Debounce time for suggestions search (in milliseconds)',
  },
  helperText: {
    control: {
      type: 'text',
    },
    description: 'Helper text under the search input',
  },
}
AutocompleteSearchFilter.parameters = {
  docs: { source: { code: 'Disabled. Blocked by https://jirasd.rim.net/browse/UES-6921' } },
}
