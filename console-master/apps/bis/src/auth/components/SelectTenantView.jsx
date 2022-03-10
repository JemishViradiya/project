import PropTypes from 'prop-types'
import React, { memo, useLayoutEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { useEventHandler } from '@ues-behaviour/react'

import useGlobalClientParams from '../../components/hooks/useGlobalClientParams'
import ErrorView from '../../components/util/ErrorView'
import styles from './SelectTenantView.module.less'

const selectTenant = ({ auth: { tenant } }) => tenant

const login = tenant => {
  // Reload in the tenant context
  window.location.href = `${window.location.origin}/${tenant}/#/`
}

const loadPresence = tenant => {
  const controller = new AbortController()
  const signal = controller.signal
  const request = fetch(`/${tenant}/presence`, {
    signal,
    headers: {
      Accept: 'application/json',
    },
  })
  return {
    tenant,
    controller,
    request,
  }
}

// eslint-disable-next-line sonarjs/cognitive-complexity
const SelectTenantView = memo(({ flavour, failedTenant }) => {
  const { t } = useTranslation('bis/standalone/errors')
  const currentTenant = useSelector(selectTenant) || failedTenant
  const parameters = useGlobalClientParams('loggedOut')
  const helpUrl = parameters && parameters.helpUrl
  useLayoutEffect(() => {
    document.firstElementChild.style = ''
  }, [])

  const localStorageLength = localStorage.length
  const knownTenants = useMemo(() => {
    const tenants = []
    for (let i = localStorageLength - 1; i >= 0; i--) {
      const [tenant, field] = localStorage.key(i).split('.')
      if (field === 'lastAccessTime') {
        tenants.push(tenant)
      }
    }
    return tenants
  }, [localStorageLength])

  const [presence, setPresence] = useState({})
  const onSubmit = useEventHandler(
    ev => {
      ev.stopPropagation()
      const tenant = ev.target.elements[0].value

      if (presence) {
        if (presence.tenant === tenant) return
        if (presence.controller) presence.controller.abort()
      }
      const load = loadPresence(tenant)
      load.request.then(result => {
        const success = result.status === 200 || result.status === 204
        if (success) return login(tenant)
        setPresence({ tenant })
      })
      setPresence(load)
    },
    [presence, setPresence],
  )
  let label = ''
  const errorTenant = !presence.request && presence.tenant
  if (presence.tenant && presence.request) {
    // label = <Loading className={styles.loading} />
    label = t('loadingTenantLabel')
  } else if (errorTenant || flavour !== 'empty') {
    label = t('noTenantLabel', { tenant: errorTenant || currentTenant }) + t('tenantIdLabel')
  } else {
    label = t('tenantIdLabel')
  }

  const message = (
    <form onSubmit={onSubmit}>
      <label htmlFor="select-a-tenant" className={styles.message}>
        {label}
      </label>
      <input
        id="select-a-tenant"
        list="select-a-tenant-options"
        className={styles.input}
        type="text"
        autoFocus // eslint-disable-line jsx-a11y/no-autofocus
        autoComplete="off"
        placeholder={`— ${t('tenantID')} —`}
        required
      />
      <datalist id="select-a-tenant-options">
        {knownTenants.map(tenant => (
          <option key={tenant} value={tenant} />
        ))}
      </datalist>
      <button className={styles.button} type="submit">
        {t('next')}
      </button>
    </form>
  )
  return <ErrorView summary={t('signIn')} message={message} to="" link="" helpLink={t('help')} helpUrl={helpUrl} />
})

SelectTenantView.propTypes = {
  flavour: PropTypes.string,
  failedTenant: PropTypes.string,
}

export default SelectTenantView
