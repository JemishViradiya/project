import { report } from '../../Reporter'

const ErrorTypeServer = 'ErrorTypeServer'

export const throwServerError = msg => {
  const err = new Error(msg)
  err.name = ErrorTypeServer
  throw err
}

export const reportClientError = (error, info) => {
  if (error.name !== ErrorTypeServer) {
    report({ message: `Client error thrown: ${error.message}`, error: { stack: error.stack }, info })
  }
}
