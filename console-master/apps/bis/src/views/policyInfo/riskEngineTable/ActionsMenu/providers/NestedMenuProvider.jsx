import PropTypes from 'prop-types'
import React, { createContext } from 'react'

export const Context = createContext([])
const { Provider, Consumer } = Context

const TooltipToggleContext = ({ children, setFunction }) => {
  return <Provider value={setFunction}>{children}</Provider>
}

TooltipToggleContext.propTypes = {
  children: PropTypes.node.isRequired,
  setFunction: PropTypes.func.isRequired,
}

TooltipToggleContext.Consumer = Consumer

export default TooltipToggleContext
