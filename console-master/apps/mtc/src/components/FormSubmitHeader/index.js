import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { toggleFormSubmit } from '../../redux/form/actions'
import Button from '../Button'

require('./FormSubmitHeader.scss')

const FormSubmitHeader = ({ text, cancelCallback, finishText, formLoading, formType, formSubmit, withSpinner, ...props }) => {
  const formSubmitParams = { formId: formType, toggleState: true }
  const formSubmitHandler = () => props.toggleFormSubmit(formSubmitParams)

  return (
    <div className="form-submit-header">
      <div>
        <h1>{text}</h1>
      </div>
      <div>
        <Button outlined disabled={formSubmit} id="cancel" className="cancel" onClick={cancelCallback} {...props}>
          Cancel
        </Button>
        <Button
          disabled={formSubmit || formLoading}
          id="save-finish"
          className={`save ${formSubmit || formLoading ? 'loading' : ''}`}
          onClick={formSubmitHandler}
          withSpinner={!!withSpinner}
          {...props}
        >
          {finishText}
        </Button>
      </div>
    </div>
  )
}

function mapStateToProps(state, ownProps) {
  return {
    formLoading: state.forms[ownProps.formType].loadingState,
    formSubmit: state.forms[ownProps.formType].submitState,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ toggleFormSubmit }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(FormSubmitHeader)
