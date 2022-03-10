//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useCallback } from 'react'

import type { ChartProps } from '@ues-behaviour/dashboard'
import { PieChart } from '@ues-behaviour/dashboard'
import type { ReconciliationEntityType } from '@ues-data/gateway'
import { DASHBOARD_WIDGET_MAX_RECORDS_COUNT, ReportingServiceFilter } from '@ues-data/gateway'
import { Data, Types, Utils } from '@ues-gateway/shared'

import { useDataLayer } from '../hooks'

const { makePageRoute } = Utils
const { queryAppliedPolicies } = Data
const { Page } = Types

interface AppliedPoliciesWidgetProps extends ChartProps {
  policyType: ReconciliationEntityType
}

export const AppliedPoliciesWidget: React.FC<AppliedPoliciesWidgetProps> = ({ globalTime, policyType, height }) => {
  const { data, startDate, endDate } = useDataLayer({
    query: queryAppliedPolicies,
    globalTime,
    hasNoData: data => !data?.tenant?.tunnelAgg?.buckets?.length,
    defaultQueryVariables: {
      maxRecords: DASHBOARD_WIDGET_MAX_RECORDS_COUNT,
      filter: { [ReportingServiceFilter.AlertPolicyType]: policyType },
    },
  })

  const chartData = (data?.tenant?.tunnelAgg?.buckets ?? []).map(({ key, count }) => ({ label: key, count }))

  const handleInteraction = useCallback(
    data =>
      window.location.assign(
        makePageRoute(Page.GatewayExternalEvents, {
          queryStringParams: { startDate, endDate, [ReportingServiceFilter.AlertPolicyName]: data.label },
        }),
      ),
    [startDate, endDate],
  )

  return <PieChart additionalProps={{ verticalAlign: false }} height={height} data={chartData} onInteraction={handleInteraction} />
}
