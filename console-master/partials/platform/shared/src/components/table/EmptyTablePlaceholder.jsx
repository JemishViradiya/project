/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import PropTypes from 'prop-types'
import React from 'react'

import { TableCell, TableRow, Typography } from '@material-ui/core'

export const EmptyTablePlaceholder = props => {
  const { message, colSpan = 1, styleName = '' } = props

  return (
    <TableRow className={styleName}>
      <TableCell colSpan={colSpan} align="center">
        <Typography variant="body2">{message}</Typography>
      </TableCell>
    </TableRow>
  )
}

EmptyTablePlaceholder.propTypes = {
  message: PropTypes.string.isRequired,
  colSpan: PropTypes.number,
  styleName: PropTypes.string,
}
