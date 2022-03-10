import { cloneDeep } from 'lodash'
import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { Dimmer, Form, Loader } from 'semantic-ui-react'

import PasswordStrengthIndicator from '../../../../../components/elements/PasswordStrengthIndicator'
import history from '../../../../../configureHistory'
import { SUCCESS } from '../../../../../constants/Success'
import AuthAPI from '../../../../../services/api/authAPI'
import SuccessService from '../../../../../services/success'
import Storage from '../../../../../Storage'

class SetForgotPassword extends Component {
  state = {
    requestInProcess: false,
    form: {
      token: {
        value: '',
      },
      password: {
        value: '',
      },
    },
    passwordValidation: {},
  }

  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search)
    const token = params.get('token')
    const regionCode = params.get('regionCode')
    const form = cloneDeep(this.state.form)
    form.token.value = token
    this.setState({ form })
    Storage.deleteToken(false)
    Storage.setRegion(regionCode)
  }

  _checkPasswordValue = () => {
    return Object.keys(this.state.passwordValidation).filter(value => {
      if (value !== 'hasLength') {
        return this.state.passwordValidation[value]
      } else {
        return false
      }
    })
  }

  _handleSubmit = event => {
    event.preventDefault()
    const passwordRulesValid = this._checkPasswordValue()

    if (passwordRulesValid.length >= 3 && this.state.passwordValidation.hasLength) {
      const formState = cloneDeep(this.state.form)
      this.setState(
        {
          requestInProcess: true,
        },
        () => {
          AuthAPI.setPassword(formState.token.value, formState.password.value)
            .then(response => {
              // this.props.logger.logEvent('Set Forgot Password', 'Submit', 'Success');
              SuccessService.resolve(SUCCESS.PASSWORD_CHANGE)
              if (response) {
                history.push('/auth/login')
              } else {
                history.push('/auth/forgot-password')
              }
            })
            .catch(() => {
              this.setState({
                requestInProcess: false,
              })
              // logger.logEvent('Set Forgot Password', 'Submit', 'Failure');
              // this.props.logger.logError('Set forgot password failed', error);
            })
        },
      )
    }
  }

  _handleChange = (event, data) => {
    const password = data.value
    const form = cloneDeep(this.state.form)
    const validationObject = {}

    form[data.name].value = data.value
    validationObject.containsLowerCase = password.toUpperCase() !== password
    validationObject.containsUpperCase = password.toLowerCase() !== password
    validationObject.containsSpecialCharacter = /\W+/.test(password)
    validationObject.containsNumber = /\d/.test(password)
    validationObject.hasLength = password.length >= 8
    this.setState({
      passwordValidation: validationObject,
      form: form,
    })
  }

  render() {
    const passwordRulesValid = this._checkPasswordValue()

    return (
      <>
        <Helmet key="metadata">
          <title>Set Your Password</title>
        </Helmet>
        <div className="login" key="set-forgot-password">
          <form id="set-password" className="external-page-content-container">
            <Dimmer active={this.state.requestInProcess} inverted>
              <Loader inverted content="Setting..." />
            </Dimmer>
            <h1>Set New Password</h1>
            <p>Please set your new password</p>
            <div className="input-container label">
              <Form.Input
                placeholder="********"
                name="password"
                onChange={this._handleChange}
                label="New Password"
                type="password"
                autoComplete="off"
                id="set-password-form-password-input"
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
              />
            </div>
            <PasswordStrengthIndicator validation={this.state.passwordValidation} />
            <div>
              <input
                type="submit"
                id="set-password-form-submit"
                value="Reset"
                onClick={this._handleSubmit}
                disabled={passwordRulesValid.length < 3 || !this.state.passwordValidation.hasLength}
              />
            </div>
          </form>
        </div>
      </>
    )
  }
}

export default SetForgotPassword
