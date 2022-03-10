import type { AbstractSession } from './base'

type SmgrSessionState = Partial<SmgrSession> & {
  loggedIn: boolean
  loading: boolean
}

export interface SmgrSession extends AbstractSession {
  clientId: string
  scopes: string[]
  accessTokenVenue: string
  idToken: string
  trySso?: boolean
  tokenExpired?: boolean
}

export interface SessionState {
  getSession(): SmgrSessionState
  next(data?: SmgrSession): SessionState
  onError(error: Error & { status?: number })
  isSessionExpired(): boolean
  clone(state: SmgrSessionState): SessionState
}

const sessionExpired = (state: SmgrSessionState) => {
  return state.tokenExpired || (state.tokenExpirationTime && state.tokenExpirationTime < Date.now())
}

abstract class BaseState {
  session: SmgrSessionState

  constructor(session: SmgrSessionState) {
    this.session = session
  }

  getSession() {
    return this.session
  }

  onError(error: Error & { status?: number }) {
    return new SessionErrorState(error)
  }

  isSessionExpired(): boolean {
    return this.session && sessionExpired(this.session)
  }

  next(data?: SmgrSession): SessionState {
    if (data) {
      return new ActiveSessionState(data)
    } else {
      return new LoadingSessionState()
    }
  }

  clone(state: SmgrSessionState): SessionState {
    if (state.loading) return new LoadingSessionState()
    else if (state.loggedIn) return new ActiveSessionState(state as SmgrSession)
    else if (state.error) return new SessionErrorState(state.error)
    else if (sessionExpired(state)) return new TokenExpiredSessionState(state)
    else return new NoSessionState()
  }
}

export class NoSessionState extends BaseState implements SessionState {
  constructor() {
    super({ loggedIn: false, loading: false })
  }
}

export class SessionErrorState extends BaseState implements SessionState {
  constructor(error: Error & { status?: number }) {
    super({ loggedIn: false, loading: false, error })
  }
}

export class LoadingSessionState extends BaseState implements SessionState {
  constructor() {
    super({ loggedIn: false, loading: true })
  }
}

export class ActiveSessionState extends BaseState implements SessionState {
  constructor(sessionPayload: SmgrSession) {
    super({ ...sessionPayload, loggedIn: true, loading: false })
  }

  next(data?: SmgrSession): SessionState {
    if (data) {
      return new ActiveSessionState(data)
    } else if (this.isSessionExpired()) {
      return new TokenExpiredSessionState(this.session)
    } else {
      return new NoSessionState()
    }
  }
}

export class TokenExpiredSessionState extends BaseState implements SessionState {
  constructor(sessionPayload: SmgrSessionState) {
    super({ idToken: sessionPayload.idToken, actor: sessionPayload.actor, loggedIn: false, loading: false, tokenExpired: true })
  }

  next(data?: SmgrSession): SessionState {
    if (this.session.actor) {
      return new NoSessionState()
    } else {
      return new TrySsoSessionState(this.session)
    }
  }
}

export class TrySsoSessionState extends BaseState implements SessionState {
  constructor(sessionPayload: SmgrSessionState) {
    super({ idToken: sessionPayload.idToken, loggedIn: false, loading: false, trySso: !sessionPayload.actor })
  }
}
