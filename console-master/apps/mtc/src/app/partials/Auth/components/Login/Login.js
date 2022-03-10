import './Login.scss'

import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import history from '../../../../../configureHistory'
import { setMockModeOff, setMockModeOn } from '../../../../../redux/app/actions'
import { loginUser } from '../../../../../redux/auth/actions'
import Storage from '../../../../../Storage'
import LoginForm from './components/LoginForm'

class Login extends Component {
  state = {
    loading: false,
    actions: null,
  }

  componentDidMount() {
    if (Storage.checkBearerTokenNotExpired()) {
      history.push('/')
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
    if (values.region !== 'mock') {
      Storage.setRegion(values.region)
      if (this.props.mockMode) {
        this.props.setMockModeOff()
      }
    } else {
      this.props.setMockModeOn()
    }
    this.props.loginUser(values.email, values.password)
    this.setState({
      actions: actions,
    })
  }

  render() {
    return [
      <Helmet key="metadata">
        <title>Login</title>
      </Helmet>,
      <div className="login" key="login">
        <LoginForm
          onSubmit={this._handleSubmit}
          loading={this.state.loading}
          region={Storage.getRegion()}
          environment={this.props.environment}
        />
      </div>,
    ]
  }
}

const mapStateToProps = state => ({
  requestInProcess: state.requests.inProcess.login,
  token: state.auth.token,
  environment: state['app-metadata'].environment,
  mockMode: state['app-metadata'].mockMode,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setMockModeOff: setMockModeOff,
      setMockModeOn: setMockModeOn,
      loginUser: loginUser,
    },
    dispatch,
  )

export default connect(mapStateToProps, mapDispatchToProps)(Login)
