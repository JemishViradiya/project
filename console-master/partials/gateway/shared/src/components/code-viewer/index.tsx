//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'

import { Typography } from '@material-ui/core'

interface CodeViewerProps {
  data: unknown
  indentationStyle?: number
}

const CodeViewer: React.FC<CodeViewerProps> = ({ data, indentationStyle = 2 }) => (
  <Typography variant="caption">
    <code style={{ whiteSpace: 'pre' }}>{JSON.stringify(data ?? {}, null, indentationStyle)}</code>
  </Typography>
)

export { CodeViewer }
