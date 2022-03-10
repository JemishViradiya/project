import React from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import Chip from '@material-ui/core/Chip'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import Tooltip from '@material-ui/core/Tooltip'

import type { AlertListItem } from '@ues-data/persona'
import {
  PERSONA_ALERT_STATUS_I18N_MAP,
  PERSONA_EVENT_ID_I18N_MAP,
  PERSONA_SEVERITY_CHIP_CLASSNAME_MAP,
  PERSONA_SEVERITY_I18N_MAP,
} from '@ues-persona/shared'
import { boxFlexCenterProps, I18nFormats } from '@ues/assets'

import { ROUTES } from '../../../constants'

interface AlertsListItemProps {
  alert: AlertListItem
  idx: number
  alertsCount: number
}

export const AlertsListItem: React.FC<AlertsListItemProps> = ({ alert, idx, alertsCount }: AlertsListItemProps) => {
  const { t, i18n } = useTranslation(['persona/common'])

  return (
    <Box width={'100%'}>
      <Box py={3} pt={idx === 0 ? 0 : 3}>
        <Grid container>
          <Grid item xs={'auto'}>
            <Box display="flex" height="100%">
              <Box {...boxFlexCenterProps} px={2} pl={0}>
                <Chip
                  label={t(PERSONA_SEVERITY_I18N_MAP[alert.severity])}
                  className={PERSONA_SEVERITY_CHIP_CLASSNAME_MAP[alert.severity]}
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={3} container alignItems="center">
            <Box overflow="hidden" px={2}>
              <Tooltip title={t(PERSONA_EVENT_ID_I18N_MAP[alert.eventId])} arrow enterDelay={800}>
                <Link href={ROUTES.ALERT_DETAILS.replace(':id', alert.alertId)} noWrap display="block">
                  {t(PERSONA_EVENT_ID_I18N_MAP[alert.eventId])}
                </Link>
              </Tooltip>
            </Box>
          </Grid>
          <Grid item xs={2} container alignItems="center">
            <Box px={2}>{i18n.format(alert.timestamp, I18nFormats.DateTimeRelative)}</Box>
          </Grid>
          <Grid item xs={3} container alignItems="center">
            <Box overflow="hidden" px={2}>
              <Tooltip title={alert.deviceName} arrow enterDelay={800}>
                <Link href={ROUTES.VENUE_DEVICE_DETAILS.replace(':id', alert.deviceId)} noWrap display="block">
                  {alert.deviceName}
                </Link>
              </Tooltip>
            </Box>
          </Grid>
          <Grid item xs={2} container alignItems="center">
            <Box px={2} pr={0}>
              {t(PERSONA_ALERT_STATUS_I18N_MAP[alert.status])}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {idx < alertsCount - 1 ? <Divider /> : null}
    </Box>
  )
}
