export interface ExternalPromise<T> extends Promise<T> {
  loading: boolean
  data?: T
  error?: Error
  resolve: (d: T) => void
  reject: (e: Error) => void
}

export const externalPromise = <T>(): ExternalPromise<T> => {
  const stub = {}
  const promise = new Promise((resolve, reject) => Object.assign(stub, { resolve, reject }))
  Object.assign(promise, stub)
  return promise as ExternalPromise<T>
}
