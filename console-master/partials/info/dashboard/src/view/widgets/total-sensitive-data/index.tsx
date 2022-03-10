//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Box } from '@material-ui/core'

import type { ChartProps } from '@ues-behaviour/dashboard'
import { TotalCount } from '@ues-behaviour/dashboard'
import { DashboardData } from '@ues-data/dlp'
import { useStatefulReduxQuery } from '@ues-data/shared'

import useStyles from '../styles'

const TotalSensitiveDataWidget: React.FC<ChartProps> = ({ globalTime }) => {
  const { t } = useTranslation('dlp/common')
  const classes = useStyles()
  const { error, loading, data } = useStatefulReduxQuery(DashboardData.queryTotalSensitiveFilesOnEndpoints)
  const totalSensitiveData = useMemo(() => {
    return data
  }, [data])

  return (
    <Box height="100%" display="flex" pt={2} justifyContent="center" className={classes.totalCountWrapper}>
      <TotalCount
        count={String(totalSensitiveData?.totalSensitiveCount ?? 0)}
        description={t('dashboard.totalSensitiveData')}
        onInteraction={() =>
          // TODO add url redirection to events page
          console.log('Redirect to total sensitive data events')
        }
      />
    </Box>
  )
}

export default TotalSensitiveDataWidget
