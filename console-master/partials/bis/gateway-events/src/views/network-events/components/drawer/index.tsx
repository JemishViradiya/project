import type { SyntheticEvent } from 'react'
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Box, ClickAwayListener, Drawer, IconButton, Link, Typography } from '@material-ui/core'

import { RiskChip } from '@ues-bis/shared'
import { GatewayAlertDetailsQuery } from '@ues-data/bis'
import { ActionType, ChallengeState, RiskLevelTypes } from '@ues-data/bis/model'
import { isMobile } from '@ues-data/platform'
import { FeatureName, Permission, useFeatures, usePermissions, useStatefulApolloQuery } from '@ues-data/shared'
import { BasicClose, I18nFormats } from '@ues/assets'
import { Loading, useSecuredContent, useSnackbar } from '@ues/behaviours'

import { EXPECTED_CHALLENGE_STATES_SET, TRANSLATION_NAMESPACES } from '../../config'
import { EndpointsContext } from '../../providers/endpoints-provider'
import { ColumnKey } from '../../types'
import { Accordion } from '../accordion/accordion'
import type { AccordionProps } from '../types/types'
import { ArrState } from './arr-state'
import { useStyles } from './styles'

export const useDrawerProps = () => {
  const excludedEventFromDrawerToggling = useRef(null)
  const [isOpen, setState] = useState(false)
  const excludeEventFromDrawerToggling = useCallback((event: SyntheticEvent) => {
    excludedEventFromDrawerToggling.current = event
  }, [])
  const toggleDrawer = useCallback(
    (event?: SyntheticEvent) => {
      if (excludedEventFromDrawerToggling.current === event) {
        return
      }
      setState(!isOpen)
    },
    [isOpen],
  )
  return { isOpen, toggleDrawer, excludeEventFromDrawerToggling }
}

export interface NetworkAnomalyDrawerProps {
  eventId: string
  isOpen: boolean
  toggleDrawer: (event: SyntheticEvent) => void
  hiddenColumns: ColumnKey[]
}

const formatDatetime = (datetime: number | undefined, i18n: ReturnType<typeof useTranslation>['i18n']) =>
  datetime ? i18n.format(datetime, I18nFormats.DateTimeShort) : ''

const encodeID = (id: string) => encodeURIComponent(btoa(id))

export const NetworkAnomalyDrawer: React.FC<NetworkAnomalyDrawerProps> = ({ eventId, isOpen, toggleDrawer, hiddenColumns }) => {
  useSecuredContent(Permission.BIS_EVENTS_READ)

  const { t, i18n } = useTranslation(TRANSLATION_NAMESPACES)
  const classNames = useStyles()
  const navigate = useNavigate()
  const { enqueueMessage } = useSnackbar()
  const { isEnabled } = useFeatures()
  const arrEnabled = isEnabled(FeatureName.ARR)
  const { hasPermission } = usePermissions()
  const singleNxApp = isEnabled(FeatureName.SingleNXApp)
  const gatewayAlertsTransition = isEnabled(FeatureName.UESNavigationGatewayAlertsTransition)

  const { endpoints } = useContext(EndpointsContext)

  const { loading, error, data: queryResult } = useStatefulApolloQuery(GatewayAlertDetailsQuery, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: { id: eventId, riskTypes: [] },
    skip: !eventId,
  })

  const intermediateData = useMemo(
    () => ({
      actions: queryResult?.eventDetails?.sisActions?.actions,
      datapointId: queryResult?.eventDetails?.assessment?.datapoint?.datapointId,
      datetime: formatDatetime(queryResult?.eventDetails?.assessment?.datetime, i18n),
      deviceDetails: queryResult?.eventDetails?.assessment?.datapoint?.source,
      eEcoId: queryResult?.eventDetails?.assessment?.eEcoId,
      flowId: queryResult?.eventDetails?.assessment?.mappings?.networkAnomalyDetection?.flowId,
      policyName: queryResult?.eventDetails?.sisActions?.policyName,
      riskLevel: queryResult?.eventDetails?.assessment?.identityAndBehavioralRisk?.level,
      totalEvents: queryResult?.eventDetails?.assessment?.mappings?.networkAnomalyDetection?.totalEvents,
      userInfo: queryResult?.eventDetails?.assessment?.userInfo,
      fixup: queryResult?.eventDetails?.fixup,
    }),
    [queryResult, i18n],
  )

  const onClickAway = useCallback(
    event => {
      if (isOpen) {
        toggleDrawer(event)
      }
    },
    [isOpen, toggleDrawer],
  )

  useEffect(() => {
    if (error) {
      console.error(error)
      enqueueMessage(error.message, 'error')
    }
  }, [error, enqueueMessage])

  const eventDetailsEntry = useMemo(
    () =>
      hasPermission(Permission.BIG_REPORTING_READ)
        ? {
            label: t('bis/ues:gatewayAlertDetails.labels.eventDetails'),
            value: (
              <Typography variant="body2">
                <Link
                  onClick={e => {
                    if (intermediateData.datapointId) {
                      if (window.location.pathname.includes('uc/gateway') || singleNxApp) {
                        navigate(`/event-details/${intermediateData.datapointId}`, {
                          state: { name: intermediateData.userInfo?.displayName },
                        })
                      } else {
                        window.location.assign(
                          `/uc/gateway#/event-details/${intermediateData.datapointId}?name=${encodeURIComponent(
                            intermediateData.userInfo?.displayName,
                          )}`,
                        )
                      }
                    }
                  }}
                >
                  {t('bis/ues:gatewayAlertDetails.values.viewDetails')}
                </Link>
              </Typography>
            ),
          }
        : undefined,
    [hasPermission, intermediateData.datapointId, intermediateData.userInfo?.displayName, navigate, singleNxApp, t],
  )

  const userDetailsEntry = useMemo(
    () => ({
      label: t('bis/ues:gatewayAlertDetails.labels.user'),
      value: (
        <Typography variant="body2">
          {hasPermission(Permission.ECS_USERS_READ) ? (
            <Link
              aria-label={t('bis/ues:gatewayAlertDetails.labels.userHyperlink')}
              onClick={e => {
                if (intermediateData.eEcoId) {
                  e.stopPropagation()
                  window.location.assign(`/uc/platform#/users/${encodeID(intermediateData.eEcoId)}/alerts/mtd-alerts`)
                }
              }}
            >
              {intermediateData.userInfo?.displayName}
            </Link>
          ) : (
            intermediateData.userInfo?.displayName
          )}
        </Typography>
      ),
    }),
    [hasPermission, intermediateData, t],
  )

  const deviceDetailsEntry = useMemo(() => {
    const displayName = intermediateData?.deviceDetails?.deviceModel ?? ''
    const endpointId = intermediateData?.deviceDetails?.containerId
    const entitlementId = intermediateData?.deviceDetails?.entitlementId
    const osPlatform = intermediateData?.deviceDetails?.os ?? ''
    const endpoint = endpoints?.[endpointId ?? '']

    return {
      label: t('bis/ues:gatewayAlertDetails.labels.device'),
      value: (
        <Typography variant="body2">
          {endpoint && endpointId && hasPermission(Permission.ECS_DEVICES_READ) && isMobile(osPlatform, entitlementId) ? (
            <Link
              aria-label={t('bis/ues:gatewayAlertDetails.labels.deviceHyperlink')}
              onClick={e => {
                e.stopPropagation()
                window.location.assign(`/uc/platform#/mobile-devices/${endpointId}`)
              }}
            >
              {displayName}
            </Link>
          ) : (
            displayName
          )}
        </Typography>
      ),
    }
  }, [hasPermission, intermediateData, endpoints, t])

  const responseActionsEntries = useMemo(
    () => [
      ...(intermediateData.actions
        ?.filter(item => item.type === ActionType.OverrideNetworkAccessControlPolicy)
        .map(item => ({
          label: t('bis/ues:gatewayAlertDetails.labels.assignedPolicy'),
          value: `${item.name}`,
        })) ?? []),
      ...(arrEnabled &&
      EXPECTED_CHALLENGE_STATES_SET.has(intermediateData.fixup) &&
      intermediateData.fixup !== ChallengeState.NotApplicable
        ? [
            {
              label: t('bis/ues:gatewayAlertDetails.labels.automaticResponseReduction'),
              value: (
                <ArrState
                  datapointId={intermediateData.datapointId}
                  state={intermediateData.fixup}
                  currentRiskLevel={intermediateData.riskLevel}
                  displayRiskLevelChange={!hiddenColumns.includes(ColumnKey.Risk)}
                />
              ),
            },
          ]
        : []),
    ],
    [arrEnabled, intermediateData, hiddenColumns, t],
  )

  const riskLevel = useMemo(
    () =>
      intermediateData.riskLevel !== RiskLevelTypes.UNKNOWN
        ? {
            label: t('bis/ues:gatewayAlertDetails.titles.risk'),
            value: <RiskChip riskLevel={intermediateData.riskLevel} t={t} />,
          }
        : undefined,
    [intermediateData.riskLevel, t],
  )

  const responseActions = useMemo(
    () =>
      arrEnabled
        ? {
            title: t('bis/ues:gatewayAlertDetails.titles.identityChallenge'),
            rows: responseActionsEntries,
            noRows: t('bis/ues:gatewayAlertDetails.actions.noActions'),
          }
        : undefined,
    [arrEnabled, responseActionsEntries, t],
  )

  const content = useMemo(() => {
    if (loading) {
      return <Loading />
    }

    if (error) {
      return null
    }

    const accordionsDefinitions: AccordionProps[] = [
      {
        title: t(
          gatewayAlertsTransition
            ? 'bis/ues:gatewayAlertDetails.titles.eventOverview'
            : 'bis/ues:gatewayAlertDetails.titles.alertOverview',
        ),
        rows: [
          {
            label: t('bis/shared:common.description'),
            value: t('bis/ues:gatewayAlertDetails.values.networkEvent'),
          },
          {
            label: t('bis/ues:gatewayAlerts.table.headers.category'),
            value: t('bis/ues:gatewayAlertDetails.values.riskType'),
          },
          {
            label: t('bis/ues:gatewayAlertDetails.labels.detectionTime'),
            value: intermediateData.datetime,
          },
          eventDetailsEntry,
          {
            label: t('bis/ues:gatewayAlertDetails.labels.eventId'),
            value: intermediateData.flowId,
          },
        ],
      },
      {
        title: t('bis/ues:gatewayAlertDetails.titles.affectedAssets'),
        rows: [userDetailsEntry, deviceDetailsEntry],
      },
      responseActions,
    ]
      .filter(el => el !== undefined)
      .map(props => ({
        ...props,
        rows: props?.rows.filter(row => row !== undefined),
      }))

    return (
      <Box>
        <Typography className={classNames.title} variant="h2">
          {t('bis/ues:gatewayAlertDetails.titles.drawerTitle')}
        </Typography>

        {accordionsDefinitions.map((item, index) => (
          <Accordion key={index} {...item} />
        ))}
      </Box>
    )
  }, [
    loading,
    error,
    t,
    gatewayAlertsTransition,
    intermediateData.datetime,
    intermediateData.flowId,
    eventDetailsEntry,
    userDetailsEntry,
    deviceDetailsEntry,
    responseActions,
    classNames.title,
  ])

  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <Drawer role="complementary" classes={{ paper: classNames.paper }} variant="persistent" anchor={'right'} open={isOpen}>
        <IconButton
          className={classNames.closeIcon}
          onClick={toggleDrawer}
          role="button"
          title={t('general/form:commonLabels.close')}
        >
          <BasicClose fontSize="small" />
        </IconButton>

        {content}
      </Drawer>
    </ClickAwayListener>
  )
}
