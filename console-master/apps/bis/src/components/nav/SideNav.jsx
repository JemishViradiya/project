import React, { memo, Suspense } from 'react'
import { useTranslation } from 'react-i18next'

import { List, makeStyles } from '@material-ui/core'

import { NavigationApps as Apps, ResponsiveDrawer } from '@ues-behaviour/nav-drawer'
import { Loading } from '@ues/behaviours'

import { getLogoutUrl } from '../../auth/token'
import { useIdentity } from '../../providers/IdentityProvider'
import { ReactComponent as NavLogoPersona } from '../../static/graphics/navLogoPersona.svg'
import { useStandaloneApps } from './useStandaloneApps'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  userInfo: {
    marginLeft: theme.spacing(6),
  },
  title: {
    fontFamily: 'Titillium Web',
    fontSize: '20px',
    fontWeight: '600',
    lineHeight: '28px',
  },
}))

const UserInfo = memo(({ identity: { displayName, roleTitle, primaryEmail: email } = {} }) => {
  const classes = useStyles()
  return (
    <div className={classes.userInfo}>
      {displayName && <div>{displayName}</div>}
      {roleTitle && <div>{roleTitle}</div>}
      {email && <div>{email}</div>}
    </div>
  )
})

const StandaloneUserInfo = inPopover => {
  const identity = useIdentity()

  return (
    <List>
      <UserInfo identity={identity} />
    </List>
  )
}

const SideNav = memo(({ children }) => {
  const classes = useStyles()
  const { t } = useTranslation()
  const title = <div className={classes.title}>{t('common.title')}</div>
  return (
    <div className={classes.root}>
      <ResponsiveDrawer
        nav={
          <Suspense fallback="">
            <Apps {...useStandaloneApps()} signOutLink={getLogoutUrl()} UserInfo={<StandaloneUserInfo />} />
          </Suspense>
        }
        responsive={true}
        content={<Suspense fallback={<Loading />}>{children}</Suspense>}
        logo={NavLogoPersona}
        title={title}
      />
    </div>
  )
})

export default SideNav
