//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Box, CircularProgress } from '@material-ui/core'

import type { ConnectorConfigInfo } from '@ues-data/gateway'

import type { Page } from '../../types'
import { makePageRoute } from '../../utils'

interface ViewResolverProps {
  data: Partial<ConnectorConfigInfo>
  loading: boolean
  error: Error
  pageToRedirect: Page
}

const ErrorView: React.FC<{ pageToRedirect: Page }> = ({ pageToRedirect }) => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate(makePageRoute(pageToRedirect))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

const LoadingView: React.FC = () => (
  <Box display="flex" flexDirection="row" width="100%" height="100%" alignItems="center" justifyContent="center">
    <CircularProgress />
  </Box>
)

export const ViewResolver: React.FC<ViewResolverProps> = ({ pageToRedirect, data, loading, error, children }) => {
  const notReady = (loading || !data) && !error

  if (notReady) {
    return <LoadingView />
  }

  if (error) {
    return <ErrorView pageToRedirect={pageToRedirect} />
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>
}
