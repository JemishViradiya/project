import React from 'react'
import { useParams } from 'react-router'

import { Box } from '@material-ui/core'

import { ReportingServiceField, ReportingServiceFilter, ReportingServiceSortDirection } from '@ues-data/gateway'
import { useUesSession } from '@ues-data/shared'
import { Config } from '@ues-gateway/shared'
import { SecuredContentBoundary } from '@ues/behaviours'

import { EventsColumnDataKey } from '../components'
import useStyles from '../components/styles'
import { EventsContextProvider } from '../context'

const NetworkTrafficList = React.lazy(() => import('../components/network-traffic-list'))

const { EVENTS_QUERY_MAX_RECORDS } = Config

const UserEvents = () => {
  const { endpointId } = useParams()
  const { tenantId } = useUesSession()

  const classes = useStyles()

  const defaultQueryVariables = {
    tenantId,
    maxRecords: EVENTS_QUERY_MAX_RECORDS,
    filter: { [ReportingServiceFilter.EndpointIds]: [endpointId] },
    sort: [{ field: ReportingServiceField.TsStart, order: ReportingServiceSortDirection.Desc }],
  }

  return endpointId ? (
    <EventsContextProvider>
      <Box className={classes.container}>
        <SecuredContentBoundary>
          <NetworkTrafficList
            defaultQueryVariables={defaultQueryVariables}
            hiddenColumns={[EventsColumnDataKey.User, EventsColumnDataKey.Model, EventsColumnDataKey.Platform]}
            persistDefaultQueryFilter
          />
        </SecuredContentBoundary>
      </Box>
    </EventsContextProvider>
  ) : null
}

export default UserEvents
