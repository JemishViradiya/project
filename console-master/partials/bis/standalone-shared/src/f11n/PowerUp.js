import PropTypes from 'prop-types'
import React, { memo, useContext } from 'react'

import { Context } from './Provider'

const PowerUp = memo(({ name, enabled, disabled, loading = null, ...props }) => {
  const { loading: isLoading, value: { f11n = {} } = {} } = useContext(Context)
  if (isLoading) {
    return loading
  }
  return React.createElement(f11n[name] ? enabled : disabled, props)
})
PowerUp.displayName = 'PowerUp'
PowerUp.propTypes = {
  name: PropTypes.string.isRequired,
  enabled: PropTypes.elementType.isRequired,
  disabled: PropTypes.elementType.isRequired,
  loading: PropTypes.node,
}

export default PowerUp
