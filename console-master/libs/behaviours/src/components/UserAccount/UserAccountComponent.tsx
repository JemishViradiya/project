/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import cn from 'clsx'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, List, ListItem, ListItemText, Paper, Popover } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'

import type { ResponsiveDrawerTheme } from '@ues-behaviour/nav-drawer'
import { UesSessionApi, useMock } from '@ues-data/shared'
import { CylanceIconUser } from '@ues/assets'

const DRAWER_PAPER_CLASS = '&.MuiDrawer-paper'

const useStyles = makeStyles<ResponsiveDrawerTheme>(theme => ({
  root: {
    ...theme.overrides.MuiResponsiveDrawer.paper[DRAWER_PAPER_CLASS],
    backgroundColor: theme.palette.nav.itemBackground,
    color: theme.overrides.MuiResponsiveDrawer.paper.color,
    textAlign: 'initial',
    textTransform: 'uppercase',
    '& .MuiList-root': {
      padding: 0,
      overflow: 'visible',
      color: theme.overrides.MuiResponsiveDrawer.paper.color,
      backgroundColor: theme.palette.nav.itemBackground,
    },
    '& .MuiListItem-theme': {
      ...theme.overrides.MuiResponsiveDrawer.paper[DRAWER_PAPER_CLASS]['& .MuiListItem-theme'],
      margin: 0,
      padding: `0 ${theme.spacing(6)}px`,
    },
    '& .Mui-selected': {
      color: `${theme.palette.secondary.main} !important`,
      backgroundColor: 'inherit !important',
    },
    position: 'relative',
    top: '-8px',
  },
  itemRoot: {
    position: 'relative',
    backgroundColor: theme.palette.nav.itemBackground,
    height: `${theme.spacing(10)}px !important`,
    paddingTop: 0,
    paddingBottom: 0,
  },
  nestedList: {
    ...theme.overrides.MuiResponsiveDrawer.paper[DRAWER_PAPER_CLASS]['& .MuiCollapse-theme'],
    overflowY: 'auto',
    scrollbarWidth: 'none',
    textTransform: 'none !important',
    '& .MuiListItem-theme': {
      height: `${theme.spacing(10)}px !important`,
    },
    '& .MuiListItemText-theme': {
      marginLeft: 0,
      paddingLeft: 0,
    },
    '&::-webkit-scrollbar': {
      width: 0,
    },
  },
  popover: {
    pointerEvents: 'none',
  },
  popoverContent: {
    pointerEvents: 'auto',
    backgroundColor: 'transparent',
    border: 'none',
    minWidth: 200,
  },
  topTriangle: {
    border: '8px solid transparent',
    borderBottomColor: theme.palette.nav.itemBackground,
    width: '8px',
    position: 'relative',
    top: '-8px',
    right: '20px',
  },
  linkText: {
    color: theme.palette.common.white,
    '&:hover': {
      color: theme.palette.secondary.main,
      backgroundColor: theme.palette.nav.itemBackground,
    },
  },
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

const ListItemComponent = props => {
  const { text, variant, href, additionalIcon } = props
  const classes = useStyles()
  return (
    <ListItem key={text} button component="a" href={href} className={cn(classes.itemRoot, classes.linkText)}>
      {additionalIcon}
      <ListItemText primaryTypographyProps={{ variant: variant }}>{text}</ListItemText>
    </ListItem>
  )
}

const UesUserInfo = React.memo(props => {
  const { t } = useTranslation(['navigation'])
  const mock = useMock()
  let accountEmail = t('UESUserAccount')
  try {
    const { data } = UesSessionApi.getSession()
    const email = data.actor ? t('ghostLogin', { actor: data.actor, email: data.email }) : data.email
    if (data && !mock) accountEmail = email
  } catch (error) {
    console.error(error)
  }
  return <ListItemComponent key="accountSettings" text={accountEmail} href="/Account/AccountSettings" variant="subtitle1" />
})

// TODO: route this with nav service
const navigation = [
  { name: 'myAccount', route: '/Account/AccountSettings' },
  { name: 'auditLog', route: '/AuditLog' },
  { name: 'settings', route: '/Application' },
  { name: 'howtoGuide', route: '/Tutorial' },
  { name: 'helpFaq', route: '/Enterprise/Help' },
]

export const UserAccountComponent: React.FC<{
  UserInfo?: React.FunctionComponent
  signOutLink?: string
}> = React.memo(({ UserInfo = UesUserInfo, signOutLink = UesSessionApi.SessionLogoutUrl(), ...props }) => {
  const { t } = useTranslation(['navigation'])
  const [openedPopover, setOpenedPopover] = useState(false)
  const popoverAnchor = useRef(null)
  const theme = useTheme()
  const classes = useStyles(theme)
  // temporary solution, should be deleted after scrollbar is removed from page title header
  const drawerContent = document.getElementById('drawerContent')

  const popoverEnter = () => {
    setOpenedPopover(true)
  }

  const popoverLeave = () => {
    setOpenedPopover(false)
  }

  const userInfo = () => {
    return (
      <List>
        <UserInfo />
        {/* TODO: route this with nav service */}
        {navigation.map(({ name, route }) => (
          <ListItemComponent key={name} text={t(name)} href={route} variant="subtitle2" />
        ))}
        <ListItemComponent key="signOut" text={t('signOut')} href={signOutLink} variant="subtitle2" />
      </List>
    )
  }

  return (
    <>
      <div ref={popoverAnchor} className={classes.round} onMouseEnter={popoverEnter} onMouseLeave={popoverLeave}>
        <CylanceIconUser style={{ fontSize: 20 }} htmlColor={'#babbc0'} />
      </div>
      <Popover
        disableScrollLock
        id="my-account-popover"
        marginThreshold={drawerContent?.scrollHeight > drawerContent?.offsetHeight ? theme.spacing(8) : theme.spacing(4)}
        className={classes.popover}
        classes={{ paper: classes.popoverContent }}
        open={openedPopover}
        anchorEl={popoverAnchor.current}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{ onMouseEnter: popoverEnter, onMouseLeave: popoverLeave, elevation: 0 }}
      >
        <Box display="flex" justifyContent="flex-end">
          <div className={classes.topTriangle}></div>
        </Box>
        <Paper elevation={0} className={classes.root}>
          <List disablePadding>
            <div className={classes.nestedList}>{userInfo()}</div>
          </List>
        </Paper>
      </Popover>
    </>
  )
})
