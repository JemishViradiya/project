import { INITIALIZE_FORM, TOGGLE_FORM_LOADING, TOGGLE_FORM_MODAL, TOGGLE_FORM_SUBMIT } from './actions'

function initializeFormState(state, action) {
  const formId = action.payload
  const initializedState = { submitState: false, loadingState: false }
  return {
    ...state,
    [formId]: initializedState,
  }
}

function toggleFormSubmit(state, action) {
  const { formId, toggleState } = action.payload
  const form = state[formId]
  return {
    ...state,
    [formId]: {
      ...form,
      submitState: toggleState,
    },
  }
}

function toggleFormLoading(state, action) {
  const { formId, toggleState } = action.payload
  const form = state[formId]
  return {
    ...state,
    [formId]: {
      ...form,
      loadingState: toggleState,
    },
  }
}

export default function (state = {}, action) {
  switch (action.type) {
    case INITIALIZE_FORM:
      return initializeFormState(state, action)
    case TOGGLE_FORM_SUBMIT:
      return toggleFormSubmit(state, action)
    case TOGGLE_FORM_LOADING:
      return toggleFormLoading(state, action)
    case TOGGLE_FORM_MODAL:
      return { ...state, toggleFormModal: action.payload }
    default:
      return state
  }
}
