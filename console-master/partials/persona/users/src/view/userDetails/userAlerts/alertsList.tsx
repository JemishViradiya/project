import cond from 'lodash-es/cond'
import React from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import type { AlertListItem } from '@ues-data/persona'
import { boxFlexCenterProps } from '@ues/assets'

import { AlertsListItem } from './alertsListItem'

interface AlertsListProps {
  alerts: AlertListItem[]
  pending: boolean
}

export const AlertsList: React.FC<AlertsListProps> = ({ alerts, pending }: AlertsListProps) => {
  const { t } = useTranslation(['persona/common', 'components'])

  const renderLoader = () => (
    <Box p={6} borderRadius={2} width="100%" flexDirection="column" {...boxFlexCenterProps}>
      <CircularProgress color="secondary" />
      <Box pt={4}>
        <Typography variant="body2" color="textSecondary">
          {t('loading')}
        </Typography>
      </Box>
    </Box>
  )

  const renderNoItemsToDisplay = () => (
    <Grid item container xs={12} justifyContent="center" alignItems="center">
      <Typography variant="caption" color="textSecondary">
        {t('noData')}
      </Typography>
    </Grid>
  )

  const renderAlerts = () => (
    <>
      {alerts.map((alert, idx) => (
        <AlertsListItem key={alert.alertId} alert={alert} idx={idx} alertsCount={alerts.length} />
      ))}
    </>
  )

  return (
    <Grid container>
      {cond([
        [() => pending, () => renderLoader()],
        [() => alerts.length === 0, () => renderNoItemsToDisplay()],
        [() => true, () => renderAlerts()],
      ])(undefined)}
    </Grid>
  )
}
