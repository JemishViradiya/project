import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'

import { UesReduxStore } from '../../src/providers/redux'

export const uesDecorator = Story => (
  <ReduxProvider store={UesReduxStore}>
    <Story />
  </ReduxProvider>
)

export const UesDecorator = ({ children, ...props }) => (
  <ReduxProvider store={UesReduxStore}>{React.cloneElement(children, props)}</ReduxProvider>
)
