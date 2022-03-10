import classNames from 'classnames'
import PropTypes from 'prop-types'
import React, { memo, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { useEventHandler } from '@ues-behaviour/react'

import HelpTip from '../HelpTip'
import styles from './Tile.module.less'

const prevent = event => {
  event.preventDefault()
}

export const Tile = memo(props => {
  const { child: Child, childProps, children, editMode, className: customClass, titleText, helpText, link, ...rest } = props
  const {
    style: { width: styleWidth, height: styleHeight },
  } = rest
  let width = parseInt(styleWidth.slice(0, -2)) - 36
  if (width < 0) {
    width = 0
  }
  let height = parseInt(styleHeight.slice(0, -2)) - 68
  if (height < 0) {
    height = 0
  }
  const className = useMemo(() => classNames(customClass, styles.container, editMode ? styles.edit : 'nodrag'), [
    customClass,
    editMode,
  ])
  const title = useMemo(() => (helpText && !editMode ? <HelpTip wrappedText={titleText} helpText={helpText} /> : titleText), [
    editMode,
    helpText,
    titleText,
  ])
  const navigate = useNavigate()
  const onClick = useEventHandler(() => {
    if (!editMode) {
      navigate(`/${link}`)
    }
  }, [editMode, link])
  return (
    <div
      role="button"
      tabIndex="-1"
      aria-label={titleText}
      aria-live="polite"
      aria-atomic="true"
      {...rest}
      className={className}
      onClick={onClick}
      onDragStart={prevent}
    >
      <div className={styles.title} aria-hidden="true" title={titleText}>
        {title}
      </div>
      <div className={styles.contents}>
        <Child {...childProps} width={width} height={height} />
        {children}
      </div>
      {editMode ? <div className={styles.editOverlay} /> : null}
    </div>
  )
})

Tile.propTypes = {
  className: PropTypes.string,
  link: PropTypes.string,
  titleText: PropTypes.string,
  child: PropTypes.elementType,
  childProps: PropTypes.object,
  editMode: PropTypes.bool,
  children: PropTypes.node,
}

export default Tile
