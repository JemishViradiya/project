import Cookies from 'js-cookie'
import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { bindActionCreators } from 'redux'

import history from '../../../../../configureHistory'
import { externalAuthLogin, requestIdpRedirect } from '../../../../../redux/auth/actions'
import Storage from '../../../../../Storage'
import { createErrorNotification } from '../../../NotificationContainer/redux/actions'
import ExternalLoginForm from './components/ExternalLoginForm'

class ExternalLogin extends Component {
  state = {
    loading: false,
    actions: null,
  }

  componentDidMount() {
    if (Storage.checkBearerTokenNotExpired()) {
      history.push('/')
    }
    // check for is isValid=true query param
    const params = new URLSearchParams(this.props.location.search)
    const isExternalLoginValid = params.get('isValid')
    const errorMessage = params.get('errorMessage')
    if (isExternalLoginValid === 'true') {
      this._handleExternalAuthSettingsCookie()
    } else if (errorMessage === 'unauthorized') {
      this._showExternalLoginErrorMessage()
    }
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.requestInProcess) {
      this.setState({ loading: true })
    }
    if (!nextProps.requestInProcess && this.props.requestInProcess) {
      this.setState({ loading: false })
      this.state.actions.setSubmitting(false)
    }
  }

  _handleSubmit = (values, actions) => {
    Storage.setRegion(values.region)
    this.props.requestIdpRedirect(values)
    this.setState({
      actions: actions,
    })
  }

  _handleExternalAuthSettingsCookie() {
    const token = Cookies.get('auth')
    const email = Cookies.get('email')
    const region = Cookies.get('regionCode')
    localStorage.setItem('region', region)
    if (token && email) {
      // send action to login external user
      this.props.externalAuthLogin({ email, token })
      Cookies.remove('auth')
      Cookies.remove('email')
    } else {
      this._showExternalLoginErrorMessage()
    }
  }

  _showExternalLoginErrorMessage() {
    this.props.createErrorNotification('There was an issue logging you in.', new Error())
  }

  render() {
    return [
      <Helmet key="metadata">
        <title>External Login</title>
      </Helmet>,
      <div className="login" key="login">
        <ExternalLoginForm onSubmit={this._handleSubmit} loading={this.state.loading} region={Storage.getRegion()} />
      </div>,
    ]
  }
}

const mapStateToProps = state => ({
  requestInProcess: state.requests.inProcess['idp-redirect'],
  environment: state['app-metadata'].environment,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      requestIdpRedirect: requestIdpRedirect,
      externalAuthLogin: externalAuthLogin,
      createErrorNotification: createErrorNotification,
    },
    dispatch,
  )

export default compose(connect(mapStateToProps, mapDispatchToProps))(ExternalLogin)
