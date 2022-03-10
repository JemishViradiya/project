/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import PropTypes from 'prop-types'
import React from 'react'

import Box from '@material-ui/core/Box'

export const TabPanel = props => {
  const { children, value, index, alwaysMount, padding, ...other } = props
  const boxPadding = padding ? { px: 8, py: 6 } : {}

  return (
    <div role="tabpanel" hidden={value !== index} id={`nav-tabpanel-${index}`} {...other}>
      {(value === index || alwaysMount) && <Box {...boxPadding}>{children}</Box>}
    </div>
  )
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
  className: PropTypes.string,
  alwaysMount: PropTypes.bool,
  padding: PropTypes.bool,
}
