//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

/* eslint-disable sonarjs/no-duplicate-string */

import { isEmpty, isNil } from 'lodash-es'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Icon, Link, Typography } from '@material-ui/core'

import { BarChart } from '@ues-behaviour/dashboard'
import type { ReportingServiceTunnelEvent } from '@ues-data/gateway'
import type { RiskLevel } from '@ues-data/shared'
import { FeatureName, useFeatures } from '@ues-data/shared'
import { Components, Config, Hooks, Utils } from '@ues-gateway/shared'
import { StatusMedium } from '@ues/assets'
import { Drawer, RiskChips } from '@ues/behaviours'

import { EventsContext } from '../../../context'
import { ACCESS_REQUEST_TYPE_KEYS, ACTION_LOCALIZATION_KEYS, ALERT_TYPE_LOCALIZATION_KEYS } from '../../constants'
import { Accordion } from '../accordion/accordion'
import type { AccordionProps } from '../accordion/types'
import { useStyles } from './styles'

const { LoadingProgress } = Components
const { GATEWAY_TRANSLATIONS_KEY } = Config
const { useBytesFormatterResolver } = Hooks
const {
  checkIsAclEvent,
  checkIsAnomaly,
  checkIsDNS,
  computeDuration,
  resolveTunnelEventTransfer,
  encodeId,
  formatTimestamp,
  hasNetworkAlert,
  numNetworkAlert,
  validateTrafficInProgressStatus,
  checkIsHiddenAlertType,
} = Utils

export interface NetworkTrafficListDrawerProps {
  networkEvent: ReportingServiceTunnelEvent
  isOpen: boolean
  toggleDrawer: () => void
  onClickAway: (event: any) => void
}

export const NetworkTrafficListDrawer: React.FC<NetworkTrafficListDrawerProps> = ({
  networkEvent,
  isOpen,
  toggleDrawer,
  onClickAway,
}) => {
  const classNames = useStyles()
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const features = useFeatures()

  const aclEnabled = features.isEnabled(FeatureName.UESBigAclEnabled)

  const {
    categories: { categoryIdsMap, loading },
  } = useContext(EventsContext)

  const inProgress = validateTrafficInProgressStatus(networkEvent)
  const isDNS = checkIsDNS(networkEvent)

  const bytesFormatterResolver = useBytesFormatterResolver()

  const accordionsDefinitions: AccordionProps[] = [
    {
      title: t('events.eventOverview'),
      rows: [
        {
          label: t('events.eventId'),
          value: networkEvent?.flowId,
        },
        {
          label: t('common.source'),
          value: networkEvent?.sourceIp,
        },
        {
          label: t('events.sourcePort'),
          value: networkEvent?.sourcePort,
        },
        {
          label: t('common.dnsQuery'),
          hidden: !isDNS,
          value: networkEvent?.rrName,
        },
        {
          label: t('common.dnsType'),
          hidden: !isDNS,
          value: networkEvent?.rrType,
        },
        {
          label: t('common.destination'),
          value: (
            <>
              {networkEvent?.appName && <Typography>{networkEvent?.appName}</Typography>}
              {!isDNS && networkEvent?.destinationFqdn && <Typography>{networkEvent?.destinationFqdn}</Typography>}
              <Typography>{networkEvent?.destinationIp}</Typography>
            </>
          ),
        },
        {
          label: t('events.destinationPort'),
          hidden: isDNS,
          value: networkEvent?.destinationPort,
        },
        {
          label: t('events.protocol'),
          value: networkEvent?.proto,
        },
        {
          label: t('events.appProtocol'),
          value: networkEvent?.appProto?.toUpperCase(),
        },
        {
          label: t('events.eventAlerts.category'),
          hidden: !aclEnabled || !networkEvent?.category,
          value: categoryIdsMap?.[networkEvent?.category],
        },
        {
          label: t('events.eventAlerts.subCategory'),
          hidden: !aclEnabled || !networkEvent?.subCategory,
          value: categoryIdsMap?.[networkEvent?.subCategory],
        },
        {
          label: t('common.startTime'),
          value: formatTimestamp(networkEvent?.tsStart),
        },
        {
          label: t('common.endTime'),
          value: inProgress ? <Typography>{t('common.inProgress')}</Typography> : formatTimestamp(networkEvent?.tsTerm),
        },
        {
          label: t('events.duration'),
          value: <Typography>{computeDuration(networkEvent, t)}</Typography>,
        },
        {
          label: t('common.transferred'),
          hidden: isDNS,
          value: <Typography>{resolveTunnelEventTransfer(networkEvent, t, bytesFormatterResolver)}</Typography>,
        },
        {
          label: 'Packet flow',
          hidden: isDNS,
          value: (
            <>
              {inProgress && <Typography>{t('common.inProgress')}</Typography>}
              {!inProgress && <Typography>{`${t('events.toServer')} ${networkEvent?.pkts_toserver}`}</Typography>}
              {!inProgress && <Typography>{`${t('events.toClient')} ${networkEvent?.pkts_toserver}`}</Typography>}
            </>
          ),
        },
        {
          label: t('common.user'),
          value: (
            <Link
              variant="inherit"
              color="primary"
              href={`/uc/platform#/users/${encodeId(networkEvent?.ecoId)}/events/gateway-events`}
            >
              {networkEvent?.displayName}
            </Link>
          ),
        },
        {
          label: t('common.platform'),
          value: networkEvent?.deviceInfo?.platform,
        },
        {
          label: t('common.model'),
          value: networkEvent?.deviceInfo?.deviceModelName,
        },
        {
          label: t('events.networkRisk'),
          value: checkIsAnomaly(networkEvent) ? (
            <Typography>{t('events.networkRiskValue')}</Typography>
          ) : (
            <Typography>{t('common.none')}</Typography>
          ),
        },
        {
          label: t('common.action'),
          value: <Typography>{networkEvent?.action && t(ACTION_LOCALIZATION_KEYS[networkEvent?.action])}</Typography>,
        },
      ],
    },
    {
      title: t('common.action'),
      alternateTitle: networkEvent?.action && t(ACTION_LOCALIZATION_KEYS[networkEvent?.action]),
      rows: !checkIsAclEvent(networkEvent)
        ? [
            {
              label: t('events.policyName'),
              value: networkEvent?.policyName,
            },
          ]
        : networkEvent?.rules?.map(item => {
            return {
              label: t('events.rules.type'),
              value: t(ACCESS_REQUEST_TYPE_KEYS[item.requestType]),
              secondaryRows: [
                {
                  label: t('common.labelTime'),
                  value: formatTimestamp(item?.timeStamp),
                },
                {
                  label: t('events.rules.name'),
                  value: item?.ruleName,
                },
                {
                  label: t('common.action'),
                  value: t(ACTION_LOCALIZATION_KEYS[item?.action]),
                },
              ],
            }
          }),
    },
    {
      title: t('events.eventAlerts.title'),
      hidden: !hasNetworkAlert(networkEvent),
      alternateTitle: (
        <Box display="flex" alignItems="center">
          <Icon className={classNames.alertIcon} component={StatusMedium} />
          {numNetworkAlert(networkEvent)}
        </Box>
      ),
      rows: networkEvent?.alerts?.map(item => {
        return {
          label: t('events.eventAlerts.type'),
          value: (
            <Box display="flex" alignItems="center">
              <Icon className={classNames.alertIcon} component={StatusMedium} />
              <Typography>{item?.alertType && t(ALERT_TYPE_LOCALIZATION_KEYS[item.alertType])}</Typography>
            </Box>
          ),
          hidden: checkIsHiddenAlertType(item),
          secondaryRows: [
            {
              label: t('common.labelTime'),
              hidden: isNil(item?.timeStamp),
              value: formatTimestamp(item?.timeStamp),
            },
            {
              label: t('events.eventAlerts.category'),
              hidden: isNil(item?.category),
              value: item?.category,
            },
            {
              label: t('events.eventAlerts.signature'),
              hidden: isNil(item?.signature),
              value: item?.signature,
            },
            {
              label: t('events.eventAlerts.mitreTactic'),
              hidden: isEmpty(item?.mitre?.tacticId) && isEmpty(item?.mitre?.tacticName),
              value: (
                <>
                  <Typography>{item?.mitre?.tacticId}</Typography>
                  <Typography>{item?.mitre?.tacticName}</Typography>
                </>
              ),
            },
            {
              label: t('events.eventAlerts.mitreTechnique'),
              hidden: isEmpty(item?.mitre?.techniqueId) && isEmpty(item?.mitre?.techniqueName),
              value: (
                <>
                  <Typography>{item?.mitre?.techniqueId}</Typography>
                  <Typography>{item?.mitre?.techniqueName}</Typography>
                </>
              ),
            },
            {
              label: t('events.eventAlerts.nameServer'),
              hidden: isNil(item.dnsTunneling),
              value: item.dnsTunneling?.nameServer,
            },
            {
              label: t('events.eventAlerts.score'),
              hidden: isNil(item.dnsTunneling),
              value: item.dnsTunneling && <RiskChips value={[item.dnsTunneling?.score?.toUpperCase() as RiskLevel]} />,
            },
          ],
        }
      }),
    },
    {
      title: t('common.transferred'),
      hidden: inProgress || isDNS,
      alternateTitle: resolveTunnelEventTransfer(networkEvent, t, bytesFormatterResolver),
      element: (
        <BarChart
          data={[
            { label: t('dashboard.uploaded'), count: networkEvent?.bytes_toclient },
            { label: t('dashboard.downloaded'), count: networkEvent?.bytes_toserver },
          ]}
          formatter={value => bytesFormatterResolver(value)}
        />
      ),
    },
    {
      title: t('events.tls.title'),
      hidden: ![
        networkEvent?.version,
        networkEvent?.notbefore,
        networkEvent?.notafter,
        networkEvent?.sni,
        networkEvent?.issuerdn,
        networkEvent?.subject,
        networkEvent?.client_alpn,
        networkEvent?.server_alpn,
      ].some(Boolean),
      rows: [
        {
          label: t('events.tls.version'),
          value: networkEvent?.version,
        },
        {
          label: t('events.tls.ALPNClient'),
          value: networkEvent?.client_alpn?.map(item => <Typography>{item}</Typography>),
        },
        {
          label: t('events.tls.ALPNServer'),
          value: networkEvent?.server_alpn?.map(item => <Typography>{item}</Typography>),
        },
        {
          label: t('events.tls.SNI'),
          value: networkEvent?.sni,
        },
        {
          label: t('events.tls.issuer'),
          value: networkEvent?.issuerdn,
        },
        {
          label: t('events.tls.subject'),
          value: networkEvent?.subject,
        },
        {
          label: t('events.tls.validBefore'),
          value: networkEvent?.notbefore,
        },
        {
          label: t('events.tls.validAfter'),
          value: networkEvent?.notafter,
        },
      ],
    },
  ]

  return (
    <Drawer
      title={t('events.eventDetails')}
      size="medium"
      background="grey"
      open={isOpen}
      onClickAway={onClickAway}
      toggleDrawer={toggleDrawer}
    >
      {loading ? (
        <LoadingProgress alignSelf="center" />
      ) : (
        accordionsDefinitions.map((item, index) => <Accordion key={index} {...item} />)
      )}
    </Drawer>
  )
}
