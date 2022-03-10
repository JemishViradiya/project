import { REQUEST_FINISH, REQUEST_START } from './actions'

function startRequest(state, action) {
  const requestName = action.payload
  let { inProcess } = state
  if (typeof inProcess === 'undefined') {
    inProcess = {}
  }
  inProcess[requestName] = true
  return {
    ...state,
    inProcess: inProcess,
  }
}

function stopRequest(state, action) {
  const requestName = action.payload
  let { inProcess } = state
  if (typeof inProcess === 'undefined') {
    inProcess = {}
  }
  inProcess[requestName] = false
  return {
    ...state,
    inProcess: inProcess,
  }
}

export default function (state = {}, action) {
  switch (action.type) {
    case REQUEST_START:
      return startRequest(state, action)
    case REQUEST_FINISH:
      return stopRequest(state, action)
    default:
      return {
        ...state,
      }
  }
}
