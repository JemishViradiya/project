import { SET_BULK, SET_CHECKED, SET_SELECT_ALL, UNSET_BULK, UNSET_CHECKED, UNSET_SELECT_ALL } from './actions'

const initialState = {
  bulkSelectAll: false,
  checked: [],
  selectAll: 0,
}

const setChecked = (state, action) => {
  return {
    ...state,
    checked: action.payload,
  }
}

const unsetChecked = state => {
  return {
    ...state,
    checked: [],
  }
}

const setBulk = state => {
  return {
    ...state,
    bulkSelectAll: true,
  }
}

const unsetBulk = state => {
  return {
    ...state,
    bulkSelectAll: false,
  }
}

const setSelectAll = (state, action) => {
  return {
    ...state,
    selectAll: action.payload,
  }
}

const unsetSelectAll = state => {
  return {
    ...state,
    selectAll: 0,
  }
}

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_CHECKED:
      return setChecked(state, action)
    case UNSET_CHECKED:
      return unsetChecked(state)
    case SET_BULK:
      return setBulk(state)
    case UNSET_BULK:
      return unsetBulk(state)
    case SET_SELECT_ALL:
      return setSelectAll(state, action)
    case UNSET_SELECT_ALL:
      return unsetSelectAll(state)
    default:
      return {
        ...state,
      }
  }
}
