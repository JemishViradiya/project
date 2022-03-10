import { clearExpiry, getTenantId, refreshState } from './token'

/** Token States
 * authenticated
 * unauthenticated
 * expiring
 * expired
 */
/** Headless states
 * sso
 * refresh
 * failed
 * none
 */

const backgroundAuthenticate = 'auth/BackgroundAuthenticate'
const backgroundAuthenticateSuccess = 'auth/BackgroundAuthenticateSuccess'
const backgroundAuthenticateFailure = 'auth/BackgroundAuthenticateFailure'
const backgroundCheck = 'auth/BackgroundCheck'
const expireAuthentication = 'auth/ExpireAuthentication'
const failAuthentication = 'auth/FailAuthentication'

const actionTypes = [
  backgroundAuthenticate,
  backgroundAuthenticateSuccess,
  backgroundAuthenticateFailure,
  backgroundCheck,
  expireAuthentication,
  failAuthentication,
]

const actionCreator = type => (args = {}) => ({
  ...args,
  type,
  tenant: getTenantId(),
})

export const BackgroundAuthenticate = actionCreator(backgroundAuthenticate)
export const BackgroundAuthenticateSuccess = actionCreator(backgroundAuthenticateSuccess)
export const BackgroundAuthenticateFailure = actionCreator(backgroundAuthenticateFailure)
export const BackgroundCheck = actionCreator(backgroundCheck)
export const ExpireAuthentication = actionCreator(expireAuthentication)
export const FailAuthentication = actionCreator(failAuthentication)

export const getAccessToken = ({ auth: { accessToken } }) => accessToken || undefined
export const getTenant = ({ auth: { tenant } }) => tenant || undefined

const initialState = () => {
  const state = refreshState(getTenantId())

  const { token } = state
  if (token === 'authenticated' || !state.tenant) {
    state.headless = 'none'
  } else if (token === 'expiring' || state === 'expired') {
    state.headless = 'refresh'
  } else {
    state.headless = 'sso'
  }
  state.isInitial = token === 'unauthenticated' || token === 'expired'
  return state
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export default (state = initialState(), action) => {
  const { type } = action
  if (actionTypes.indexOf(type) === -1) {
    return state
  }
  let headless = state.headless
  const { tenant: previousTenant } = state
  const tenant = action.tenant
  if (tenant !== previousTenant) {
    // ignore window messages for other tenants
    if (type === backgroundAuthenticateSuccess || type === backgroundAuthenticateFailure || type === failAuthentication) {
      return state
    }
    if (!tenant) {
      console.warn('auth.state: no tenant found', action)
      // TODO: go to tenant url?
      state = {}
      headless = false
    } else if (!previousTenant) {
      state = initialState()
      headless = state.headless
    } else {
      throw new Error(`Unhandled State: tenant switch ${previousTenant} -> ${tenant}`)
    }
  }

  if (type === expireAuthentication) {
    clearExpiry(tenant)
  }

  const nextState = refreshState(tenant)

  if (type === backgroundAuthenticate) {
    if (headless === 'none' && (nextState.token !== 'authenticated' || nextState.expiry === state.expiry)) {
      return {
        ...nextState,
        headless: nextState.isAuthenticated ? 'refresh' : 'sso',
        tenant,
        isInitial: state.isInitial,
      }
    }
  } else if (type === backgroundAuthenticateSuccess) {
    return {
      ...nextState,
      headless: 'none',
      tenant: state.tenant,
    }
  } else if (type === backgroundAuthenticateFailure) {
    const { error } = action
    if (error) {
      console.error(error)
    }
    return {
      ...nextState,
      headless: `${state.headless}-failed`,
      tenant: state.tenant,
      isInitial: state.isInitial && state.accessToken === nextState.accessToken,
      error,
    }
  } else if (type === backgroundCheck || type === expireAuthentication) {
    return {
      ...nextState,
      headless: state.headless,
      tenant: type === backgroundCheck ? tenant : state.tenant,
      isInitial: type === backgroundCheck ? state.isInitial : undefined,
    }
  } else if (type === failAuthentication) {
    return {
      ...nextState,
      token: 'unauthenticated',
      tenant: state.tenant,
      isInitial: undefined,
      error: action.metadata,
    }
  }
  return state
}
