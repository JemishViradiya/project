//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box } from '@material-ui/core'

import { Config } from '@ues-gateway/shared'
import { HelpLinks } from '@ues/assets'
import { ContentAreaPanel, PageTitlePanel, SecuredContentBoundary, usePageTitle } from '@ues/behaviours'

import useStyles from './styles'

const { GATEWAY_TRANSLATIONS_KEY } = Config

const NetworkTrafficListContainer: React.FC = ({ children }) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const classes = useStyles()

  usePageTitle(t('events.title'))

  return (
    <Box className={classes.container}>
      <PageTitlePanel title={[t('labelGateway'), t('events.title')]} helpId={HelpLinks.GatewayNetworkActivity} />
      <Box className={classes.content}>
        <ContentAreaPanel fullHeight fullWidth ContentWrapper={SecuredContentBoundary}>
          {children}
        </ContentAreaPanel>
      </Box>
    </Box>
  )
}

export default NetworkTrafficListContainer
