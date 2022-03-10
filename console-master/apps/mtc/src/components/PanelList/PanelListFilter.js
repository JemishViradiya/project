import { debounce } from 'lodash'
import React from 'react'

import Search from '@material-ui/icons/Search'

import { Text } from '../Input/Text'

const PanelListFilter = ({ onChange, totalMatches, resource }) => {
  const debouncedOnChange = debounce(onChange, 300)

  const handleChange = event => {
    event.persist()
    debouncedOnChange(event.target.value)
  }

  return (
    <Text
      className="panel-list-filter"
      label="Quick Filter"
      margin="normal"
      onChange={handleChange}
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus
      startAdornment={<Search />}
      endAdornment={<p style={{ 'white-space': 'nowrap' }}>{`${totalMatches} ${resource ? `${resource}s` : 'matches'}`}</p>} // eslint-disable-line sonarjs/no-nested-template-literals
    />
  )
}

export default PanelListFilter
