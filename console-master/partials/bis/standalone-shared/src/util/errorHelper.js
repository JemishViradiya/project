const ErrorTypeServer = 'ErrorTypeServer'

export const throwServerError = msg => {
  const err = new Error(msg)
  err.name = ErrorTypeServer
  throw err
}
