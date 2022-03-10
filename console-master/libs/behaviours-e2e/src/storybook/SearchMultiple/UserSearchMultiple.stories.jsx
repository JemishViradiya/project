/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react'

import Autocomplete from '@material-ui/lab/Autocomplete'

import { useSearchDirectoryUsersMultiple } from '@ues-data/platform'
import { MockProvider } from '@ues-data/shared'

const decorator = Story => (
  <MockProvider value={true}>
    <DirectoryUserSearchMultiple></DirectoryUserSearchMultiple>
  </MockProvider>
)

export const DirectoryUserSearchMultiple = () => {
  return (
    <Autocomplete
      {...useSearchDirectoryUsersMultiple({
        label: 'Add a recipient',
        searchPlaceholder: 'Recipients',
        field: 'emailAddress',
      })}
    ></Autocomplete>
  )
}

export default {
  title: 'Form/Directory/Search',
  decorators: [decorator],
}
