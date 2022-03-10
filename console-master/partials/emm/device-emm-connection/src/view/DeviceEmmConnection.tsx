import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, makeStyles, Typography } from '@material-ui/core'

import type { DeviceStatusDetails } from '@ues-data/emm'
import { DeviceEmmRegistrationStatus, DevicesApi } from '@ues-data/emm'
import { FeatureName, useErrorCallback, useFeatures, useStatefulAsyncQuery } from '@ues-data/shared'
import { BasicTime, StatusMedium } from '@ues/assets'
import { useSnackbar } from '@ues/behaviours'

export interface DeviceEmmConnectionProps {
  deviceId: string
}

const useStyles = makeStyles(() => ({
  cardText: {
    display: 'flex',
    justifyContent: 'left',
  },
  emmConnectionType: {
    alignItems: 'center',
    display: 'flex',
    width: 'max-content',
    '& > svg': {
      maxHeight: '1rem',
    },
  },
}))

const printEmmConnectionInfo = (t, deviceStatusDetails: DeviceStatusDetails, classes) => {
  if (deviceStatusDetails) {
    const hasEmmConnection = deviceStatusDetails.emmType !== undefined
    if (hasEmmConnection) {
      const successRegistrationStatus = deviceStatusDetails.registrationStatus === DeviceEmmRegistrationStatus.Success
      if (successRegistrationStatus) {
        return deviceStatusDetails.emmType
      } else {
        let registrationStatusIcon
        let registrationStatusMessage
        if (deviceStatusDetails.registrationStatus === DeviceEmmRegistrationStatus.Pending) {
          registrationStatusIcon = <BasicTime />
          registrationStatusMessage = t('emmConnection.registrationStatusMessage.pending', {
            emmType: deviceStatusDetails.emmType,
          })
        } else if (deviceStatusDetails.registrationStatus === DeviceEmmRegistrationStatus.Error) {
          registrationStatusIcon = <StatusMedium />
          registrationStatusMessage = t('emmConnection.registrationStatusMessage.error', {
            emmType: deviceStatusDetails.emmType,
          })
        }

        return (
          <div className={classes.emmConnectionType}>
            {registrationStatusIcon}
            <div>{registrationStatusMessage}</div>
          </div>
        )
      }
    } else {
      return t('endpoint.details.emmConnection.registrationStatusMessage.noConnection')
    }
  }
}

const DeviceEmmConnection: React.FC<DeviceEmmConnectionProps> = ({ deviceId }) => {
  const { t } = useTranslation(['emm/connection'])
  const classes = useStyles()
  const { enqueueMessage } = useSnackbar()
  const { isEnabled } = useFeatures()
  const intuneIntegrationEnabled = isEnabled(FeatureName.UESIntuneIntegration)

  const { loading, data: deviceStatusDetails, error: deviceStatusDetailsFetchError } = useStatefulAsyncQuery(
    DevicesApi.queryDeviceStatusDetails,
    {
      variables: {
        userDeviceId: deviceId,
      },
      skip: !intuneIntegrationEnabled,
    },
  )
  useErrorCallback(deviceStatusDetailsFetchError, () => {
    enqueueMessage(t('emmConnection.error.fetch'), 'error')
  })

  return !loading && deviceStatusDetails ? (
    <>
      <Box className={classes.cardText}>
        <Typography variant="caption">{t('emmConnection.title')}</Typography>
      </Box>
      <Box className={classes.cardText}>
        <Typography variant="body2">{printEmmConnectionInfo(t, deviceStatusDetails, classes)}</Typography>
      </Box>
    </>
  ) : (
    <></>
  )
}

export default DeviceEmmConnection
