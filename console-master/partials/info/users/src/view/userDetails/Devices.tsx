/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router'

import { Box, Card, CardContent, CardHeader, CircularProgress, Grid, Link as MuiLink, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { UsersData } from '@ues-data/dlp'
import { Permission, useFeatures, usePermissions, useStatefulReduxQuery } from '@ues-data/shared'
import { DeviceDesktop, DeviceMobile, I18nFormats } from '@ues/assets'
import { ContentAreaPanel, SecuredContentBoundary, useSecuredContent, useSnackbar } from '@ues/behaviours'

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
    paddingTop: theme.spacing(5),
  },
}))

const Devices = () => {
  useSecuredContent(Permission.BIP_DEVICE_READ)
  const classes = useStyles()
  const { enqueueMessage } = useSnackbar()
  const { t, i18n } = useTranslation(['platform/common', 'dlp/common'])

  const { id: userId } = useParams()

  const { data: devicesData, loading, error, refetch } = useStatefulReduxQuery(UsersData.queryDevices, {
    variables: { userId },
    skip: !userId,
  })

  useEffect(() => {
    if (error) {
      enqueueMessage(t('users.details.devices.error.fetch'), 'error')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  const isMobileDevice = device => {
    return device.toLowerCase() === 'mobile'
  }

  return (
    <>
      <CardHeader title={<Typography variant="h2">{t('users.details.devices.title')}</Typography>} />
      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <CardContent>
          <Grid container spacing={3}>
            {devicesData?.map(device => {
              const { deviceId } = device
              const {
                deviceName = '',
                deviceType = '',
                deviceModel = '',
                osVersion = '',
                osName = '',
                platform = '',
                dlpVersion = '',
              } = device?.devicesInfo

              return (
                <Grid item xs={12} md={6} key={deviceId}>
                  <Card
                    variant="outlined"
                    style={{ width: '100%', minHeight: '100%' }}
                    role="region"
                    aria-label={t('users.details.devices.label', { deviceName: deviceName })}
                  >
                    <CardContent>
                      <Box>
                        <Box className={classes.cardIconBox}>
                          {isMobileDevice(deviceType) ? (
                            <DeviceMobile className={classes.cardIcon} />
                          ) : (
                            <DeviceDesktop className={classes.cardIcon} />
                          )}
                        </Box>
                        <Box className={classes.cardText}>
                          <Box mr={1}>
                            {isMobileDevice(deviceType) ? (
                              <MuiLink
                                href={`/uc/platform#/mobile-devices/${deviceId}`}
                                onClick={(event: React.SyntheticEvent) => event.stopPropagation()}
                              >
                                <Typography variant="subtitle1">{deviceModel}</Typography>
                              </MuiLink>
                            ) : (
                              <Typography variant="subtitle1">{deviceName}</Typography>
                            )}
                          </Box>
                        </Box>
                        <Box className={classes.cardText}>
                          {t('dlp/common:users.devices.osVersion', {
                            name: isMobileDevice(deviceType) ? platform : osName,
                            version: dlpVersion,
                          })}
                        </Box>
                        <div className={classes.spacer} />
                        <Box className={classes.cardText}>
                          {t('dlp/common:users.devices.agentVersion', { version: dlpVersion })}
                        </Box>
                        <Box className={classes.cardText}>
                          {t('users.details.devices.enrollmentDateTime', {
                            enrollmentDateTime: i18n.format(device.activationTime, I18nFormats.DateTime),
                          })}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
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
