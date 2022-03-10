import { cloneDeep } from 'lodash'
import React, { Component } from 'react'

import ProfilePassword from '../../../../components/ProfilePassword'
import { SUCCESS } from '../../../../constants/Success'
import { AuthAPI } from '../../../../services/api'
import ErrorService from '../../../../services/errors'
import SuccessService from '../../../../services/success'
import Validator from '../../../../services/validation/validator'
import Storage from '../../../../Storage'

class ProfilePasswordContainer extends Component {
  state = {
    originalEntered: false,
    userId: '',
    form: {
      currentPassword: {
        value: '',
        rules: [{ type: 'isRequired' }],
      },
      newPassword: {
        value: '',
      },
    },
    passwordValidation: null,
    requestInProcess: false,
  }

  componentDidMount() {
    this.setState({
      userId: Storage.getUserId(),
    })
  }

  _handleChange = (event, data) => {
    const form = cloneDeep(this.state.form)
    form[data.name].value = data.value
    const reqRule = form[data.name].rules.find(element => element.type === 'isRequired')
    if (reqRule) {
      this.setState({
        originalEntered: Validator.validateRule(reqRule, data.value) === '',
      })
    }
    this.setState({
      form: form,
    })
  }

  _handleNewPasswordChange = (event, data) => {
    const password = data.value
    const validationObject = {}
    const form = cloneDeep(this.state.form)
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

  getRulesValid = () => {
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
    const passwordRulesValid = this.getRulesValid()
    this.setState({ requestInProcess: true })
    if (passwordRulesValid.length >= 3 && this.state.originalEntered && this.state.passwordValidation.hasLength) {
      const formState = cloneDeep(this.state.form)
      const { userId } = this.state
      AuthAPI.changePassword(userId, {
        currentPassword: formState.currentPassword.value,
        newPassword: formState.newPassword.value,
      })
        .then(() => {
          // this.props.logger.logEvent('Change Password', 'Submit', 'Success');
          SuccessService.resolve(SUCCESS.PASSWORD_CHANGE)
          this.setState({ requestInProcess: false })
        })
        .catch(error => {
          const { message } = error.response.data
          // this.props.logger.logError('Change Password Failed', error);
          // this.props.logger.logEvent('Change Password', 'Submit', 'Failure');
          ErrorService.log(message)
          this.setState({ requestInProcess: false })
        })
    }
  }

  render() {
    let isValid = true
    if (!this.state.originalEntered) {
      isValid = false
    }
    if (this.state.passwordValidation === null) {
      isValid = false
    }
    if (this.state.passwordValidation !== null) {
      const passwordRulesValid = this.getRulesValid()
      if (passwordRulesValid.length < 3 || !this.state.passwordValidation.hasLength) {
        isValid = false
      }
    }
    return (
      <ProfilePassword
        form={this.state.form}
        passwordChangedCallback={this._handleChange}
        newPasswordChangedCallback={this._handleNewPasswordChange}
        passwordSubmittedCallback={this._handleSubmit}
        isValid={isValid}
        passwordValidation={this.state.passwordValidation}
        loading={this.state.requestInProcess}
      />
    )
  }
}

export default ProfilePasswordContainer
