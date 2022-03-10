import React, { memo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { IconButton, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import type { UesTheme } from '@ues/assets'
import { BasicClose } from '@ues/assets'

import { PersistentDrawer } from '../../../persistent-drawer'
import { DetectionsStore } from '../detections-store'

export interface DetectionsDrawerProps {
  toggleDrawer: () => void
  openDrawer: () => void
  closeDrawer: () => void
  open: boolean
  readOnly?: boolean
}

const useStyles = makeStyles<UesTheme>(theme => ({
  contentContainer: {
    boxSizing: 'border-box',
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(8),
    paddingRight: theme.spacing(8),
    paddingTop: theme.spacing(4),
    width: '100%',
  },
  drawerTitle: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(4),
  },
}))

export const useDetectionsDrawerProps = (): DetectionsDrawerProps => {
  const [open, setOpen] = useState(false)

  const toggleDrawer = useCallback(() => setOpen(current => !current), [])
  const openDrawer = useCallback(() => setOpen(true), [])
  const closeDrawer = useCallback(() => setOpen(false), [])

  return { open, toggleDrawer, openDrawer, closeDrawer }
}

export const DetectionsDrawer = memo<DetectionsDrawerProps>(({ closeDrawer, open, readOnly }) => {
  const styles = useStyles()
  const { t } = useTranslation(['general/form', 'bis/ues'])

  useEffect(() => {
    if (readOnly) {
      closeDrawer()
    }
  }, [closeDrawer, readOnly])

  return (
    <PersistentDrawer isOpen={open}>
      <div className={styles.contentContainer}>
        <Typography className={styles.drawerTitle} variant="h2">
          {t('bis/ues:detectionPolicies.threats.addDetectionsDrawer.title')}
          <IconButton onClick={closeDrawer} aria-label={t('general/form:commonLabels.close')}>
            <BasicClose fontSize="small" />
          </IconButton>
        </Typography>
        <Typography gutterBottom>{t('bis/ues:detectionPolicies.threats.addDetectionsDrawer.description')}</Typography>

        <DetectionsStore />
      </div>
    </PersistentDrawer>
  )
})
