import { noop } from 'lodash-es'
import React, { createContext, useContext, useMemo, useRef, useState } from 'react'

import { makeStyles } from '@material-ui/core'

import type { UesTheme } from '@ues/assets'

import { PERSISTENT_DRAWER_WIDTH_PIXELS } from '../config/view'

export interface ViewContextValue {
  persistentDrawer: {
    containerElementRef: React.MutableRefObject<HTMLDivElement>
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
  }
}

export const ViewContext = createContext<ViewContextValue>({
  persistentDrawer: {
    containerElementRef: { current: null },
    isOpen: false,
    setIsOpen: noop,
  },
})

export const useViewContext = () => useContext(ViewContext)

const useStyles = makeStyles<UesTheme, { persistentDrawerOpen: boolean }>(theme => ({
  viewContainer: {
    display: 'flex',
    width: '100%',
    minWidth: '1024px',
  },
  contentContainer: ({ persistentDrawerOpen: open }) => ({
    flexBasis: open ? `calc(100% - ${PERSISTENT_DRAWER_WIDTH_PIXELS}px)` : '100%',
    transition: theme.transitions.create('flex-basis', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.shorter,
    }),
  }),
  drawerContainer: {
    flex: 1,
  },
}))

export const ViewContextProvider: React.FC = ({ children }) => {
  const persistentDrawerContainerRef = useRef<HTMLDivElement>()
  const [persistentDrawerOpen, setPersistentDrawerOpen] = useState(false)

  const stylesProps = useMemo(() => ({ persistentDrawerOpen }), [persistentDrawerOpen])
  const styles = useStyles(stylesProps)

  const viewContextValue = useMemo<ViewContextValue>(
    () => ({
      persistentDrawer: {
        setIsOpen: (isOpen: boolean) => setPersistentDrawerOpen(isOpen),
        isOpen: persistentDrawerOpen,
        containerElementRef: persistentDrawerContainerRef,
      },
    }),
    [persistentDrawerOpen],
  )

  return (
    <ViewContext.Provider value={viewContextValue}>
      <div className={styles.viewContainer}>
        <div className={styles.contentContainer}>{children}</div>
        <div className={styles.drawerContainer} ref={persistentDrawerContainerRef} />
      </div>
    </ViewContext.Provider>
  )
}
