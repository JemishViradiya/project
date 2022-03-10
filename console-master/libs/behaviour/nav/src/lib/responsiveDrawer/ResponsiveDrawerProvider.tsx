import PropTypes from 'prop-types'
import type { ReactNode } from 'react'
import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { useMediaQuery, useTheme } from '@material-ui/core'

import { usePointer } from '@ues-behaviour/react'

export type ResponsiveDrawerMode = 'inline' | 'modal'
// eslint-disable-next-line no-redeclare
export const ResponsiveDrawerMode = Object.freeze({
  INLINE: 'inline' as ResponsiveDrawerMode,
  MODAL: 'modal' as ResponsiveDrawerMode,
})

const NavStateKey = 'nav.state'
const SubNavStateKey = 'sub.nav.state'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const ResponsiveDrawerStateContext = React.createContext({
  open: false as boolean,
  toggleState: (fn?: unknown) => {
    if (typeof fn === 'function') fn(false)
  },
  width: 0 as number,
  isOpenSub: (a: string) => false as boolean,
  toggleSub: (a: string, b: boolean) => {
    /* dummy change handler */
  },
  responsive: false as boolean,
} as const)
const ResponsiveDrawerModeContext = React.createContext(ResponsiveDrawerMode.INLINE)

const CLOSED_SM_DOWN_DRAWER_WIDTH = 0
const USE_MEDIA_QUERY_OPTIONS = Object.freeze({ noSsr: true })

// ResponsiveDrawerMode provider
const ResponsiveDrawerModeProvider = ({ theme, children, responsive }) => {
  const isInlineSize = useMediaQuery(theme.breakpoints.up('sm'), USE_MEDIA_QUERY_OPTIONS)
  const pointerType = usePointer()
  const mode = !responsive || (isInlineSize && pointerType !== 'touch') ? ResponsiveDrawerMode.INLINE : ResponsiveDrawerMode.MODAL

  return <ResponsiveDrawerModeContext.Provider value={mode}>{children}</ResponsiveDrawerModeContext.Provider>
}
ResponsiveDrawerModeProvider.propTypes = {
  theme: PropTypes.object.isRequired,
  responsive: PropTypes.bool.isRequired,
  children: PropTypes.node,
}
ResponsiveDrawerModeProvider.displayName = 'ResponsiveDrawerModeProvider'

const defaultToggleFn = (state: boolean): boolean => !state

const defaultOpenUp = 'lg'

const getInitialState = (theme, mode) => {
  if (mode !== ResponsiveDrawerMode.INLINE || !window.matchMedia) {
    return false
  }
  const persistedState = sessionStorage.getItem(NavStateKey)
  if (persistedState) {
    return 'true' === persistedState
  } else {
    return window.matchMedia(theme.breakpoints.up(defaultOpenUp).replace(/^@media( ?)/m, '')).matches
  }
}

const useSessionStorage = openPointer => {
  const isOpenSub = useCallback(subName => {
    const subNavState = sessionStorage.getItem(SubNavStateKey)
    return subNavState ? JSON.parse(subNavState).includes(subName) : false
  }, [])

  const toggleSub = useCallback((subName, state) => {
    const subNavState = sessionStorage.getItem(SubNavStateKey)
    const subNav = subNavState ? JSON.parse(subNavState) : []
    if (state) {
      if (!subNav.includes(subName)) {
        subNav.push(subName)
      }
    } else {
      if (subNav.includes(subName)) {
        subNav.splice(subNav.indexOf(subName), 1)
      }
    }
    sessionStorage.setItem(SubNavStateKey, JSON.stringify(subNav))
  }, [])

  React.useEffect(() => {
    sessionStorage.setItem(NavStateKey, JSON.stringify(openPointer))
  }, [openPointer])

  return [isOpenSub, toggleSub]
}

// State provider
type StateFn = (value: boolean) => boolean | void
declare type State = Readonly<{
  open: boolean
  toggleState: (fn: boolean | StateFn | Partial<Event>) => void
  width: number
  isOpenSub: (a: string) => boolean
  toggleSub: (a: string, b: boolean) => void
  responsive: boolean
}>
const ResponsiveDrawerStateProvider = ({ theme, children, responsive }) => {
  const mode = useResponsiveDrawerMode()
  const [openPointer, setOpenPointer] = useState(() => responsive && getInitialState(theme, mode))
  const [openTouch, setOpenTouch] = React.useState(false)
  useEffect(() => {
    if (mode === ResponsiveDrawerMode.INLINE && openTouch) {
      setOpenTouch(false)
    }
  }, [mode, openTouch])

  const width = useMemo((): number => {
    if (!responsive) {
      return theme.overrides.MuiResponsiveDrawer.mini.width
    }
    switch (mode) {
      case ResponsiveDrawerMode.MODAL:
        return openTouch ? theme.overrides.MuiResponsiveDrawer.modal.width : CLOSED_SM_DOWN_DRAWER_WIDTH
      case ResponsiveDrawerMode.INLINE:
        return openPointer ? theme.overrides.MuiResponsiveDrawer.full.width : theme.overrides.MuiResponsiveDrawer.mini.width
    }
  }, [mode, openPointer, openTouch, responsive, theme.overrides.MuiResponsiveDrawer])

  const toggleState = useCallback(
    fn => {
      const cb = typeof fn === 'function' ? fn : defaultToggleFn
      if (responsive) {
        return (mode !== ResponsiveDrawerMode.INLINE ? setOpenTouch : setOpenPointer)(cb)
      }
      setTimeout(cb, 0, false)
      return true
    },
    [mode, responsive],
  )

  const [isOpenSub, toggleSub] = useSessionStorage(openPointer)

  const open = mode !== ResponsiveDrawerMode.INLINE ? openTouch : openPointer

  const providerValue = useMemo(() => ({ open, toggleState, width, isOpenSub, toggleSub, responsive } as State), [
    width,
    toggleState,
    open,
    isOpenSub,
    toggleSub,
    responsive,
  ])

  return <ResponsiveDrawerStateContext.Provider value={providerValue}>{children}</ResponsiveDrawerStateContext.Provider>
}
ResponsiveDrawerStateProvider.propTypes = {
  theme: PropTypes.object.isRequired,
  responsive: PropTypes.bool.isRequired,
  children: PropTypes.node,
}
ResponsiveDrawerStateProvider.displayName = 'ResponsiveDrawerStateProvider'

// Hooks
export const useResponsiveDrawerMode = (): ResponsiveDrawerMode => useContext(ResponsiveDrawerModeContext)
export const useResponsiveDrawerState = (): State => useContext(ResponsiveDrawerStateContext)

export type ResponsiveDrawerProviderProps = {
  responsive?: boolean
  children: ReactNode
}

export const ResponsiveDrawerProvider = memo(({ children, responsive = false }: ResponsiveDrawerProviderProps) => {
  const theme = useTheme()
  return (
    <ResponsiveDrawerModeProvider theme={theme} responsive={responsive}>
      <ResponsiveDrawerStateProvider theme={theme} responsive={responsive}>
        {children}
      </ResponsiveDrawerStateProvider>
    </ResponsiveDrawerModeProvider>
  )
})

ResponsiveDrawerProvider.displayName = 'ResponsiveDrawerProvider'
