import './MainContainer.scss'

import moment from 'moment'
import React from 'react'
import Idle from 'react-idle'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Header from '../../../components/Header'
import { logoutUser, updateToken } from '../../../redux/auth/actions'
import Storage from '../../../Storage'

class MainContainer extends React.Component {
  state = {
    timeout: 3600000, // 60 minutes = 3600000
  }

  componentDidMount() {
    let requestInProcess = false

    this.refreshCheck = setInterval(() => {
      const currentTime = moment()
      const expirationTime = moment(parseInt(Storage.getTokenExpiration(), 10) * 1000).subtract(20, 'seconds')
      if ((currentTime.isAfter(expirationTime) || currentTime.isSame(expirationTime)) && !requestInProcess) {
        requestInProcess = true
        Storage.refreshToken((error = false) => {
          requestInProcess = false
          this.props.updateToken(Storage.getBearerToken())
          if (error) {
            clearInterval(this.refreshCheck)
          }
        })
      }
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.refreshCheck)
  }

  _onIdle = idle => {
    if (idle) {
      Storage.deleteCookies()
      Storage.deleteToken()
      this.props.logoutUser()
    }
  }

  render() {
    return [
      <Idle key="idle-timer" onChange={this._onIdle} timeout={this.state.timeout} />,
      <div key="main">
        <Header menu utility />
        {this.props.children}
      </div>,
    ]
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      logoutUser: logoutUser,
      updateToken: updateToken,
    },
    dispatch,
  )
}

export default connect(null, mapDispatchToProps)(MainContainer)
