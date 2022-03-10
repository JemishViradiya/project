import clsx from 'clsx'
import React from 'react'

import { Collapse, ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core'
import type { Variant } from '@material-ui/core/styles/createTypography'

import { ArrowChevronDown as ExpandMore, ArrowChevronUp as ExpandLess } from '@ues/assets'

import type { ResponsiveDrawerTheme } from '../responsiveDrawer'
import { useResponsiveDrawerState, useResponsiveNestedListItem } from '../responsiveDrawer'
import { useNavLinkClick } from './ListItemLink'
import type { NavRouteProps } from './useNavListItem'
import { useNestedMatches } from './useNestedMatches'

const primaryTypographyProps = { variant: 'subtitle1' as Variant }

export type ListItemNestedProps = {
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any
  children?: React.ReactNode
  route?: string
  match?: string
  openPop: boolean
  defaultRoute?: string
  nestedRoutes?: NavRouteProps[]
  onMouseOver?: (e: unknown) => void
  onMouseLeave?: (e: unknown) => void
}

const useNestedStyles = makeStyles<ResponsiveDrawerTheme, { open: boolean }>(theme => ({
  paper: (props: { open: boolean }) => ({
    color: theme.palette.common.white,
    backgroundColor: props.open && theme.palette.nav.itemBackground,
  }),
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
  selectedItemOpen: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.secondary.main,
    '&:hover': {
      backgroundColor: `${theme.palette.secondary.main} !important`,
    },
  },
  listText: {
    color: theme.palette.common.white,
    '&:hover': {
      color: theme.palette.secondary.main,
    },
  },
  listTextOpen: {
    color: theme.palette.common.white,
    '&:hover': {
      color: theme.palette.common.white,
    },
  },
}))

const ListItemNested = ({
  name,
  icon: Icon,
  children = null,
  openPop,
  route,
  defaultRoute,
  nestedRoutes = [],
  onMouseOver,
  onMouseLeave,
}: ListItemNestedProps): JSX.Element => {
  const [open, handleClick] = useResponsiveNestedListItem({
    name,
    path: route,
    defaultLink: defaultRoute,
  })
  const { open: drawerOpen } = useResponsiveDrawerState()
  const { nestedMatches } = useNestedMatches(nestedRoutes)

  const onAClick = useNavLinkClick(handleClick)

  const { paper, listIcon, listText, listTextOpen, popoverOpen, selectedItem, selectedItemOpen } = useNestedStyles({ open })

  return (
    <div className={paper}>
      <ListItem
        button
        className={clsx('MuiListItem-theme', nestedMatches && !open ? 'Mui-selected' : undefined)}
        classes={{
          root: clsx(
            openPop && popoverOpen,
            !drawerOpen && nestedMatches && selectedItem,
            (drawerOpen || open) && nestedMatches && selectedItemOpen,
          ),
        }}
        onClick={onAClick}
        component={'a'}
        href={route}
        key={name}
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
      >
        <ListItemIcon
          classes={{
            root: clsx((openPop || nestedMatches) && listIcon),
          }}
        >
          <Icon />
        </ListItemIcon>
        <ListItemText
          primary={name}
          primaryTypographyProps={primaryTypographyProps}
          classes={{ root: drawerOpen || open ? listTextOpen : listText }}
        />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {children}
      </Collapse>
    </div>
  )
}

ListItemNested.displayName = 'ListItemNested'

export default ListItemNested
