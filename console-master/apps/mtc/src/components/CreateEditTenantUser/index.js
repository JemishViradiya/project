import { cloneDeep } from 'lodash'
import React, { Component } from 'react'
import { Col, Row } from 'react-grid-system'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Dimmer, Form, Loader } from 'semantic-ui-react'

import history from '../../configureHistory'
import { FORMS } from '../../constants/Forms'
import { toggleFormLoading, toggleFormSubmit } from '../../redux/form/actions'
import { TenantUserAPI } from '../../services/api/tenantUserAPI'
import ErrorService from '../../services/errors'
import SuccessService from '../../services/success'
import Validator from '../../services/validation/validator'

require('./CreateEditTenantUser.scss')

class CreateEditTenantUser extends Component {
  state = {
    infoEntered: false,
    form: {
      firstName: {
        value: '',
        rules: [{ type: 'isRequired' }],
        error: '',
      },
      lastName: {
        value: '',
        rules: [{ type: 'isRequired' }],
        error: '',
      },
      email: {
        value: '',
        rules: [{ type: 'isRequired' }, { type: 'isEmail' }],
        error: '',
      },
      userRole: {
        value: null,
        rules: [{ type: 'isRequired' }],
        error: '',
      },
      zone: {
        value: null,
        rules: [{ type: 'isRequired' }],
        error: '',
      },
    },
  }

  componentDidMount() {
    if (this.props.edit) {
      this.props.toggleFormLoading({ formId: FORMS.CREATE_EDIT_TENANT_USER, toggleState: true })
      TenantUserAPI.getTenantUserById(this.props.id, this.props.tenantId)
        .then(response => {
          const form = cloneDeep(this.state.form)
          form.email.value = response.data.email
          form.firstName.value = response.data.firstName
          form.lastName.value = response.data.lastName
          form.zone.value = response.data.defaultZoneRole
          this.setState({
            form: form,
          })
          this.props.toggleFormLoading({ formId: FORMS.CREATE_EDIT_TENANT_USER, toggleState: false })
          this.forceUpdate()
        })
        .catch(() => {
          // this.props.logger.logError('Tenant User Edit GET Tenant User By ID Failed', error);
        })
    }
  }

  componentDidUpdate() {
    if (this.props.formSubmit) {
      this._submitForm()
    }
  }

  _validateForm = () => {
    const form = cloneDeep(this.state.form)
    const validatedForm = Validator.validateForm(form)
    if (validatedForm) {
      return validatedForm
    } else {
      return true
    }
  }

  _validateField = fieldName => {
    const form = cloneDeep(this.state.form)
    form[fieldName].error = Validator.validateRules(form[fieldName].rules, form[fieldName].value)
    this.setState({
      form: form,
    })
  }

  _submitForm = () => {
    const toggleSubmitParams = { formId: FORMS.CREATE_EDIT_TENANT_USER, toggleState: false }
    const validationResult = this._validateForm(this.state.form)
    let apiMethod = TenantUserAPI.createTenantUser

    if (this.props.edit) {
      apiMethod = TenantUserAPI.editTenantUser
    }
    if (validationResult === true) {
      const formState = cloneDeep(this.state.form)
      const formData = {}
      for (const field in formState) {
        formData[field] = formState[field].value
      }

      // const action = this.props.edit ? 'Edit' : 'Create';
      apiMethod(formData, this.props.tenantId, typeof this.props.tenantId !== 'undefined' ? this.props.id : null)
        .then(() => {
          SuccessService.resolve('Form submission successful')
          this.props.toggleFormSubmit(toggleSubmitParams)
          history.push(`/tenant/details/${this.props.tenantId}/users`)
        })
        .catch(error => {
          if (error.response && error.response.status === 409) {
            ErrorService.log('Tenant user email is already in use.')
          } else {
            ErrorService.log('A server error occurred')
          }
          this.props.toggleFormSubmit(toggleSubmitParams)
        })
    } else {
      this.setState({
        form: validationResult,
      })
      this.props.toggleFormSubmit(toggleSubmitParams)
    }
  }

  _handleChange = (event, data) => {
    if (!this.state.infoEntered) {
      this.setState({
        infoEntered: true,
      })
      this.props.changeCallback()
    }
    const form = cloneDeep(this.state.form)
    form[data.name].value = data.value
    this.setState({
      form: form,
    })
  }

  render() {
    const ERROR_VISIBLE = 'error-visible'

    return (
      <div id="create-edit-tenantuser-form">
        <Row>
          <Col md={12}>
            <Dimmer active={this.props.edit && this.props.formLoading} inverted>
              <Loader inverted content="Loading" />
            </Dimmer>
            <Row>
              <Col md={12} className="card">
                <h3>Tenant User Info</h3>
                <Row className="tenant-user-row">
                  <Col md={2}>
                    <div className="input-container">
                      <Form.Input
                        placeholder="First Name"
                        name="firstName"
                        onChange={this._handleChange}
                        onBlur={() => this._validateField('firstName')}
                        className={this.state.form.firstName.error !== '' ? 'error' : ''}
                        value={this.state.form.firstName.value}
                        id="create-edit-tenantuser-form-first-name-input"
                        // eslint-disable-next-line jsx-a11y/no-autofocus
                        autoFocus
                      />
                      <span
                        id="create-edit-tenantuser-form-first-name-input-error-field"
                        className={this.state.form.firstName.error !== '' ? 'error-visible' : ''}
                      >
                        {this.state.form.firstName.error}
                      </span>
                    </div>
                  </Col>
                  <Col md={2}>
                    <div className="input-container">
                      <Form.Input
                        placeholder="Last Name"
                        name="lastName"
                        onChange={this._handleChange}
                        onBlur={() => this._validateField('lastName')}
                        className={this.state.form.lastName.error !== '' ? 'error' : ''}
                        value={this.state.form.lastName.value}
                        id="create-edit-tenantuser-form-last-name-input"
                      />
                      <span
                        id="create-edit-tenantuser-form-last-name-input-error-field"
                        className={this.state.form.lastName.error !== '' ? ERROR_VISIBLE : ''}
                      >
                        {this.state.form.lastName.error}
                      </span>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="input-container">
                      <Form.Input
                        placeholder="Email"
                        name="email"
                        onChange={this._handleChange}
                        onBlur={() => this._validateField('email')}
                        className={this.state.form.email.error !== '' ? 'error' : ''}
                        value={this.state.form.email.value}
                        id="create-edit-tenantuser-form-email-input"
                      />
                      <span
                        id="create-edit-tenantuser-form-email-input-error-field"
                        className={this.state.form.email.error !== '' ? ERROR_VISIBLE : ''}
                      >
                        {this.state.form.email.error}
                      </span>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    formSubmit: state.forms[FORMS.CREATE_EDIT_TENANT_USER].submitState,
    formLoading: state.forms[FORMS.CREATE_EDIT_TENANT_USER].loadingState,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      toggleFormSubmit,
      toggleFormLoading,
    },
    dispatch,
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateEditTenantUser)
