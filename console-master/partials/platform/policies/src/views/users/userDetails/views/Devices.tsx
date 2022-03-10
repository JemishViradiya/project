/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router'

import { Box, Card, CardContent, CardHeader, CircularProgress, Grid, Link, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { UsersApi } from '@ues-data/platform'
import { FeatureName, Permission, useFeatures, usePermissions, useStatefulAsyncQuery } from '@ues-data/shared'
import { DeviceDesktop, DeviceMobile, I18nFormats } from '@ues/assets'
import { ContentAreaPanel, SecuredContentBoundary, useSecuredContent, useSnackbar } from '@ues/behaviours'

import { DeviceMoreOptions } from './Devices/DeviceMoreOptions'
import { useDeviceDeactivation } from './Devices/useDeviceDeactivation'

const useStyles = makeStyles(theme => ({
  cardText: {
    display: 'flex',
    justifyContent: 'center',
  },
  cardIconBox: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
  },
  cardIcon: {
    width: '48px',
    height: '48px',
  },
  spacer: {
    paddingTop: theme.spacing(5), // 20px
  },
}))

const Devices = () => {
  useSecuredContent(Permission.ECS_DEVICES_READ)
  const classes = useStyles()
  const { enqueueMessage } = useSnackbar()
  const { t, i18n } = useTranslation(['platform/common'])
  const { hasPermission } = usePermissions()
  const deletable: boolean = hasPermission(Permission.ECS_DEVICES_DELETE)

  const { id: userId } = useParams()

  const query = `userId=${userId},state=[pendingMigration|registered]`
  const { data: devices, loading, error, refetch } = useStatefulAsyncQuery(UsersApi.queryDevices, {
    variables: { query },
  })

  const { onDeviceDeactivation, deleteInProgress } = useDeviceDeactivation(refetch)
  const { isEnabled } = useFeatures()
  const isUESChronosEnabled = isEnabled(FeatureName.UESCronosNavigation)
  const navigate = useNavigate()

  useEffect(() => {
    if (error) {
      enqueueMessage(t('users.details.devices.error.fetch'), 'error')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  const getAgentDisplayName = (endpointData, t) => {
    switch (endpointData.appBundleId) {
      case 'com.blackberry.big':
      case 'com.blackberry.big1':
      case 'com.blackberry.big2':
      case 'com.blackberry.big3':
      case 'com.blackberry.protect':
        return t('users.details.devices.agentBundleId.' + endpointData.appBundleId.replace(/\./g, '_'))
    }
    return endpointData.appBundleId
  }
  const getDeviceOSVersion = deviceOsVersion => {
    return deviceOsVersion ? deviceOsVersion : ''
  }
  const isMobilePlatform = deviceInfo => {
    return deviceInfo?.platform?.toLowerCase() === 'ios' || deviceInfo?.platform?.toLowerCase() === 'android'
  }

  return (
    <>
      <CardHeader title={<Typography variant="h2">{t('users.details.devices.title')}</Typography>} />
      {loading || deleteInProgress ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <CardContent>
          <Grid container spacing={3}>
            {devices?.elements.map((x, index) => (
              <Grid item xs={12} md={6} key={x.guid}>
                <Card
                  variant="outlined"
                  style={{ width: '100%', minHeight: '100%' }}
                  role="region"
                  aria-label={t('users.details.devices.label', { deviceName: x.deviceInfo?.deviceModelName })}
                >
                  <CardHeader
                    action={deletable && <DeviceMoreOptions endpointIds={x.guid} onDeviceDeactivation={onDeviceDeactivation} />}
                  />
                  <CardContent>
                    <Box>
                      <Box className={classes.cardIconBox}>
                        {isMobilePlatform(x.deviceInfo) ? (
                          <DeviceMobile className={classes.cardIcon} />
                        ) : (
                          <DeviceDesktop className={classes.cardIcon} />
                        )}
                      </Box>
                      <Box className={classes.cardText}>
                        <Box mr={1}>
                          {isUESChronosEnabled && isMobilePlatform(x.deviceInfo) ? (
                            <Link
                              onClick={() => {
                                navigate(`/mobile-devices/${x.guid}`)
                              }}
                              role="link"
                              aria-label={`deviceDetails`}
                            >
                              <Typography variant="subtitle1">{x.deviceInfo?.deviceModelName}</Typography>
                            </Link>
                          ) : (
                            <Typography variant="subtitle1">{x.deviceInfo?.deviceModelName}</Typography>
                          )}
                        </Box>
                      </Box>
                      <Box className={classes.cardText}>
                        {getDeviceOSVersion(x.deviceInfo?.osVersion).startsWith(x.deviceInfo?.platform + ' ')
                          ? getDeviceOSVersion(x.deviceInfo?.osVersion)
                          : x.deviceInfo?.platform?.concat(' ', getDeviceOSVersion(x.deviceInfo?.osVersion))}
                      </Box>

                      <div className={classes.spacer} />
                      <Box className={classes.cardText}>
                        {t('users.details.devices.agent', { agent: getAgentDisplayName(x, t) + ' ' + x.appVersion })}
                      </Box>
                      <Box className={classes.cardText}>
                        {t('users.details.devices.enrollmentDateTime', {
                          enrollmentDateTime: i18n.format(x.created, I18nFormats.DateTime),
                        })}
                      </Box>

                      {/* <Box display="flex" justifyContent="center">
                            Alerts
                          </Box> */}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      )}
    </>
  )
}

const DevicesContainer = () => {
  return (
    <ContentAreaPanel fullWidth ContentWrapper={SecuredContentBoundary}>
      <Devices />
    </ContentAreaPanel>
  )
}

export default DevicesContainer
