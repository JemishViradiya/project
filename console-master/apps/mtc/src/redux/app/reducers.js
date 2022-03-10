import { ENVIRONMENT_SET, MOCK_MODE_SET } from './actions'

function setEnvironment(state, action) {
  let env = ''
  switch (action.payload) {
    case 'admin.cylance.com':
      env = 'production'
      break
    case 'pioneer.cylance.com':
      env = 'production'
      break
    case 'dev-admin.cylance.com':
      env = 'staging'
      break
    case 'dev-pioneer.cylance.com':
      env = 'staging'
      break
    default:
      env = 'development'
  }
  return {
    ...state,
    environment: env,
  }
}

function setMockMode(state, action) {
  return {
    ...state,
    mockMode: action.payload,
  }
}

export default function (state = {}, action) {
  switch (action.type) {
    case ENVIRONMENT_SET:
      return setEnvironment(state, action)
    case MOCK_MODE_SET:
      return setMockMode(state, action)
    default:
      return state
  }
}
