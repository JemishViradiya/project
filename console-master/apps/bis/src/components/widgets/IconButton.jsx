import PropTypes from 'prop-types'
import React, { createElement, memo } from 'react'

import MaterialIconButton from '@material-ui/core/IconButton'

import Loading from '../util/Loading'

const IconButton = memo(({ loading = false, ...props }) => {
  const resolvedProps = loading
    ? {
        ...props,
        disabled: true,
        children: <Loading size="1em" inline color="primary" />,
      }
    : props

  return createElement(MaterialIconButton, resolvedProps)
})

IconButton.displayName = 'IconButton'

IconButton.propTypes = {
  ...MaterialIconButton.propTypes,
  loading: PropTypes.bool,
}

export default IconButton
