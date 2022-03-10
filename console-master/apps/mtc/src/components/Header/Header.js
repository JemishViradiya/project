import './Header.scss'

import React from 'react'
import { connect } from 'react-redux'

import history from '../../configureHistory'
import AccountUtility from './components/AccountUtility'
import Logo from './components/Logo'
import IconTabs from './components/Navigation'

const Header = props => (
  <div className="header">
    <div id="logo-column" onClick={() => history.push('/')}>
      <Logo />
    </div>
    {props.menu && (
      <div id="nav-column">
        <IconTabs />
      </div>
    )}
    {props.utility && !props.eulaSign && (
      <div id="account-column">
        <AccountUtility />
      </div>
    )}
  </div>
)

const mapStateToProps = state => ({
  eulaSign: state.auth.permissions['eula:sign'],
})

export default connect(mapStateToProps, null)(Header)
