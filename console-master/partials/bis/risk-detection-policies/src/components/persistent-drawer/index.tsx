import React, { useEffect, useMemo } from 'react'

import { Drawer, makeStyles, Portal } from '@material-ui/core'

import type { UesTheme } from '@ues/assets'

import { PERSISTENT_DRAWER_WIDTH_PIXELS } from '../../config/view'
import { useViewContext } from '../../contexts/view-context'

export interface PersistentDrawerProps {
  isOpen?: boolean
}

const useStyles = makeStyles<UesTheme>(theme => ({
  drawerPaper: {
    borderBottom: 'none',
    borderTop: 'none',
    boxShadow: theme.shadows[3],
    width: PERSISTENT_DRAWER_WIDTH_PIXELS,
  },
}))

export const PersistentDrawer: React.FC<PersistentDrawerProps> = ({ children, isOpen }) => {
  const styles = useStyles()
  const drawerClasses = useMemo(() => ({ paper: styles.drawerPaper }), [styles.drawerPaper])
  const view = useViewContext()

  useEffect(() => view.persistentDrawer.setIsOpen(isOpen), [isOpen, view.persistentDrawer])

  return (
    <Portal container={view.persistentDrawer.containerElementRef.current}>
      <Drawer open={isOpen} variant="persistent" anchor="right" className={styles.drawer} classes={drawerClasses}>
        {children}
      </Drawer>
    </Portal>
  )
}
