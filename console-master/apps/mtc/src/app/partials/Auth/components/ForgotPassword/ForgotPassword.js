import './ForgotPassword.scss'

import React from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import { requestForgotPassword } from '../../../../../redux/auth/actions'
import Storage from '../../../../../Storage'
import ForgotPasswordForm from './components/ForgotPasswordForm'

class ForgotPassword extends React.Component {
  state = {
    loading: false,
    actions: null,
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.requestInProcess) {
      this.setState({ loading: true })
    }
    if (!nextProps.requestInProcess && this.props.requestInProcess) {
      this.setState({ loading: false })
      this.state.actions.setSubmitting(false)
      this.props.history.push('/')
    }
  }

  _handleSubmit = (values, actions) => {
    Storage.setRegion(values.region)
    this.props.dispatch(requestForgotPassword(values.email))
    this.setState({
      actions: actions,
    })
  }

  render() {
    return [
      <Helmet key="metadata">
        <title>Forgot Password</title>
      </Helmet>,
      <div className="forgot-password-container" key="forgot-password">
        <ForgotPasswordForm onSubmit={this._handleSubmit.bind(this)} loading={this.state.loading} />
      </div>,
    ]
  }
}
function mapStateToProps(state) {
  return {
    requestInProcess: state.requests.inProcess['forgot-password'],
  }
}

export default compose(connect(mapStateToProps, null))(ForgotPassword, 'Forgot Password')
