import clsx from 'clsx'
import type { CSSProperties } from 'react'
import { useCallback, useMemo } from 'react'

import type { DrawerProps } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'

import { ResponsiveDrawerMode, useResponsiveDrawerMode, useResponsiveDrawerState } from './ResponsiveDrawerProvider'
import type { ResponsiveDrawerTheme } from './theme'

const MODAL_PROPS_TO_IMPROVE_PERFORMANCE = { keepMounted: true }
const OVERLAY_PROPS_TO_IMPROVE_PERFORMANCE = {
  keepMounted: true,
  disablePortal: true,
}
const DRAWER_PAPER_CLASS = '&.MuiDrawer-paper'

export const NESTED_LIST_ITEM_HEIGHT = 40

export const useStyles = makeStyles<ResponsiveDrawerTheme>(
  theme => ({
    root: {
      ...theme.overrides.MuiResponsiveDrawer.paper[DRAWER_PAPER_CLASS],
      backgroundColor: theme.palette.nav.itemBackground,
      color: theme.overrides.MuiResponsiveDrawer.paper.color,
      textAlign: 'initial',
      '& .MuiListItem-button': {
        '&.active, &.Mui-selected': {
          color: theme.palette.common.white,
          backgroundColor: theme.palette.nav.itemBackground,
        },
        '&:hover,&:focus': {
          backgroundColor: `${theme.palette.nav.itemBackground} !important`,
          color: theme.palette.common.white,
        },
      },
    },
    paper: {
      '& .MuiListItem-button': {
        '&.active, &.Mui-selected': {
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.common.white,
        },
        '&:hover': {
          backgroundColor: theme.palette.nav.itemBackground,
          color: theme.palette.common.white,
        },
      },
    },
    modal: {},
    zIndex: {},
    paperAnchorDockedLeft: {},
    full: {
      transition: ([
        theme.transitions.create('width', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        '!important',
      ] as unknown) as CSSProperties['transition'],
    },
    mini: {
      transition: ([
        theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        '!important',
      ] as unknown) as CSSProperties['transition'],
    },
    nestedList: {
      ...theme.overrides.MuiResponsiveDrawer.paper[DRAWER_PAPER_CLASS]['& .MuiCollapse-theme'],
      overflowY: 'auto',
      scrollbarWidth: 'none',
      outline: 'none',
      '& .MuiListItem-theme': {
        height: NESTED_LIST_ITEM_HEIGHT,
        padding: `0 ${theme.spacing(6)}px`,
        backgroundColor: theme.palette.nav.itemBackground,
      },
      '& .MuiListItemText-theme': {
        marginLeft: 0,
        paddingLeft: 0,
      },
      '&::-webkit-scrollbar': {
        width: 0,
      },
    },
  }),
  { name: 'MuiResponsiveDrawer' },
)

export const useResponsiveDrawer = ({ header = {} } = {}): Partial<DrawerProps> => {
  const mode = useResponsiveDrawerMode()
  const { open, toggleState, width } = useResponsiveDrawerState()
  const { root, paper, paperAnchorDockedLeft, modal, full, mini } = useStyles({
    open,
    width,
    header,
  })

  const onClose = useCallback(() => toggleState(() => false), [toggleState])

  const stateClass = open ? full : mini
  const modalClasses = useMemo(() => ({ paper: clsx(paper, root), root: modal }), [modal, paper, root])
  const inlineClasses = useMemo(
    () => ({
      paperAnchorDockedLeft,
      paper,
      root: clsx(root, stateClass),
    }),
    [paper, paperAnchorDockedLeft, root, stateClass],
  )

  let props
  if (mode === ResponsiveDrawerMode.MODAL) {
    props = {
      classes: modalClasses,
      variant: 'temporary',
      open,
      onClose,
      ModalProps: MODAL_PROPS_TO_IMPROVE_PERFORMANCE,
    }
  } else {
    props = {
      classes: inlineClasses,
      variant: 'permanent',
      open,
      onClose,
      ModalProps: OVERLAY_PROPS_TO_IMPROVE_PERFORMANCE,
    }
  }

  return props
}
