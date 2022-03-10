import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import { Box } from '@material-ui/core'

import { ReportingServiceField, ReportingServiceFilter, ReportingServiceSortDirection } from '@ues-data/gateway'
import { queryUserById } from '@ues-data/platform'
import { FeatureName, useFeatures, useStatefulAsyncQuery, useUesSession } from '@ues-data/shared'
import { Config } from '@ues-gateway/shared'
import { ContentAreaPanel, SecuredContentBoundary } from '@ues/behaviours'

import useStyles from '../components/styles'
import { EventsColumnDataKey } from '../components/types'
import { EventsContextProvider } from '../context'

const NetworkTrafficList = React.lazy(() => import('../components/network-traffic-list'))

const { EVENTS_QUERY_MAX_RECORDS, GATEWAY_TRANSLATIONS_KEY } = Config

const UserEvents = () => {
  const { id: userId } = useParams()
  const { data } = useStatefulAsyncQuery(queryUserById, { variables: { id: userId }, skip: !userId })
  const { tenantId } = useUesSession()
  const classes = useStyles()
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const { isEnabled } = useFeatures()
  const cronosNavigation = isEnabled(FeatureName.UESCronosNavigation)

  const defaultQueryVariables = {
    tenantId,
    maxRecords: EVENTS_QUERY_MAX_RECORDS,
    filter: { [ReportingServiceFilter.EcoId]: data?.ecoId },
    sort: [{ field: ReportingServiceField.TsStart, order: ReportingServiceSortDirection.Desc }],
  }

  const Wrapper = cronosNavigation ? Fragment : ContentAreaPanel

  return defaultQueryVariables.filter.ecoId ? (
    <EventsContextProvider>
      <Box className={classes.container}>
        <SecuredContentBoundary>
          <Box className={classes.content}>
            <Wrapper fullHeight fullWidth>
              <NetworkTrafficList
                defaultQueryVariables={defaultQueryVariables}
                hiddenColumns={[EventsColumnDataKey.User]}
                tableTitle={cronosNavigation ? null : t('common.networkConnections')}
                persistDefaultQueryFilter
              />
            </Wrapper>
          </Box>
        </SecuredContentBoundary>
      </Box>
    </EventsContextProvider>
  ) : null
}

export default UserEvents
