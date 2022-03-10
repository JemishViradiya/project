import PropTypes from 'prop-types'
import React, { memo } from 'react'

import styles from './Header.module.less'

const stylesRowSpaceBetween = `${styles.row} ${styles.spaceBetween}`

const SubHeader = memo(({ children, actions, desc }) => {
  return (
    <header className={styles.subHeader}>
      <div className={stylesRowSpaceBetween}>
        <div role="heading" aria-level="2" className={styles.desc}>
          {desc}
        </div>
        {actions}
      </div>
      {children}
    </header>
  )
})

SubHeader.displayName = 'SubHeader'

SubHeader.propTypes = {
  children: PropTypes.node,
  desc: PropTypes.node,
  actions: PropTypes.node,
}

SubHeader.defaultProps = {
  children: null,
  actions: null,
}

export default SubHeader
