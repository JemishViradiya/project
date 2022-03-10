import PropTypes from 'prop-types'
import React, { memo } from 'react'

import { ArrowCaretDown, ArrowCaretRight, ArrowChevronDown, ArrowChevronRight } from '@ues/assets'

import useToggle from '../hooks/useToggle'
import { Icon } from '../icons/Icon'
import styles from './CollapsibleInfo.module.less'

const CollapsibleInfo = memo(({ useChevron, collapsed, title, children }) => {
  const [isCollapsed, onClick] = useToggle(collapsed)

  let iconName
  if (useChevron) {
    iconName = isCollapsed ? ArrowChevronRight : ArrowChevronDown
  } else {
    iconName = isCollapsed ? ArrowCaretRight : ArrowCaretDown
  }

  return (
    <div className={styles.info}>
      <div className={styles.titleBar} role="button" tabIndex="-1" onClick={onClick}>
        <div className={styles.icon}>
          <Icon icon={iconName} />
        </div>
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.content}>{isCollapsed ? null : children}</div>
    </div>
  )
})

CollapsibleInfo.displayName = 'CollapsibleInfo'
CollapsibleInfo.propTypes = {
  children: PropTypes.node.isRequired,
  collapsed: PropTypes.any,
  title: PropTypes.string.isRequired,
  useChevron: PropTypes.any,
}

export default CollapsibleInfo
