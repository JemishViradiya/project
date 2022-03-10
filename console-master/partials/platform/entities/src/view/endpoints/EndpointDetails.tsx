/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import * as httpStatus from 'http-status-codes'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import {
  Box,
  Card,
  CircularProgress,
  FormControl,
  IconButton,
  Link,
  makeStyles,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core'

import { DeviceRiskAssessment } from '@ues-bis/device-risk'
import { queryEndpointById, queryUserById } from '@ues-data/platform'
import { Permission, useErrorCallback, usePermissions, useStatefulAsyncQuery } from '@ues-data/shared'
import { DeviceEmmConnection } from '@ues-emm/device-emm-connection'
import { useDeviceDeactivation } from '@ues-platform/policies'
import {
  ArrowChevronDown,
  ArrowChevronUp,
  BrandAndroid,
  BrandApple,
  BrandWindows,
  DeviceDesktop,
  DeviceMobile,
  HelpLinks,
  I18nFormats,
} from '@ues/assets'
import { PageTitlePanel, Tabs, usePageTitle, useRoutedTabsProps, useSecuredContent, useSnackbar } from '@ues/behaviours'

import { Routes } from './routes'
import { TABS } from './types'
import { getAgentDisplayName } from './utils'

const endpointActions = {
  DELETE_ENDPOINT: 'endpoint.details.actions.deleteEndpoint',
}

const useStyles = makeStyles(theme => ({
  actions: {
    marginBottom: 0,
    marginRight: theme.spacing(2),
  },
  cardText: {
    display: 'flex',
    justifyContent: 'left',
  },
  deviceInfo: {
    width: 260,
    borderBottom: 'none',
    padding: `${theme.spacing(4)}px ${theme.spacing(6)}px`,
  },
  innerContainer: {
    height: '100%',
    margin: theme.spacing(6),
  },
  label: {
    wordBreak: 'break-word',
    textAlign: 'center',
  },
  fullHeight: {
    height: '100%',
  },
  outerContainer: {
    display: 'flex',
    flexFlow: 'column nowrap',
    width: '100%',
  },
  round: {
    backgroundColor: theme.palette.grey[200],
    height: 128,
    width: 128,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: {
    paddingTop: theme.spacing(5), // 20px
  },
  deviceTypeDivWrapper: {
    fill: theme.palette.grey[600],
    color: theme.palette.grey[600],
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  deviceMobileIcon: {
    position: 'absolute',
    fontSize: 64,
  },
  deviceDesktopIcon: {
    position: 'absolute',
    fontSize: 64,
  },
  brandIcon: {
    position: 'absolute',
    fontSize: 20,
  },
  brandIconForDesktop: {
    position: 'absolute',
    fontSize: 20,
    marginBottom: '10px',
  },
}))

const printDeviceDateTime = (i18n, datetime) => {
  return i18n.format(datetime, I18nFormats.DateTime)
}

const getDeviceOSVersion = deviceOsVersion => {
  return deviceOsVersion ? deviceOsVersion : ''
}

const renderEndpointInfo = (endpointData, useTransObj, classes) => {
  const { t, i18n } = useTransObj
  return (
    <>
      <Box className={classes.cardText}>
        <Typography variant="caption">{t('endpoint.details.agent')}</Typography>
      </Box>
      <Box className={classes.cardText}>
        <Typography variant="body2">
          {getAgentDisplayName(endpointData, t)} {endpointData.appVersion}
        </Typography>
      </Box>
      {endpointData.deviceInfo?.platform?.toLowerCase() === 'android' ? (
        <>
          <div className={classes.spacer}></div>
          <Box className={classes.cardText}>
            <Typography variant="caption">{t('endpoint.details.securityPatch')}</Typography>
          </Box>
          <Box className={classes.cardText}>
            <Typography variant="body2">{endpointData.deviceInfo?.securityPatch}</Typography>
          </Box>
        </>
      ) : (
        ''
      )}
      <div className={classes.spacer}></div>
      <Box className={classes.cardText}>
        <Typography variant="caption">{t('endpoint.details.enrollment')}</Typography>
      </Box>
      <Box className={classes.cardText}>
        <Typography variant="body2">{printDeviceDateTime(i18n, endpointData.created)}</Typography>
      </Box>
      {endpointData.deviceInfo?.deviceId ? (
        <React.Suspense fallback={null}>
          <div className={classes.spacer}></div>
          <DeviceEmmConnection deviceId={endpointData.deviceInfo.deviceId} />
        </React.Suspense>
      ) : (
        ''
      )}
    </>
  )
}

const UserInfo = ({ userId }) => {
  const classes = useStyles()
  const { hasPermission } = usePermissions()
  const hasUserReadPermission = hasPermission(Permission.ECS_USERS_READ)

  const { label } = classes
  // eslint-disable-next-line sonarjs/no-duplicate-string
  const { t } = useTranslation(['platform/endpoints'])
  const { enqueueMessage } = useSnackbar()
  const navigate = useNavigate()

  const { loading: userLoading, data: userData, error: userError } = useStatefulAsyncQuery(queryUserById, {
    variables: {
      id: userId,
    },
  })
  useErrorCallback(userError, () => enqueueMessage(t('endpoint.details.error.fetchUser'), 'error'))

  return userLoading ? (
    <Box display="flex" justifyContent="center"></Box>
  ) : (
    <>
      <div className={classes.spacer}></div>
      <Box display="flex" justifyContent="center" className={label}>
        (
        {hasUserReadPermission ? (
          <Link
            onClick={() => {
              navigate(`/users/${userData.id}`)
            }}
            role="link"
            aria-label={`userDetails`}
          >
            {userData.displayName}
          </Link>
        ) : (
          // eslint-disable-next-line react/jsx-no-useless-fragment
          <>{userData.displayName}</>
        )}
        )
      </Box>
    </>
  )
}

const DeviceOsEndpointInfo = ({ devicePlatform, riskLevel }) => {
  const { deviceMobileIcon, deviceDesktopIcon, brandIcon, brandIconForDesktop, round, deviceTypeDivWrapper } = useStyles()

  switch (devicePlatform) {
    case 'Android':
      return (
        <div className={round}>
          <div className={deviceTypeDivWrapper}>
            <DeviceMobile className={deviceMobileIcon} />
            <BrandAndroid className={brandIcon} />
          </div>
        </div>
      )
    case 'iOS':
      return (
        <div className={round}>
          <div className={deviceTypeDivWrapper}>
            <DeviceMobile className={deviceMobileIcon} />
            <BrandApple className={brandIcon} />
          </div>
        </div>
      )
    case 'Windows':
      return (
        <div className={round}>
          <div className={deviceTypeDivWrapper}>
            <DeviceDesktop className={deviceDesktopIcon}></DeviceDesktop>
            <BrandWindows className={brandIconForDesktop} />
          </div>
        </div>
      )
    case 'macOS':
      return (
        <div className={round}>
          <div className={deviceTypeDivWrapper}>
            <DeviceDesktop className={deviceDesktopIcon}></DeviceDesktop>
            <BrandApple className={brandIconForDesktop} />
          </div>
        </div>
      )
    default:
      return (
        <div className={round}>
          <DeviceDesktop className={deviceDesktopIcon} />
        </div>
      )
  }
}

const UserEndpointInfo = ({ endpointData }) => {
  const useTransObj = useTranslation(['platform/endpoints'])
  const { t } = useTransObj
  const classes = useStyles()
  const { deviceInfo, label } = classes
  const [showMore, setShowMore] = useState(false)

  return (
    <Card variant="outlined" className={deviceInfo} role="heading" aria-label={t('endpoint.details.title')}>
      <Box pb={6} display="flex" justifyContent="center">
        <DeviceOsEndpointInfo devicePlatform={endpointData.deviceInfo?.platform} riskLevel={'NONE'} />
      </Box>
      <Box display="flex" justifyContent="center" className={label}>
        <Typography variant="subtitle1">{endpointData.deviceInfo?.deviceModelName}</Typography>
      </Box>
      <Box display="flex" justifyContent="center" className={label}>
        {getDeviceOSVersion(endpointData.deviceInfo?.osVersion).startsWith(endpointData.deviceInfo?.platform + ' ')
          ? getDeviceOSVersion(endpointData.deviceInfo?.osVersion)
          : endpointData.deviceInfo?.platform?.concat(' ', getDeviceOSVersion(endpointData.deviceInfo?.osVersion))}
      </Box>
      {endpointData.deviceInfo?.deviceId ? (
        <Box display="flex" justifyContent="center">
          <React.Suspense fallback={null}>
            <DeviceRiskAssessment userId={endpointData.userId} deviceId={endpointData.deviceInfo.deviceId} />
          </React.Suspense>
        </Box>
      ) : (
        ''
      )}
      <UserInfo userId={endpointData.userId} />
      <Box display="flex" justifyContent="center">
        <IconButton
          size="small"
          onClick={() => setShowMore(!showMore)}
          aria-label={showMore ? t('endpoint.details.button.less') : t('endpoint.details.button.more')}
        >
          {showMore ? <ArrowChevronUp /> : <ArrowChevronDown />}
        </IconButton>
      </Box>
      {showMore && <>{renderEndpointInfo(endpointData, useTransObj, classes)}</>}
    </Card>
  )
}

const EndpointDetails = () => {
  useSecuredContent(Permission.ECS_DEVICES_READ)
  const { t } = useTranslation(['platform/endpoints'])
  usePageTitle(t('endpoint.page.title'))

  const { enqueueMessage } = useSnackbar()
  const params = useParams()
  const navigate = useNavigate()
  const classNames = useStyles()
  const { search } = useLocation()

  const { hasPermission } = usePermissions()
  const deletable: boolean = hasPermission(Permission.ECS_DEVICES_DELETE)

  const { loading, data: endpointData, error } = useStatefulAsyncQuery(queryEndpointById, {
    variables: {
      id: params.endpointId,
      fetchPolicy: 'cache-and-network',
    },
  })
  useErrorCallback(error, err => {
    if (err.status === httpStatus.NOT_FOUND) {
      enqueueMessage(t('endpoint.details.error.notFound'), 'error')
    } else {
      enqueueMessage(t('endpoint.details.error.fetch'), 'error')
    }
  })

  const endpointActionsInput = Object.keys(endpointActions).map(x => ({
    id: x,
    label: t(endpointActions[x]),
  }))

  const postDeviceDeactivationAction = () => {
    navigate(-1)
  }

  const { onDeviceDeactivation, deleteInProgress } = useDeviceDeactivation(postDeviceDeactivationAction)

  const handleSelectAction = event => {
    // eslint-disable-next-line sonarjs/no-small-switch
    switch (event.target.value) {
      case 'DELETE_ENDPOINT':
        onDeviceDeactivation(endpointData.guid)
        break
      default:
        break
    }
  }

  const getActions = () => {
    return (
      <FormControl variant="outlined" size="small" className={classNames.actions}>
        <Select
          id="endpointActions"
          displayEmpty
          renderValue={() => t('endpoint.details.actions.title')}
          value={''}
          onChange={handleSelectAction}
        >
          {endpointActionsInput.map(item => (
            <MenuItem key={item.id} value={item.id}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    )
  }

  const tabsProps = useRoutedTabsProps({ tabs: Routes, navigateProps: { replace: true } })
  const helpLinkFromRoute = Routes.find(route => route.path === tabsProps.value)?.helpLink
  const helpLink = helpLinkFromRoute ? helpLinkFromRoute : HelpLinks.AssetsMobileDevices
  const [tabValue, setTabValue] = useState(TABS.NOT_SET)

  // Set tab to TABS.ALERTS but only after data is loaded and no tab selected.
  useEffect(() => {
    if (!loading && endpointData && tabValue === TABS.NOT_SET) {
      onTabChange(null, TABS.ALERTS)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpointData, loading])

  const onTabChange = useCallback(
    (event: React.ChangeEvent | React.FormEvent, value?) => {
      switch (value) {
        case TABS.RESPONSE_ACTIONS: {
          const responseActionsTab = Routes.find(entry => entry.path === TABS.RESPONSE_ACTIONS)
          const userId = endpointData.userId
          const deviceId = encodeURIComponent(btoa(endpointData.deviceInfo?.deviceId))
          const toPath = responseActionsTab.path + `?userId=${userId}&deviceId=${deviceId}`
          tabsProps.onChange(event, toPath)
          setTabValue(value)
          break
        }
        case TABS.ALERTS: {
          const alertsActionsTab = Routes.find(entry => entry.path === TABS.ALERTS)
          const endpointId = encodeURIComponent(btoa(endpointData.guid))
          const toPath =
            alertsActionsTab.path +
            `?endpointId=${endpointId}` +
            (search.length > 0 ? '&' + new URLSearchParams(search).toString() : '')
          tabsProps.onChange(event, toPath)
          setTabValue(value)
          break
        }
        case TABS.EVENTS: {
          const eventsActionsTab = Routes.find(entry => entry.path === TABS.EVENTS)
          const endpointId = encodeURIComponent(btoa(endpointData.guid))
          const toPath = eventsActionsTab.path + `?endpointId=${endpointId}`
          tabsProps.onChange(event, toPath)
          setTabValue(value)
          break
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tabsProps, endpointData],
  )

  return (
    <Box className={classNames.outerContainer}>
      <Box display="flex" flexDirection="column" flex="1">
        <PageTitlePanel
          goBack={() => {
            navigate(-1)
          }}
          // User Devices > Device Model Name
          title={loading ? t('endpoints.grid.all') : [t('endpoints.grid.all'), endpointData?.deviceInfo?.deviceModelName]}
          actions={deletable && getActions()}
          helpId={helpLink}
        />
        {loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          <Box className={classNames.innerContainer}>
            <Tabs
              tabsTitle={<UserEndpointInfo endpointData={endpointData} />}
              fullScreen
              orientation="vertical"
              {...tabsProps}
              onChange={onTabChange}
              value={tabValue}
            />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default EndpointDetails
