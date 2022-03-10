//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'

import { Box, Typography } from '@material-ui/core'

import { AriaElementLabel } from '@ues/assets-e2e'
import type { ContentAreaPanelProps } from '@ues/behaviours'
import { ContentAreaPanel } from '@ues/behaviours'

const AclTabContent: React.FC<ContentAreaPanelProps & { title: string; description?: React.ReactNode }> = ({
  children,
  title,
  description,
  ...rest
}) => (
  <ContentAreaPanel fullWidth fullHeight {...rest}>
    <Typography variant="body2">{title}</Typography>
    {description}
    <Box mt={1} height="100%" width="100%" display="flex" flexDirection="column">
      {children}
    </Box>
  </ContentAreaPanel>
)

export default AclTabContent
