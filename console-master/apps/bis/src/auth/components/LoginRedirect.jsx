import React, { memo, useLayoutEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

import ErrorView from '../../components/util/ErrorView'
import { BackgroundAuthenticate } from '../state'
import { getLoginUrl } from '../token'
import LoggedOutView from './LoggedOutView'

const noop = () => {}

const selectAuth = ({ auth }) => auth

const TryLogin = memo(({ authenticated, backgroundAuthenticate, to }) => {
  const { t } = useTranslation('bis/standalone/errors')
  useLayoutEffect(() => {
    backgroundAuthenticate()
  }, [backgroundAuthenticate, to])
  return <ErrorView className="loading-view" summary={t('loadingSessionLabel')} helpLink="" to="" />
})

const ExternalRedirect = ({ to }) => {
  useMemo(() => {
    if (to) {
      window.location.href = to
    }
  }, [to])
  return null
}

export default ({ tenant: urlTenant, to }) => {
  const { headless, tenant, token, isAuthenticated, isInitial, error } = useSelector(selectAuth)
  const dispatch = useDispatch()
  const backgroundAuthenticate = useMemo(() => () => dispatch(BackgroundAuthenticate({ tenant: urlTenant })), [dispatch, urlTenant])
  const refreshing = headless === 'sso' || headless === 'refresh'
  const loggedOutView = <LoggedOutView flavour={token === 'unauthenticated' || isInitial ? 'LoggedOut' : 'Expired'} />

  if (!urlTenant) {
    const redirect = {
      pathname: '/',
      state: { from: to },
    }
    return <Navigate push to={redirect} />
  } else if (urlTenant !== tenant) {
    return loggedOutView
  } else if (isAuthenticated) {
    return <TryLogin to={to} backgroundAuthenticate={noop} authenticated />
  } else if (refreshing) {
    return <TryLogin to={to} backgroundAuthenticate={backgroundAuthenticate} authenticated />
  } else if (isInitial) {
    return <ExternalRedirect to={getLoginUrl(to)} />
  } else if (error) {
    return <LoggedOutView flavour={error} />
  } else {
    return loggedOutView
  }
}
