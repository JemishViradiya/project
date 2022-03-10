import { cloneDeep, flatten } from 'lodash'
import React, { Component } from 'react'
import { Col, Row } from 'react-grid-system'
import { connect } from 'react-redux'
import VirtualizedSelect from 'react-virtualized-select'
import { bindActionCreators } from 'redux'
import { Form } from 'semantic-ui-react'

import history from '../../configureHistory'
import { FORMS } from '../../constants/Forms'
import { SUCCESS } from '../../constants/Success'
import { toggleFormLoading, toggleFormSubmit } from '../../redux/form/actions'
import AuthAPI from '../../services/api/authAPI'
import PartnerAPI from '../../services/api/partnerAPI'
import ErrorService from '../../services/errors'
import SuccessService from '../../services/success'
import Validator from '../../services/validation/validator'
import Storage from '../../Storage'

require('./CreateEditUserForm.scss')

const PERMISSION_PARTNER_MANAGE = 'partner:manage'
const ERROR = 'error'
const ERROR_VISIBLE = 'error-visible'

class CreateEditUserForm extends Component {
  state = {
    infoEntered: false,
    loadingRoles: true,
    loadingPartners: true,
    initialized: false,
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
      role: {
        value: [],
        rules: [{ type: 'isRequired' }],
        error: '',
      },
      partner: {
        value: null,
        rules: [],
        error: '',
      },
    },
    roleOptions: [],
    partnerOptions: [],
  }

  componentDidMount() {
    if (typeof this.props.edit === 'undefined') {
      AuthAPI.getRoles()
        .then(response => {
          this.setState({
            roleOptions: this._processRolesObject(response.data.listData),
            loadingRoles: false,
          })
          this.props.toggleFormLoading({
            formId: FORMS.CREATE_EDIT_USER,
            toggleState: this._checkLocalLoadingState(),
          })
        })
        .catch(() => {
          // this.props.logger.logError('Edit User Form GET Roles Failed', error);
        })
    }
    if (Storage.checkPermission(PERMISSION_PARTNER_MANAGE) !== false) {
      PartnerAPI.getPartnersList()
        .then(response => {
          this.setState({
            partnerOptions: this._processPartnersObject(response.data.listData),
            loadingPartners: false,
          })
          this.props.toggleFormLoading({
            formId: FORMS.CREATE_EDIT_USER,
            toggleState: this._checkLocalLoadingState(),
          })
        })
        .catch(() => {
          // this.props.logger.logError('Partner User Form GET Partners Failed', error);
        })
    } else {
      this.setState({ loadingPartners: false })
      this.props.toggleFormLoading({
        formId: FORMS.CREATE_EDIT_USER,
        toggleState: this._checkLocalLoadingState(),
      })
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.formSubmit) {
      this._submitForm()
    } else if (typeof this.props.data !== 'undefined' && Object.keys(this.props.data).length > 0 && !this.state.initialized) {
      const form = Object.assign({}, this.state.form)
      form.firstName.value = this.props.data.firstName.value
      form.email.value = this.props.data.email.value
      form.lastName.value = this.props.data.lastName.value
      form.partner.value = this.props.data.partner.value
      form.role.value = this.props.data.role.value
      this.setState(
        {
          form: form,
          initialized: true,
        },
        () => {
          if (prevProps.edit && form.partner.value !== '') {
            this._repopulateRoles(form.partner.value, this.props.data.role.value)
          }
        },
      )
    }
  }

  _repopulateRoles = (partnerId, roleId = null) => {
    const form = cloneDeep(this.state.form)
    this.setState(
      {
        loadingRoles: true,
      },
      () => {
        this.props.toggleFormLoading({ formId: FORMS.CREATE_EDIT_USER, toggleState: this._checkLocalLoadingState() })
        AuthAPI.getRoles({
          partnerId: partnerId,
        })
          .then(response => {
            form.role.value = roleId === null ? [] : roleId
            this.setState({
              roleOptions: this._processRolesObject(response.data.listData),
              loadingRoles: false,
              form: form,
            })
            this.props.toggleFormLoading({
              formId: FORMS.CREATE_EDIT_USER,
              toggleState: this._checkLocalLoadingState(),
            })
          })
          .catch(() => {
            // this.props.logger.logError('Partner User Form GET Roles Failed', error);
          })
      },
    )
  }

  _submitForm = () => {
    const form = Object.assign({}, this.state.form)
    const toggleSubmitParams = { formId: FORMS.CREATE_EDIT_USER, toggleState: false }
    let noErrors = true
    if (Validator.validateForm(form) !== true) {
      noErrors = false
    }
    if (noErrors) {
      let apiMethod = AuthAPI.createUser
      let firstName = this.state.form.firstName.value
      let email = this.state.form.email.value
      let lastName = this.state.form.lastName.value
      let roleId = this.state.form.role.value
      let partnerId = null
      if (Storage.checkPermission(PERMISSION_PARTNER_MANAGE) !== false) {
        partnerId = this.state.form.partner.value
      }
      if (this.props.edit) {
        apiMethod = AuthAPI.editUser
        firstName = this.props.data.firstName.value === this.state.form.firstName.value ? null : this.state.form.firstName.value
        lastName = this.props.data.lastName.value === this.state.form.lastName.value ? null : this.state.form.lastName.value
        email = this.props.data.email.value === this.state.form.email.value ? null : this.state.form.email.value
        roleId = this.state.form.role.value
      }
      const requestObject = {
        firstName: firstName,
        email: email,
        lastName: lastName,
        roleIds: flatten([roleId]),
      }
      if (this.props.edit) {
        requestObject.userId = this.props.id
      }
      if (Storage.checkPermission(PERMISSION_PARTNER_MANAGE) !== false) {
        requestObject.partnerId = partnerId
      }
      apiMethod(requestObject, this.props.id)
        .then(() => {
          SuccessService.resolve(SUCCESS.SUBMISSION)
          this.props.toggleFormSubmit(toggleSubmitParams)
          // this.props.logger.logEvent(`Partner User ${action}`, 'Submit', 'Success');
          history.push('/user')
        })
        .catch(error => {
          this.props.toggleFormSubmit(toggleSubmitParams)
          if (error.response && error.response.status === 409) {
            ErrorService.log('The provided email is not unique.')
          } else {
            ErrorService.log('A server error has occurred.')
          }
          // this.props.logger.logError(`Partner User ${action} Form Submit Failed`, error);
          // this.props.logger.logEvent(`Partner User ${action}`, 'Submit', 'Failure');
        })
    } else {
      this.props.toggleFormSubmit(toggleSubmitParams)
    }
  }

  _validateField = fieldName => {
    const form = Object.assign({}, this.state.form)
    form[fieldName].error = Validator.validateRules(form[fieldName].rules, form[fieldName].value)
    this.setState({
      form: form,
    })
  }

  _processRolesObject = roles => {
    return roles.map(role => {
      return {
        value: role.id,
        label: role.name,
      }
    })
  }

  _processPartnersObject = partners => {
    return partners.map(partner => {
      return {
        value: partner.id,
        label: partner.name,
      }
    })
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

  _handleRoleChange = option => {
    let roleId = null
    if (!this.state.infoEntered) {
      this.setState({
        infoEntered: true,
      })
      this.props.changeCallback()
    }
    if (option !== null) {
      roleId = option.value
    }
    const form = cloneDeep(this.state.form)
    form.role.value[0] = roleId
    this.setState({
      form: form,
    })
  }

  _handlePartnerChange = option => {
    let partnerId = null
    if (!this.state.infoEntered) {
      this.setState({
        infoEntered: true,
      })
      this.props.changeCallback()
    }
    const form = cloneDeep(this.state.form)
    if (option !== null) {
      partnerId = option.value
    }
    form.partner.value = partnerId
    this.setState(
      {
        form: form,
      },
      () => {
        this._repopulateRoles(partnerId)
      },
    )
  }

  _checkLocalLoadingState() {
    return this.state.loadingRoles || this.state.loadingPartners
  }

  render() {
    return (
      <div id="create-edit-user-form">
        <Row>
          <Col md={12} className="card">
            <h3>Enter Partner User Info</h3>
            <Row className="user-row">
              <Col md={2}>
                <div className="input-container">
                  <Form.Input
                    placeholder="First Name"
                    name="firstName"
                    onChange={this._handleChange}
                    onBlur={() => this._validateField('firstName')}
                    className={this.state.form.firstName.error !== '' ? ERROR : ''}
                    value={this.state.form.firstName.value}
                    // eslint-disable-next-line jsx-a11y/no-autofocus
                    autoFocus
                    disabled={this.props.formLoading}
                    loading={this.props.formLoading}
                  />
                  <span className={this.state.form.firstName.error !== '' ? ERROR_VISIBLE : ''}>
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
                    className={this.state.form.lastName.error !== '' ? ERROR : ''}
                    value={this.state.form.lastName.value}
                    disabled={this.props.formLoading}
                    loading={this.props.formLoading}
                  />
                  <span className={this.state.form.lastName.error !== '' ? ERROR_VISIBLE : ''}>
                    {this.state.form.lastName.error}
                  </span>
                </div>
              </Col>
              <Col md={2}>
                <div className="input-container">
                  <Form.Input
                    placeholder="Email"
                    name="email"
                    onChange={this._handleChange}
                    onBlur={() => this._validateField('email')}
                    className={this.state.form.email.error !== '' ? ERROR : ''}
                    value={this.state.form.email.value}
                    disabled={this.props.formLoading}
                    loading={this.props.formLoading}
                  />
                  <span className={this.state.form.email.error !== '' ? ERROR_VISIBLE : ''}>{this.state.form.email.error}</span>
                </div>
              </Col>
              {Storage.checkPermission(PERMISSION_PARTNER_MANAGE) !== false && (
                <Col md={3}>
                  <div className="input-container">
                    <VirtualizedSelect
                      options={this.state.partnerOptions}
                      onChange={this._handlePartnerChange}
                      disabled={this.props.formLoading}
                      onBlur={() => this._validateField('partner')}
                      isLoading={this.state.loadingPartners}
                      search
                      optionHeight={60}
                      placeholder="Filter by partner"
                      name="partner"
                      value={this.state.form.partner.value}
                    />
                    <span className={this.state.form.partner.error !== '' ? ERROR_VISIBLE : ''}>
                      {this.state.form.partner.error}
                    </span>
                  </div>
                </Col>
              )}
              <Col md={3}>
                <div className="input-container">
                  <VirtualizedSelect
                    options={this.state.roleOptions}
                    onChange={this._handleRoleChange}
                    disabled={this.props.formLoading}
                    onBlur={() => this._validateField('role')}
                    isLoading={this.state.loadingRoles}
                    search
                    optionHeight={60}
                    placeholder="Select A Role"
                    name="role"
                    value={this.state.form.role.value[0]}
                  />
                  <span className={this.state.form.role.error !== '' ? ERROR_VISIBLE : ''}>{this.state.form.role.error}</span>
                </div>
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
    formSubmit: state.forms[FORMS.CREATE_EDIT_USER].submitState,
    formLoading: state.forms[FORMS.CREATE_EDIT_USER].loadingState,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      toggleFormLoading,
      toggleFormSubmit,
    },
    dispatch,
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateEditUserForm)
