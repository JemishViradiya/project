import React from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'

require('./Card.scss')

const Card = props => {
  const { loading, children, editable, editMode, editCallback, saveCallback, cancelCallback, visible, dimmed, inline } = props
  if (typeof visible === 'undefined' || visible === null || visible === true) {
    return (
      <div className={`card ${inline ? 'inline' : ''}`}>
        {editable && !editMode && (
          <div className="edit-controls">
            <span className="icon-pencil" onClick={editCallback} />
          </div>
        )}
        {editable && editMode && (
          <div className="edit-controls">
            <span className="icon-checkmark-solid" onClick={saveCallback} />
            <span className="icon-times" onClick={cancelCallback} />
          </div>
        )}
        <Dimmer active={dimmed} inverted>
          <Loader active={loading} inverted content="Loading" />
        </Dimmer>
        {children}
      </div>
    )
  } else {
    return null
  }
}

export default Card
