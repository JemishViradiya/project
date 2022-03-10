import React, { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { BackgroundAuthenticateFailure } from '../state'
import { getLoginUrl } from '../token'

const selectActive = ({ auth: { headless } }) => headless === 'sso' || headless === 'refresh'
const selectTenant = ({ auth: { tenant } }) => tenant

const Authenticator = () => {
  const active = useSelector(selectActive)
  const tenant = useSelector(selectTenant)
  const dispatch = useDispatch()

  const onError = useCallback(error => dispatch(BackgroundAuthenticateFailure({ tenant, error })), [tenant, dispatch])

  return useMemo(() => {
    if (active) {
      const loginUrl = getLoginUrl(`/${tenant}/headless`, { refresh: true })
      return (
        <iframe
          title="Authenticator"
          className="hidden"
          id="opSessionCheckIframe"
          src={loginUrl}
          width="0"
          height="0"
          onError={onError}
          aria-hidden
        />
      )
    }
    return null
  }, [active, tenant, onError])
}
Authenticator.displayName = 'Authenticator'

export default Authenticator
