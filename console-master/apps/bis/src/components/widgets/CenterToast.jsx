import cn from 'classnames'
import PropTypes from 'prop-types'
import React, { memo, useEffect, useState } from 'react'

import Tooltip from '../Tooltip'
import styles from './CenterToast.module.less'

const CenterToast = memo(({ children, close, time = 2000 }) => {
  const [transition, setTransition] = useState('')
  const transitionLength = 250 // ms - change if CenterToast.less changes
  const toastStyle = cn(styles.toast, transition)

  // fade in, hold for ${time}, then fade out and close
  useEffect(() => {
    let timeout
    if (transition === styles.fadeIn) {
      timeout = setTimeout(() => {
        setTransition(styles.fadeOut)
      }, Math.max(time, transitionLength))
    } else if (transition === styles.fadeOut) {
      timeout = setTimeout(() => {
        close()
      }, transitionLength)
    } else if (!transition) {
      timeout = setTimeout(() => setTransition(styles.fadeIn), 1)
    }

    return () => clearTimeout(timeout)
  }, [close, time, transition])

  return (
    <div className={toastStyle}>
      <Tooltip className={toastStyle}>{children}</Tooltip>
    </div>
  )
})

export default CenterToast

CenterToast.propTypes = {
  children: PropTypes.element,
  close: PropTypes.func.isRequired,
  time: PropTypes.number,
}
