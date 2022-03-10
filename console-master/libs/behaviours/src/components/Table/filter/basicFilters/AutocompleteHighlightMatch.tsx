import React from 'react'

import Typography from '@material-ui/core/Typography'

interface AutocompleteHighlightMatchProps<TFilter extends unknown> {
  option: TFilter
  inputValue: string
  getLabel: (option: TFilter) => string
}

export const AutocompleteHighlightMatch = <TFilter extends unknown>({
  option,
  inputValue,
  getLabel,
}: AutocompleteHighlightMatchProps<TFilter>) => {
  const label = getLabel ? getLabel(option) : (option as string)
  const startIndex = label.toLowerCase().indexOf(inputValue.toLowerCase())

  return startIndex >= 0 ? (
    <Typography color="textPrimary">
      {label.substring(0, startIndex)}
      <strong>{label.substring(startIndex, startIndex + inputValue.length)}</strong>
      {label.substring(startIndex + inputValue.length)}
    </Typography>
  ) : (
    <Typography color="textPrimary">{label}</Typography>
  )
}
