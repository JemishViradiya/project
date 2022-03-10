export interface SessionManagerResponse {
  statusCode: number
  statusMessage: string
  loginStatus: 'failure' | 'success'
  logoutStatus?: any
  message: string
  returnUrl?: string
}

export class ServiceWorkerNotifyError extends Error {
  errorState: any

  constructor(message: string, errorState: any) {
    super(message)
    this.errorState = errorState
  }
}

export enum Mode {
  Popup = 'popup',
  Iframe = 'iframe',
  Window = 'window',
}

export enum Phase {
  Login = 'login',
  Logout = 'logout',
}
