import './AccountUtility.scss'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Dropdown } from 'semantic-ui-react'

import { logoutUser } from '../../../../redux/auth/actions'
import Storage from '../../../../Storage'

class AccountUtility extends Component {
  constructor(props) {
    super(props)
    this.state = {
      toggleClass: false,
      loggedIn: Storage.getLoggedInAccount(),
    }
    this._handleMouseOver = this._handleMouseOver.bind(this)
    this._handleMouseLeave = this._handleMouseLeave.bind(this)
    this._handleLogout = this._handleLogout.bind(this)
  }

  _handleMouseOver() {
    this.setState({ toggleClass: true })
  }

  _handleMouseLeave() {
    this.setState({ toggleClass: false })
  }

  _handleLogout() {
    // this.props.logger.logEvent('Logout', 'Click');
    this.props.dispatch(logoutUser())
    Storage.deleteCookies()
    Storage.deleteToken()
  }

  render() {
    return (
      <Dropdown
        id="account-utility-menu-dropdown"
        className={`${this.state.toggleClass ? 'toggle-open' : 'toggle-close'}`}
        onMouseOver={this._handleMouseOver}
        onMouseLeave={this._handleMouseLeave}
        trigger={<span className="icon-user" />}
        icon="dont"
        open
        closeOnChange={false}
      >
        <Dropdown.Menu>
          <Dropdown.Item className="username">
            <p>{this.state.loggedIn}</p>
          </Dropdown.Item>
          <Dropdown.Item>
            <Link to="/profile">My Profile</Link>
          </Dropdown.Item>
          <Dropdown.Item>
            <Link to="/audit">Audit Log</Link>
          </Dropdown.Item>
          <Dropdown.Item>
            <Link to="/account">Account Overview</Link>
          </Dropdown.Item>
          <Dropdown.Item>
            <a href="/documentation/index.html" target="_blank">
              API Documentation
            </a>
          </Dropdown.Item>
          <Dropdown.Item>
            <a href="/status/index.html" target="_blank">
              Status
            </a>
          </Dropdown.Item>
          <Dropdown.Item>
            <a role="button" tabIndex={0} id="account-utility-logout-link" onClick={this._handleLogout}>
              Sign Out
            </a>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}

export default connect()(AccountUtility)
