import { useEffect, useRef } from 'react'

export const useErrorCallback = <TError extends Error = Error>(error, callback) => {
  const errorRef = useRef<TError>()

  useEffect(() => {
    if (error && error !== errorRef.current) {
      errorRef.current = error
      console.error(error)
      callback(error)
    }
  }, [callback, error])
}
