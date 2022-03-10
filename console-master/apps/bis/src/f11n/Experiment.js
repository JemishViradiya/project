import PropTypes from 'prop-types'
import React, { memo, useContext } from 'react'

import { Context } from './Provider'

const Experiment = memo(({ name, variants, loading = null, ...props }) => {
  const { loading: isLoading, value: { f11n = {} } = {} } = useContext(Context)
  if (isLoading) {
    return loading
  }
  const variant = f11n[name] || 'Control'
  props[name] = variant
  return React.createElement(variants[variant], props)
})
Experiment.displayName = 'PowerUp.Experiment'
Experiment.propTypes = {
  name: PropTypes.string.isRequired,
  variants: PropTypes.objectOf(PropTypes.elementType),
  loading: PropTypes.node,
}

export default Experiment
