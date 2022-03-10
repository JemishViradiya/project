/* eslint-disable @typescript-eslint/no-explicit-any */
import cn from 'clsx'
import React from 'react'
import { NavLink, useMatch, useNavigate } from 'react-router-dom'

import type { ListItemProps, TypographyVariant } from '@material-ui/core'
import { ListItem, ListItemIcon, ListItemText, makeStyles, useTheme } from '@material-ui/core'

import type { ResponsiveDrawerTheme } from '../responsiveDrawer'
import { ResponsiveDrawerMode, useResponsiveDrawerMode, useResponsiveDrawerState } from '../responsiveDrawer'
import { getNestedMatches } from './useNestedMatches'

const primaryTypography = { variant: 'subtitle1' as TypographyVariant }
const nestedTypography = { variant: 'subtitle2' as TypographyVariant }

const useStyles = makeStyles<ResponsiveDrawerTheme>(theme => ({
  listIcon: {
    color: `${theme.palette.common.white} !important`,
  },
  popoverOpen: {
    backgroundColor: `${theme.palette.nav.itemBackground} !important`,
    color: theme.palette.common.white,
  },
  selectedItem: {
    borderLeft: `solid ${theme.spacing(1.5)}px ${theme.palette.secondary.main}`,
    paddingLeft: `${theme.spacing(2.5) - 1}px !important`,
  },
  listText: {
    color: theme.palette.common.white,
    '&:hover': {
      color: theme.palette.secondary.main,
    },
  },
  selectedText: {
    color: theme.palette.secondary.main,
  },
}))

export const useNavLinkClick = (
  handleClick?: (event: React.MouseEvent<Element>) => boolean,
): ((event: React.MouseEvent) => void) => {
  const navigate = useNavigate()
  const mode = useResponsiveDrawerMode()
  const { toggleState: toggleDrawerState } = useResponsiveDrawerState()
  const [timerId, setTimerId] = React.useState(null)

  const theme = useTheme()
  const animationDelay = theme.transitions.duration.leavingScreen + 34

  React.useEffect(() => {
    return () => {
      if (timerId) {
        clearTimeout(timerId)
        setTimerId(null)
      }
    }
  }, [timerId])

  return React.useCallback(
    event => {
      if (handleClick && !handleClick(event)) {
        return
      }
      let target = event.target as HTMLAnchorElement
      while (!target.href) {
        target = target.parentElement as HTMLAnchorElement
      }
      const href = target.getAttribute('href')
      if (!href) {
        return
      }

      const rootWindow = window.parent

      rootWindow.document.head.insertAdjacentHTML('beforeend', `<link rel="prefetch prerender" as="document" href="${href}" >`)

      if (rootWindow !== window) {
        navigate('/loading')
      }
      event.stopPropagation()
      event.preventDefault()

      toggleDrawerState(isOpen => {
        const act = () =>
          window.requestAnimationFrame(() => {
            rootWindow.location.replace(href)
          })
        const stayOpen = mode === ResponsiveDrawerMode.INLINE
        setTimerId(setTimeout(act, animationDelay))
        return isOpen && stayOpen
      })
    },
    [handleClick, navigate, toggleDrawerState, mode, animationDelay],
  )
}

export type ListItemLinkProps = Partial<ListItemProps<any, { button?: true }>> & {
  name: string
  icon?: any
  route?: string
  hasChildren?: boolean
  openPop: boolean
  additionalIcon?: any
  nested?: boolean
}

const ListItemLink = React.memo(
  ({
    name,
    route,
    match,
    openPop,
    handleClose,
    hasChildren = false,
    end = false,
    icon: Icon,
    additionalIcon: AdditionalIcon,
    nested = false,
    ...props
  }: ListItemLinkProps) => {
    const mode = useResponsiveDrawerMode()
    const { toggleState, open: drawerOpen } = useResponsiveDrawerState()
    const [pathname, appRoute = '/'] = route ? route.split('#') : []
    const nestedMatches = match ? getNestedMatches(route, match) : false
    const selectedRoute = !!useMatch({ path: appRoute, end })
    const thisSpa = pathname === window.parent.location.pathname || nestedMatches
    const selected = route && thisSpa && (selectedRoute || nestedMatches)

    const { listIcon, popoverOpen, selectedItem, listText, selectedText } = useStyles()

    const onNavClick = () => {
      handleClose && handleClose()
      if (mode === ResponsiveDrawerMode.MODAL) {
        toggleState(false)
      }
    }

    const onAClick = useNavLinkClick()

    const linkProps = thisSpa
      ? {
          component: NavLink,
          to: appRoute,
          activeClassName: 'Mui-selected',
          onClick: onNavClick,
        }
      : {
          component: 'a',
          href: route,
          onClick: onAClick,
        }

    const collectedProps = route
      ? {
          ...props,
          ...linkProps,
        }
      : {
          ...props,
        }
    return (
      <ListItem
        button
        selected={selected}
        classes={{
          root: cn(openPop && popoverOpen, !drawerOpen && openPop && selected && !nested && selectedItem),
        }}
        {...collectedProps}
      >
        {Icon && (
          <ListItemIcon
            classes={{
              root: cn((openPop || selected) && listIcon),
            }}
          >
            <Icon />
          </ListItemIcon>
        )}
        <ListItemText
          primary={
            nested ? name : drawerOpen ? name.replace(/cylance/gi, 'Cylance') : name.toUpperCase().replace(/cylance/gi, 'Cylance')
          }
          primaryTypographyProps={nested ? nestedTypography : primaryTypography}
          classes={{ root: cn(listText, selected && !hasChildren && selectedText) }}
        />
        {AdditionalIcon && (
          <ListItemIcon>
            <AdditionalIcon />
          </ListItemIcon>
        )}
      </ListItem>
    )
  },
)

ListItemLink.displayName = 'ListItemLink'

export default ListItemLink
