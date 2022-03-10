import cn from 'classnames'
import PropTypes from 'prop-types'
import React, { memo, useMemo } from 'react'

import { useTheme } from '@material-ui/core/styles'

import { BasicInfo, StatusMedium } from '@ues/assets'

import { Icon } from '../icons/Icon'
import styles from './Alert.module.less'

const icons = {
  warning: StatusMedium,
  info: BasicInfo,
}

const Alert = memo(
  ({ className, contentClassName = styles.content, severity = 'warning', minimal = false, width100 = true, children }) => {
    const { palette } = useTheme()

    const colors = useMemo(
      () => ({
        warning: palette.util.warning,
        info: palette.util.info,
      }),
      [palette],
    )

    return (
      <div role="alert" className={cn(className, minimal ? styles.minimal : styles.box, width100 ? styles.fullWidth : undefined)}>
        <Icon className={styles.icon} icon={icons[severity]} color={colors[severity]} />
        <div className={contentClassName}>{children}</div>
      </div>
    )
  },
)

Alert.displayName = 'Alert'

Alert.propTypes = {
  severity: PropTypes.oneOf(Object.keys(icons)),
}

export default Alert
