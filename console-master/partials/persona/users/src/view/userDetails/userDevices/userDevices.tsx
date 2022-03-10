import cond from 'lodash-es/cond'
import orderBy from 'lodash-es/orderBy'
import React from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'

import { queryUserDevices } from '@ues-data/persona'
import { useStatefulReduxQuery } from '@ues-data/shared'
import { boxFlexCenterProps } from '@ues/assets'

import { DeviceDetailPanel } from './deviceDetailPanel'

interface UserDevicesProps {
  userId: string
}

export const UserDevices: React.FC<UserDevicesProps> = React.memo(({ userId }: UserDevicesProps) => {
  const { t } = useTranslation(['persona/common'])

  const { data, loading } = useStatefulReduxQuery(queryUserDevices, { variables: userId })

  const userDevices = data?.data ?? []
  const associatedDeviceCount = userDevices.length
  const sortedDevices = orderBy(userDevices, 'lastEventTime', 'desc')

  const renderDevices = () => (
    <>
      {sortedDevices.map(device => (
        <DeviceDetailPanel key={device.deviceName} userId={userId} device={device} />
      ))}
    </>
  )

  const renderLoader = () => (
    <Box p={6} mt={4} borderRadius={2} width="100%" flexDirection="column" {...boxFlexCenterProps}>
      <CircularProgress color="secondary" />
      <Box pt={4}>
        <Typography variant="body2" color="textSecondary">
          {t('loading')}
        </Typography>
      </Box>
    </Box>
  )

  return (
    <Box mt={4}>
      <Typography variant="h2">{t('users.sectionTitles.associatedDevices', { count: associatedDeviceCount })}</Typography>

      {cond([
        [() => loading, renderLoader],
        [() => true, renderDevices],
      ])(undefined)}
    </Box>
  )
})
