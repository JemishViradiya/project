import { EventBus } from '../lib/events'

export const FETCH_FAILED = 'Token acquisition failed'
export const TOKEN_PARSE_FAILED = 'Invalid token acquired'
export const VENUE_EECOID_MISSING = 'Venue user is not provisioned for ECS'
export const VENUE_SESSION_EXPIRED = 'Venue session expired'
export const TRIGGER_SESSION_CONTEXT_UPDATE = 'session-context-update'
export const SESSION_UPDATE = Object.freeze({
  Update: 'update',
  CleanUp: 'cleanup',
})

const base64UrlMap = Object.freeze({
  '-': '+',
  _: '/',
})

export const jwtDecode = <T>(jwt: string): T => {
  let base64Payload = jwt.split('.')[1].replace(/[-_]/g, ch => base64UrlMap[ch])
  for (let i = base64Payload.length; i % 4 !== 0; i++) {
    base64Payload += '='
  }
  return JSON.parse(atob(base64Payload))
}

export class SessionError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export class Error401 extends SessionError {
  constructor(message: string) {
    super(message, 401)
  }
}

export class Error403 extends SessionError {
  constructor(message: string) {
    super(message, 403)
  }
}

export const syncExecution = (execution: (...args) => Promise<any>) => {
  let fetching = undefined

  return async (...args) => {
    if (!fetching) {
      fetching = execution(...args)
    }
    try {
      return await fetching
    } finally {
      fetching = undefined
    }
  }
}

const createBroadcastChannel = name => {
  try {
    return new BroadcastChannel(name)
  } catch (error) {
    console.warn('No BroadcastChannel Support !!', error.message)
    return null
  }
}
export const appBroadcastChannel = createBroadcastChannel

export const triggerSessionContextUpdate = (accessToken: string) => {
  const event = new CustomEvent(TRIGGER_SESSION_CONTEXT_UPDATE, { detail: { accessToken } })
  EventBus.dispatchEvent(event)
}
