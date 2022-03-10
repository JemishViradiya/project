import React from 'react'

import Button from '../Button'

require('./FormHeader.scss')

const PrimaryButton = props => <Button {...props} />
const SecondaryButton = props => <Button className="cancel" outlined {...props} />
// Linter can't figure out that children props will be injected
const Title = props => <h1 {...props} /> // eslint-disable-line

const FormHeader = props => {
  const { children } = props
  return <div className="form-header">{children(Title, PrimaryButton, SecondaryButton)}</div>
}

export default FormHeader
