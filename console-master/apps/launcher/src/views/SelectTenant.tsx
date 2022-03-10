import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, TextField } from '@material-ui/core'

import { useEventHandler } from '@ues-behaviour/react'
import { PORTAL_URL } from '@ues-data/network'
import { LauncherSessionApi } from '@ues-data/shared'

const PLACEHOLDERS = {
  'https://portal-itl.cs.labs.blackberry.com': 'L58829386',
  'https://portal-dev.cs.labs.blackberry.com': 'V10118177',
}

const formStyle = {
  width: '25ex',
}

const dialogStyle = {
  display: 'flex',
  flexFlow: 'column nowrap',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
}

const buttonStyle = {
  width: '100%',
  marginTop: '0.5em',
}

const inputProps = {
  pattern: '[a-zA-Z][0-9]{8}',
  minlegnth: 9,
  maxLength: 9,
}

const SelectTenant: React.FC = memo(() => {
  const { t } = useTranslation('launcher')

  const onSubmit = useEventHandler((ev: React.FormEvent<HTMLFormElement>) => {
    ev.stopPropagation()
    const tenant = ((ev.target as HTMLFormElement).elements[0] as HTMLInputElement).value
    window.location.href = LauncherSessionApi.SessionApi.SessionLoginUrl(tenant)
  }, [])

  React.useEffect(() => {
    const original = window.location.search
    if (original) {
      const search = new URLSearchParams(original)
      search.delete('logout')
      let searchString = search.toString()
      if (searchString === '?') {
        searchString = ''
      }
      if (original !== searchString) {
        const location = new URL(window.location.href)
        location.search = searchString
        window.history.replaceState(null, document.title, location.href)
      }
    }
  }, [])

  return (
    <section style={dialogStyle}>
      <form onSubmit={onSubmit} style={formStyle}>
        <TextField
          id="select-a-tenant"
          label={t('tenant')}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          autoComplete="orgianization"
          type="text"
          required
          fullWidth
          inputProps={inputProps}
          placeholder={PLACEHOLDERS[PORTAL_URL]}
        />
        <Button color="primary" type="submit" style={buttonStyle}>
          {t('sessionStartAction')}
        </Button>
      </form>
    </section>
  )
})

export default SelectTenant
