import { FEATURE_SET, FEATURE_WIPE } from './actions'

function setFeatures(state, action) {
  return {
    ...state,
    ...action.payload,
  }
}

function removeFeatures(state) {
  return {
    ...state,
    features: null,
  }
}

export default function (state = {}, action) {
  switch (action.type) {
    case FEATURE_SET:
      return setFeatures(state, action)
    case FEATURE_WIPE:
      return removeFeatures(state)
    default:
      return state
  }
}
