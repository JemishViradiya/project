//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import clsx from 'clsx'
import React from 'react'

import type { BoxProps } from '@material-ui/core'
import { Box, Card, CardContent, CardHeader, Paper, Typography } from '@material-ui/core'

import useStyles from './styles'

export interface ContentAreaPanelProps {
  title?: string
  subtitle?: string
  fullWidth?: boolean
  fullHeight?: boolean
  boxProps?: BoxProps
  // eslint-disable-next-line @typescript-eslint/ban-types
  ContentWrapper?: React.ElementType<{}>
}

export const ContentAreaPanel: React.FC<ContentAreaPanelProps> = ({
  title,
  subtitle,
  fullWidth,
  fullHeight,
  children,
  boxProps,
  ContentWrapper = React.Fragment,
}) => {
  const classNames = useStyles({ fullHeight })
  const widthProps = fullWidth ? { width: '100%', minWidth: 1024 } : { width: 1024, maxWidth: 1024 }

  return (
    <Box {...widthProps} {...boxProps} className={clsx('ues-component-content-area-panel', classNames.contentContainer)}>
      <Paper variant="outlined" className={classNames.contentContainer}>
        <Card raised={false} className={classNames.contentContainer}>
          <ContentWrapper>
            {title && <CardHeader title={<Typography variant="h2">{title}</Typography>} />}
            <CardContent className={classNames.contentAreaPanelChildren}>
              {subtitle && <Typography variant="subtitle1">{subtitle}</Typography>}
              {children}
            </CardContent>
          </ContentWrapper>
        </Card>
      </Paper>
    </Box>
  )
}
