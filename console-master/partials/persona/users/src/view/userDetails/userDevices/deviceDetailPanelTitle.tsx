import React from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'

import type { UserDeviceInfo } from '@ues-data/persona'
import { BasicOffline, BasicOnline, I18nFormats, theme } from '@ues/assets'

import { LOWEST_SAFE_TRUST_SCORE } from '../../../constants'
import { isDeviceOffline } from './devicePanel.utils'

interface DeviceDetailPanelTitleProps {
  device: UserDeviceInfo
}

export const DeviceDetailPanelTitle: React.FC<DeviceDetailPanelTitleProps> = ({ device }: DeviceDetailPanelTitleProps) => {
  const { t, i18n } = useTranslation(['persona/common'])

  const trustScoreColor = device.trustScore > LOWEST_SAFE_TRUST_SCORE ? 'inherit' : 'error'
  const isOffline = isDeviceOffline(device.lastEventTime)
  const lastOnlineTimeText = `${t('users.columns.lastOnline')}: ${i18n.format(device.lastEventTime, I18nFormats.DateTimeShort)}`

  const renderStatusIcon = () => (
    <Box display="flex" alignItems="center">
      <Box
        display="flex"
        alignItems="center"
        mr={1}
        color={isOffline ? theme.light.palette.text.disabled : (theme.light.palette as any).util.info}
      >
        {isOffline ? <BasicOffline /> : <BasicOnline />}
      </Box>
      <Typography variant="body2">{t(isOffline ? 'users.state.offline' : 'users.state.online')}</Typography>
    </Box>
  )

  return (
    <Box display="flex" width="100%" alignItems="center" pr={4}>
      <Box flexGrow={1}>
        <Typography variant="h3">{device.deviceName}</Typography>
      </Box>
      <Box pr={6}>
        <Typography variant="body2" color="textSecondary" component="span">{`${t('currentCTS')}:`}</Typography>{' '}
        <Typography variant="body2" color={trustScoreColor} component="span">
          {device.trustScore}
        </Typography>
      </Box>
      {isOffline ? (
        <Tooltip title={lastOnlineTimeText} aria-label={lastOnlineTimeText} placement="top">
          {renderStatusIcon()}
        </Tooltip>
      ) : (
        renderStatusIcon()
      )}
    </Box>
  )
}
