/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import cn from 'classnames'
import type { ReactNode } from 'react'
import React, { memo } from 'react'

import { Backdrop, Box, CircularProgress } from '@material-ui/core'

import type { PageTitlePanelProps } from '@ues/behaviours'
import { PageTitlePanel } from '@ues/behaviours'

import useStyles from './PageBaseStyles'

export interface PageBaseProps extends PageTitlePanelProps {
  showSpinner?: boolean
  children?: ReactNode
  alignCenter?: boolean
  padding?: boolean
  bottomPadding?: boolean
  overflowAuto?: boolean
  canAccess?: boolean
}

export const PageBase = memo((props: PageBaseProps) => {
  const { backdrop, outerContainer, contentContainer, alignCenter, contentPadding, bottomPadding, overflowAuto } = useStyles()
  const { ...pageTitleProps } = props

  const containerClassName = () => {
    const styles = [contentContainer]
    if (props.alignCenter) styles.push(alignCenter)
    if (props.padding) styles.push(contentPadding)
    // TODO: make bottom padding dynamic based on button panel visibility
    if (props.bottomPadding) styles.push(bottomPadding)
    if (props.overflowAuto) styles.push(overflowAuto)
    return cn(styles)
  }

  return (
    <Box className={outerContainer}>
      {props.title && <PageTitlePanel {...pageTitleProps} />}

      <div className={containerClassName()}> {props.children} </div>
      <Backdrop className={backdrop} open={props.showSpinner}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  )
})
