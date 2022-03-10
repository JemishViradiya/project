import PropTypes from 'prop-types'
import React from 'react'

import Paper from '@material-ui/core/Paper'
import CloseIcon from '@material-ui/icons/Close'

require('./MenuItem.scss')

export const MenuItem = props => (
  <Paper
    className={`menu-item ${props.disabled ? 'disabled' : ''} ${props.selected ? 'selected' : ''}`}
    elevation={0}
    id={props.id ? props.id : null}
  >
    <div className="menu-info-container" onClick={props.disabled || !props.onSelect ? null : () => props.onSelect(props.id)}>
      <div className="menu-item-title">
        <h3>{props.title}</h3>
      </div>
      <div className="menu-item-description">{props.description}</div>
    </div>
    {props.closeIcon ? (
      <div className="menu-icon-container">
        <CloseIcon
          className={`menu-item-close-button ${props.disabled ? 'disabled' : ''}`}
          onClick={props.disabled || !props.onClose ? null : () => props.onClose(props.id)}
        />
      </div>
    ) : null}
  </Paper>
)

MenuItem.propTypes = {
  onClose: PropTypes.func,
  closeIcon: PropTypes.bool,
  description: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  selected: PropTypes.bool,
  onSelect: PropTypes.func,
  title: PropTypes.string,
}

export default MenuItem
