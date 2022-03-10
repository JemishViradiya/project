import cn from 'classnames'
import PropTypes from 'prop-types'
import React, { memo } from 'react'

import CircularProgress from '@material-ui/core/CircularProgress'

import styles from './Loading.module.less'

const DEFAULT_INLINE_SIZE = 16
const DEFAULT_STANDALONE_SIZE = 60

const Loading = memo(({ inline, className, size, color = 'primary' }) => {
  const progressSize = size || (inline ? DEFAULT_INLINE_SIZE : DEFAULT_STANDALONE_SIZE)
  return (
    <div className={cn(styles.layout, inline ? undefined : styles.standalone, className)} aria-label="Loading">
      <CircularProgress size={progressSize} color={color} />
    </div>
  )
})

Loading.displayName = 'Loading'
Loading.propTypes = {
  inline: PropTypes.bool,
  className: PropTypes.string,
  size: PropTypes.number,
  color: PropTypes.oneOf(['primary', 'secondary', 'inherit']),
}

export default Loading
