import './Auth.scss'

import { useFlags } from 'launchdarkly-react-client-sdk'
import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Header from '../../../components/Header'
import { ssoRegionCheck } from '../../../utils/ssoRegionCheck'
import Banner from './components/Banner'
import ExternalLogin from './components/ExternalLogin'
import ForgotPassword from './components/ForgotPassword'
import InvalidToken from './components/InvalidToken'
import LegalFooter from './components/LegalFooter'
import Login from './components/Login'
import SetForgotPassword from './components/SetForgotPassword'
import SetPassword from './components/SetPassword'
import TokenValidation from './components/TokenValidation'

export default function Auth() {
  const { statusBanner } = useFlags()
  return (
    <div className="auth-container">
      <Header />
      {statusBanner !== '{disabled}' && <Banner description={statusBanner} />}
      <Switch>
        <Route path="/auth/login" component={Login} />
        <Route path="/auth/forgot-password" component={ForgotPassword} />
        <Route path="/auth/set-password" component={SetPassword} />
        <Route path="/auth/set-forgot-password" component={SetForgotPassword} />
        <Route path="/auth/token-validation" component={TokenValidation} />
        <Route path="/auth/invalid-token" component={InvalidToken} />
        <Route path="/auth/external-login" component={ExternalLogin} />
        <Route component={Login} />
      </Switch>
      <LegalFooter />
    </div>
  )
}

// This function is pulling the reffer url to check if sso exists to run the region set function
function isRegionPresent() {
  const lastUrl = document.referrer
  if (lastUrl.includes('sso') || lastUrl.includes('saml')) {
    // This function will pull region from the cookie brought in through the SAML auth
    ssoRegionCheck()
  }
}

isRegionPresent()
