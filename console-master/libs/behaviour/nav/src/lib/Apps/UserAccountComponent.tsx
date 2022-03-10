import React from 'react'
import { useTranslation } from 'react-i18next'

import { List, makeStyles, useTheme } from '@material-ui/core'

import { LauncherSessionApi, UesSessionApi, useMock, useSuspenseQuery } from '@ues-data/shared'
import { BasicSignOut, CylanceIconUser } from '@ues/assets'

import { ResponsiveDrawerMode, useResponsiveDrawerMode } from '../responsiveDrawer'
import ListItemLink from './ListItemLink'
import ListItemsPopover, { useListItemPopover } from './ListItemsPopover'
import type { NavListItemProps, NavRouteProps } from './useNavListItem'

const useStyles = makeStyles(theme => ({
  round: {
    backgroundColor: '#e6e6e6',
    height: 40,
    width: 40,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing(2),
    '&:hover': {
      backgroundColor: '#cccccc',
      '& .MuiSvgIcon-root': {
        fill: '#5b5b5b',
      },
    },
  },
}))

const UesUserInfo = React.memo<{
  openPop?: boolean
}>(props => {
  const { openPop } = props
  const mock = useMock()
  const mode = useResponsiveDrawerMode()
  try {
    const info = useSuspenseQuery(LauncherSessionApi.LauncherMyUserQuery)
    if (!info) {
      return null
    }
    return (
      <ListItemLink
        key={info.email}
        name={info.email}
        route="/Account/AccountSettings"
        openPop={openPop}
        nested={mode === ResponsiveDrawerMode.MODAL}
      />
    )
  } catch (error) {
    if (!mock) {
      return (
        <ListItemLink
          key="UES User Account"
          name="UES User Account"
          route="/Account/AccountSettings"
          openPop={openPop}
          nested={mode === ResponsiveDrawerMode.MODAL}
        />
      )
    }
  }
})

// TODO: route this with nav service
const defaultNav: { route?: string; navigation: NavRouteProps[] } = {
  navigation: [
    { name: 'myAccount', route: '/Account/AccountSettings' },
    { name: 'auditLog', route: '/AuditLog' },
    { name: 'settings', route: '/Application' },
    { name: 'howtoGuide', route: '/Tutorial' },
    { name: 'helpFaq', route: '/Enterprise/Help' },
  ] as NavRouteProps[],
}

export const UserAccountComponent: React.FC<{
  nav?: NavListItemProps
  UserInfo?: React.FunctionComponent
  signOutLink?: string
}> = React.memo(
  ({
    nav: { navigation, route } = defaultNav,
    UserInfo = UesUserInfo,
    signOutLink = UesSessionApi.SessionLogoutUrl(),
    ...props
  }) => {
    const { t } = useTranslation(['navigation'])
    const theme = useTheme()
    const { round } = useStyles()
    const [anchorEl, openPop, openPopoverMenu, handleClose, handleOpen] = useListItemPopover()
    const mode = useResponsiveDrawerMode()

    const userInfo = (inPopover: boolean) => {
      return (
        <List>
          <UserInfo openPop={openPop} />
          {/* TODO: route this with nav service */}
          {navigation.map(({ name, route }) => (
            <ListItemLink key={name} name={t(name)} route={route} openPop={openPop} nested={mode === ResponsiveDrawerMode.INLINE} />
          ))}
          <ListItemLink
            key="signOut"
            name={t('signOut')}
            route={signOutLink}
            openPop={openPop}
            nested={mode === ResponsiveDrawerMode.INLINE}
            additionalIcon={BasicSignOut}
            {...props}
          />
        </List>
      )
    }

    return (
      <>
        <div
          className={round}
          onMouseOver={openPopoverMenu}
          onFocus={openPopoverMenu}
          onMouseOut={handleClose}
          onBlur={handleClose}
        >
          <CylanceIconUser style={{ fontSize: 20 }} htmlColor={'#babbc0'} />
        </div>
        <ListItemsPopover
          name="myAccount"
          icon={null}
          defaultRoute={route}
          handleClose={handleClose}
          anchorEl={anchorEl}
          handleOpen={handleOpen}
          openPop={openPop}
          isAccountComponent={true}
        >
          {userInfo(true)}
        </ListItemsPopover>
      </>
    )
  },
)
