import React from 'react'
import { Route } from 'react-router-dom'

export default function ConditionalRoute({ isTrue, trueElement: TComponent, falseElement: FComponent, ...rest }) {
  return <Route {...rest} render={props => (isTrue ? <TComponent {...props} {...rest} /> : <FComponent {...props} {...rest} />)} />
}
