import React from 'react'
import { Navigate, Outlet } from 'react-router'

import { ViewWrapper } from '@ues/behaviours'

import { RiskDetectionPolicies, RiskDetectionPolicy } from './views'

const tabs = [RiskDetectionPolicies]

export const _defaultRoute = '/list/riskAssessment'

export const _routes = [
  {
    path: '/',
    element: (
      <main style={{ padding: 0 }}>
        <Outlet />
      </main>
    ),
    children: [
      {
        path: '/list',
        element: (
          <ViewWrapper
            basename="/bis/risk-detection-polices"
            titleKey="profiles:navigation.title"
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            tabs={tabs}
            tKeys={['console']}
          />
        ),
        children: tabs,
      },
      RiskDetectionPolicy,
      {
        path: '/',
        element: <Navigate to={_defaultRoute} />,
      },
    ],
  },
]
