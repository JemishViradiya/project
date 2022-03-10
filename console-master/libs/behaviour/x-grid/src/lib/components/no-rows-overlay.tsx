import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core'
import { GridOverlay } from '@material-ui/x-grid'

import type { NoRowsOverlayProps } from '../types'

const useStyles = makeStyles(theme => ({
  overlay: {
    alignItems: 'start !important',
  },
  content: {
    textAlign: 'center',
    padding: theme.spacing(3),
  },
}))

const NoRowsOverlay = memo(({ noRowsMessageKey }: NoRowsOverlayProps) => {
  const namespaceStartIndex = noRowsMessageKey.lastIndexOf(':')
  const namespace = noRowsMessageKey.slice(0, namespaceStartIndex)
  const { t } = useTranslation(namespace)
  const { overlay, content } = useStyles()
  return (
    <GridOverlay className={overlay}>
      <div className={content}>{t(noRowsMessageKey)} </div>
    </GridOverlay>
  )
})

export default NoRowsOverlay
