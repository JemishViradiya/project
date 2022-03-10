import React from 'react'

require('./FakeLinkCell.scss')

const FakeLinkCell = props => {
  const { display, onClick } = props
  return display ? (
    <span className="fake-link" onClick={onClick}>
      {display}
    </span>
  ) : (
    <span>—</span>
  )
}

export default FakeLinkCell
