import React from 'react'

require('./Badge.scss')

const Badge = props => {
  const { color, text } = props
  return <span className={`badge ${color}`}>{text}</span>
}

export default Badge
