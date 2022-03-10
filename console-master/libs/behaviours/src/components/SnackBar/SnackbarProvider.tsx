/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { SnackbarProviderProps as NotistackSnackbarProviderProps } from 'notistack'
import { SnackbarProvider as NotistackSnackbarProvider } from 'notistack'
import React from 'react'

import { Fade } from '@material-ui/core'

import useStyles from './styles'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SnackbarProviderProps extends NotistackSnackbarProviderProps {}

const MAX_SNACKS = 10

export const SnackbarProvider: React.FC<SnackbarProviderProps> = (props: SnackbarProviderProps) => {
  const styles = useStyles()
  const classes = {
    variantSuccess: styles.successBackground,
    variantError: styles.errorBackground,
    variantWarning: styles.warningBackground,
    variantInfo: styles.infoBackground,
  }

  return (
    <NotistackSnackbarProvider TransitionComponent={Fade} maxSnack={MAX_SNACKS} classes={classes} hideIconVariant={false}>
      {props.children}
    </NotistackSnackbarProvider>
  )
}
