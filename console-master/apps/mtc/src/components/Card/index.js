import React from 'react'

import Paper from '@material-ui/core/Paper'

require('./Card.scss')

const Card = props => (
  <Paper {...props} elevation={0}>
    {props.children}
  </Paper>
)

const CardForm = props => (
  <Card>
    {!props.edit && (
      <div className="card-form-controls">
        <span id="icon-pencil" className="icon-pencil" onClick={props.onEdit} />
      </div>
    )}
    {props.edit && (
      <div className="card-form-controls outlined">
        <span id="icon-checkmark" className="icon-checkmark-solid" onClick={props.onSave} />
        <span id="icon-times" className="icon-times" onClick={props.onCancel} />
      </div>
    )}
    {props.children}
  </Card>
)

export { CardForm }

export default Card
