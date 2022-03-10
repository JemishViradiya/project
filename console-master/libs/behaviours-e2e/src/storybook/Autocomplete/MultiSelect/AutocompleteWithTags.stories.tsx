// dependencies
import React, { useState } from 'react'

import { AutocompleteTags } from '@ues/behaviours/src/components/Autocomplete/AutocompleteTags'

// data
import { top100Films } from './../autocomplete.data'

export const AutocompleteWithTags = props => {
  const [addedTags, setAddedTags] = useState<string[]>([])
  const properTags = top100Films.map(val => val.title.split(' ').join(''))

  const handleAddTags = (newTags: string[]) => {
    setAddedTags(newTags)
  }

  return <AutocompleteTags tags={properTags} addedTags={addedTags} handleAddTags={handleAddTags} label={props.label} />
}

AutocompleteWithTags.args = {
  label: 'Tags',
}

export default {
  title: 'Autocomplete with tags',
}
