// dependencies
import React from 'react'

// components
import Typography from '@material-ui/core/Typography'

const highlightMatch = (option = '', inputValue = '') => {
  const startIndex = option.toLowerCase().indexOf(inputValue.toLowerCase())

  return startIndex >= 0 ? (
    <Typography color="textPrimary">
      {option.substring(0, startIndex)}
      <strong>{option.substring(startIndex, startIndex + inputValue.length)}</strong>
      {option.substring(startIndex + inputValue.length)}
    </Typography>
  ) : (
    <Typography color="textPrimary">{option}</Typography>
  )
}

export { highlightMatch }
