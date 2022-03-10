import debounce from 'lodash/debounce'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import Chip from '@material-ui/core/Chip'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import { useStatefulAsyncQuery } from '@ues-data/shared'

import { queryDirectoryUsers } from './query'

type SearchDirectoryUsersMultipleProps = {
  label: string
  searchPlaceholder: string
  field: string
}

function useSearchDirectoryUsersMultiple({
  label,
  searchPlaceholder,
  field,
}: SearchDirectoryUsersMultipleProps): Record<string, unknown> {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [value, setValue] = useState([])

  const TEMP_TENTANT = 'L60858679'

  const { data, loading } = useStatefulAsyncQuery(queryDirectoryUsers, {
    variables: { tenantId: TEMP_TENTANT, search: inputValue },
  })

  return {
    open: open,
    onOpen: useCallback(() => {
      setOpen(true)
    }, []),
    onClose: useCallback(() => {
      setOpen(false)
    }, []),
    value: value,
    onChange: useCallback((event, newValue) => {
      event.persist()
      setValue(newValue)
    }, []),
    inputValue: inputValue,
    onInputChange: useCallback((event, value) => {
      setInputValue(value)
    }, []),
    autoHighlight: true,
    multiple: true,
    selectOnFocus: true,
    getOptionSelected: useMemo(() => (option, value) => option[field] === value[field], [field]),
    getOptionLabel: option => `${option['displayName']} (${option['emailAddress']})`,
    options: data ? data : [],
    loading: loading,
    renderTags: useCallback(
      (value, getTagProps) =>
        value.map((option, index) => (
          <Chip variant="outlined" label={<Typography variant="body2">{option[field]}</Typography>} {...getTagProps({ index })} />
        )),
      [field],
    ),
    renderInput: useCallback(
      params => <TextField {...params} fullWidth variant="filled" placeholder={searchPlaceholder} label={label} />,
      [label, searchPlaceholder],
    ),
  }
}
export { useSearchDirectoryUsersMultiple }
