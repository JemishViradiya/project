//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Box } from '@material-ui/core'

import type { ChartProps } from '@ues-behaviour/dashboard'
import { TotalCount } from '@ues-behaviour/dashboard'
import { DashboardData } from '@ues-data/dlp'
import { useStatefulReduxQuery } from '@ues-data/shared'

import useStyles from '../styles'

const EvidenceLockerFilesWidget: React.FC<ChartProps> = ({ globalTime }) => {
  const { t } = useTranslation('dlp/common')
  const classes = useStyles()

  const { error, loading, data, refetch } = useStatefulReduxQuery(DashboardData.queryEvidenceLockerInfo)

  const evidenceLockerInfo = useMemo(() => {
    return data
  }, [data])

  return (
    <Box height="100%" display="flex" pt={2} justifyContent="center" className={classes.totalCountWrapper}>
      <TotalCount
        count={String(evidenceLockerInfo?.totalFilesCount ?? 0)}
        description={t('dashboard.evidenceLockerFiles')}
        onInteraction={() =>
          // TODO add url redirection to events page
          console.log('Redirect to evidence locker files events')
        }
      />
    </Box>
  )
}

export default EvidenceLockerFilesWidget
