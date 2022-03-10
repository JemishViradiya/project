/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React from 'react'

import { Backdrop, Box, CircularProgress, Typography, useTheme } from '@material-ui/core'

import { boxFlexCenterProps } from '@ues/assets'

import { getI18Name, useTranslation } from './i18n'

type LoadingProps = {
  updating?: boolean
  deleting?: boolean
  creating?: boolean
}

export const Busy = ({ updating, deleting, creating }: LoadingProps) => {
  const { t } = useTranslation()
  const theme = useTheme()

  return (
    <Box
      bgcolor={theme.palette.grey[200]} // just to show the loading container
      height="calc(100vh - 32px)" // -32px due to default padding applied in config.js
      width="100%"
      {...boxFlexCenterProps}
    >
      <Box p={6} borderRadius={2} bgcolor={theme.palette.common.white} flexDirection="column" {...boxFlexCenterProps}>
        <CircularProgress color="secondary" />
        <Box pt={4}>
          <Typography variant="body2" color="textSecondary">
            {t(
              getI18Name(
                deleting === true
                  ? 'busyDeleting'
                  : updating === true
                  ? 'busyUpdating'
                  : creating === true
                  ? 'busyCreating'
                  : 'busyLoading',
              ),
            )}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
