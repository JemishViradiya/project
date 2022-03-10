import React, { useCallback, useState } from 'react'

import {
  ChipAutocompleteFilter as ChipAutocompleteFilterComp,
  SimpleFilter,
  useChipAutocompleteFilter,
  useFilter,
} from '@ues/behaviours'

interface ExampleUserItem {
  id: string
  name: string
}

const suggestions = [
  { id: '01', name: 'Chris Vargas' },
  { id: '02', name: 'Chris Nienow' },
  { id: '03', name: 'Clara Balistreri' },
  { id: '04', name: 'Evan Kovacek' },
  { id: '05', name: 'Fidel DuBuque' },
  { id: '06', name: 'Francis Hayes' },
]

function getSuggestions(value: string): ExampleUserItem[] {
  return suggestions.filter(e => e.name.toLowerCase().includes(value.trim().toLowerCase()))
}

export const ChipAutocompleteFilter = ({
  maxSelectedItems,
  minCharacters,
  chipIcon,
  disabled,
  helperText,
}: { maxSelectedItems?: number; minCharacters?: number; chipIcon?: boolean; disabled?: boolean; helperText?: string } = {}) => {
  const filterProps = useFilter<SimpleFilter<string[]>>()

  const [options, setOptions] = useState([])

  const getOptions = useCallback(value => {
    const suggest = value ? getSuggestions(value) : []
    setOptions(suggest)
  }, [])

  const clearOptions = useCallback(() => {
    setOptions([])
  }, [])

  const props = useChipAutocompleteFilter({
    filterProps,
    key: 'chip-autocomplete-filter',
    options,
    getOptions,
    getLabel: ({ name }: ExampleUserItem) => name || '',
    getItemId: ({ id }: ExampleUserItem) => id,
    clearOptions,
    minCharacters,
  })

  return (
    <>
      <ChipAutocompleteFilterComp
        label="Chip Autocomplete Filter"
        {...props}
        chipIcon={chipIcon}
        maxSelectedItems={maxSelectedItems}
        helperText={helperText}
        disabled={disabled}
      />

      <p>Suggestions list:</p>
      <ul>
        {suggestions.map((item, idx) => (
          <li key={idx}>{item.name}</li>
        ))}
      </ul>
    </>
  )
}

ChipAutocompleteFilter.args = {
  maxSelectedItems: 3,
  minCharacters: 3,
  disabled: false,
  chipIcon: true,
  helperText: 'Input helper text ',
}
ChipAutocompleteFilter.argTypes = {
  maxSelectedItems: {
    control: {
      type: 'number',
    },
    defaultValue: { summary: 15 },
    description: 'Max number selected of selected values',
  },
  minCharacters: {
    control: {
      type: 'number',
    },
    defaultValue: { summary: 0 },
    description: 'Minimal characters number to start suggestions search',
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
  helperText: {
    control: {
      type: 'text',
    },
    description: 'Helper text under the search input',
  },
}
