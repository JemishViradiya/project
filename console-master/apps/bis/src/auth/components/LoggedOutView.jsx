import PropTypes from 'prop-types'
import React, { memo, useLayoutEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import useGlobalClientParams from '../../components/hooks/useGlobalClientParams'
import ErrorView from '../../components/util/ErrorView'
import SelectTenantView from './SelectTenantView'

const flavours = {
  LoggedOut: {
    summary: 'signedOut',
    message: 'signedOutMessage',
    link: 'signInAgainLink',
  },
  Expired: {
    summary: 'sessionExpired',
    message: 'sessionExpiredMessage',
    link: 'signInAgainLink',
  },
}

const translateFlavour = (t, flavourName) => {
  const { summary, message, link } = flavours[flavourName]
  return {
    summary: t(summary),
    message: t(message),
    link: t(link),
  }
}
const wrapCustomFlavour = flavour => ({
  ...flavour,
  message: <span dangerouslySetInnerHTML={{ __html: flavour.message }} />,
})

const LoggedOutView = memo(({ to, flavour: flavourName }) => {
  const { t } = useTranslation('bis/standalone/errors')
  const flavour = useMemo(
    () => (typeof flavourName === 'string' ? translateFlavour(t, flavourName) : wrapCustomFlavour(flavourName)),
    [flavourName, t],
  )
  useLayoutEffect(() => {
    document.firstElementChild.style = ''
  }, [])

  const parameters = useGlobalClientParams('loggedOut')
  const helpUrl = parameters && parameters.helpUrl
  const Component = flavour.reason === 'Tenant Not Found' ? SelectTenantView : ErrorView
  return (
    <Component
      className="immediate show-loading-summary"
      summary={flavour.summary}
      message={<p>{flavour.message}</p>}
      to={to || flavour.href || window.location.pathname}
      link={flavour.link}
      helpLink={t('help')}
      helpUrl={helpUrl}
    />
  )
})

LoggedOutView.propTypes = {
  to: PropTypes.string,
  flavour: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
}

LoggedOutView.defaultProps = {
  flavour: 'LoggedOut',
}

export default LoggedOutView
