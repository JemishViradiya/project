import { createContext } from 'react'

export default (context, name = 'Context') => {
  const Context = createContext(context)

  const Provider = props => {
    Object.assign(context, props.value)
    return props.children
  }
  Provider[name] = Context
  Provider.Consumer = Context.Consumer
  return Provider
}
