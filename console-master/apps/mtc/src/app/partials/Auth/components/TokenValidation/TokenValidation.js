import './TokenValidation.scss'

import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

import LinearProgress from '@material-ui/core/LinearProgress'

import history from '../../../../../configureHistory'
import AuthAPI from '../../../../../services/api/authAPI'

class TokenValidation extends Component {
  state = {
    progress: 33,
  }

  componentDidMount() {
    this._fetch()
  }

  _fetch = () => {
    const params = new URLSearchParams(this.props.location.search)
    const token = params.get('token')
    const regionCode = params.get('regionCode')
    this.setState(
      {
        progress: 66,
      },
      () => {
        AuthAPI.validateToken(token)
          .then(response => {
            this.setState(
              {
                progress: 100,
              },
              () => {
                if (response.data) {
                  history.push(`/auth/set-password?token=${token}&validated=true&regionCode=${regionCode}`)
                } else {
                  history.push('/auth/invalid-token')
                }
              },
            )
          })
          .catch(error => {
            if (error.response.status === 404) {
              history.push('/auth/invalid-token')
            } else {
              // logger.logError('Validate Token Failed', error);
              history.push('/')
            }
          })
      },
    )
  }

  render() {
    return [
      <Helmet key="metadata">
        <title>Validating Token...</title>
      </Helmet>,
      <div id="main-container" metadata="token-validation">
        <LinearProgress mode="determinate" value={this.state.progress} />
        <h1 className="token-validation-header">Validating Token...</h1>
      </div>,
    ]
  }
}

export default TokenValidation
