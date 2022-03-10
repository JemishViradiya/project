//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Box } from '@material-ui/core'

import { ContentAreaPanel, PageTitlePanel, SecuredContentBoundary } from '@ues/behaviours'

import useStyles from '../styles'
import EvidenceLockerList from './evidence-locker-list'

const EvidenceLocker: React.FC = () => {
  const { t } = useTranslation('dlp/common')
  const classes = useStyles()

  return (
    <Box className={classes.container}>
      <PageTitlePanel title={t('evidenceLocker.title')} />
      <Box className={classes.content}>
        <ContentAreaPanel fullHeight fullWidth ContentWrapper={SecuredContentBoundary}>
          <EvidenceLockerList />
        </ContentAreaPanel>
      </Box>
    </Box>
  )
}

export default EvidenceLocker
