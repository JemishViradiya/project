import PropTypes from 'prop-types'
import React, { memo } from 'react'

import styles from './Tooltip.module.less'

const Tooltip = memo(({ children }) => {
  return <div className={styles.tooltip}>{children}</div>
})

Tooltip.propTypes = {
  children: PropTypes.element.isRequired,
}

export default Tooltip
