export const INITIALIZE_FORM = '@Cylance/form/INITIALIZE_FORM'
export const TOGGLE_FORM_SUBMIT = '@Cylance/form/TOGGLE_FORM_SUBMIT'
export const TOGGLE_FORM_LOADING = '@Cylance/form/TOGGLE_FORM_LOADING'
export const TOGGLE_FORM_MODAL = '@Cylance/form/TOGGLE_FORM_MODAL'

export const initializeForm = form => ({
  type: INITIALIZE_FORM,
  payload: form,
})

export const toggleFormSubmit = submitState => ({
  type: TOGGLE_FORM_SUBMIT,
  payload: submitState,
})

export const toggleFormLoading = disabledState => ({
  type: TOGGLE_FORM_LOADING,
  payload: disabledState,
})

export const toggleModal = showModalState => ({
  type: TOGGLE_FORM_MODAL,
  payload: showModalState,
})
