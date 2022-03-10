import React from 'react'

import history from '../../configureHistory'

require('./BackButton.scss')

const BackButton = props => {
  const { name, url } = props

  const goBack = () => {
    history.push(url)
  }

  if (name) {
    return (
      <div className="back-button">
        <span className="icon-arrow-left" onClick={goBack} />
        <h2>{name}</h2>
      </div>
    )
  } else {
    return null
  }
}

export default BackButton
