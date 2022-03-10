import React from 'react'

import type { SimpleFilter } from '@ues/behaviours'
import { OPERATOR_VALUES, QuickSearchFilter as QuickSearchFilterComp, useFilter, useQuickSearchFilter } from '@ues/behaviours'

import markdown from './QuickSearch.md'

const QuickSearchFilterWithMinimumCharacters = ({ requireMinimumCharacters, filterProps }) => {
  const props = useQuickSearchFilter({
    filterProps,
    key: 'name',
    defaultOperator: OPERATOR_VALUES.CONTAINS,
    requireMinimumCharacters: requireMinimumCharacters,
  })
  return <QuickSearchFilterComp label="Quick search filter" requireMinimumCharacters={requireMinimumCharacters} {...props} />
}

const QuickSearchFilterStory = ({ requireMinimumCharacters }) => {
  const filterProps = useFilter<SimpleFilter<string>>()

  return <QuickSearchFilterWithMinimumCharacters requireMinimumCharacters={requireMinimumCharacters} filterProps={filterProps} />
}

export const QuickSearchFilter = QuickSearchFilterStory.bind({})

QuickSearchFilter.parameters = { notes: markdown }
QuickSearchFilter.args = {
  requireMinimumCharacters: false,
}
