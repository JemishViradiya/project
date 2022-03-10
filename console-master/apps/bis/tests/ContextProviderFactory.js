export default context => {
  const ContextProvider = ({ children }) => children
  ContextProvider.Consumer = props => props.children(context)
  return ContextProvider
}
