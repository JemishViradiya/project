//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { FeatureName, Permission } from '@ues-data/shared-types'
import { CommonFns } from '@ues/assets-e2e'

const { loadingIconShould, visitView } = CommonFns(I)

const cardLabel = (titleText, chartType) => titleText + ' ' + chartType //todo, put this through I.translate('cardLabel')

let toplist, bar, line, count, pie

Cypress.on('uncaught:exception', (err, runnable) => {
  if (err.message.includes('No data')) {
    return false
  }
})

describe('Dashboard: RBAC', () => {
  before(() => {
    visitView('#/static/gateway', { [FeatureName.PermissionChecksEnabled]: true }, ['dashboard'])

    I.overridePermissions({
      [Permission.BIG_REPORTING_READ]: false,
      [Permission.BIG_TENANT_READ]: false,
    })
  })

  beforeEach(() => {
    loadingIconShould('not.exist')
    pie = I.translate('dashboard:pie')
    toplist = I.translate('dashboard:toplist')
    bar = I.translate('dashboard:bar')
    line = I.translate('dashboard:line')
    count = I.translate('dashboard:count')
  })

  it('should show no permission without reporting and tenant read set', () => {
    // remove read access and verify access denied message exists

    const DASHBOARD_WIDGETS = [
      {
        name: I.translate('common.networkConnections'),
        chartType: pie,
      },
      {
        name: I.translate('dashboard.transferredBytesWidgetTitle'),
        chartType: pie,
      },
      {
        name: I.translate('dashboard.connectorStatusWidgetTitle'),
        chartType: toplist,
      },
      {
        name: I.translate('dashboard.tlsVersionsWidgetTitle'),
        chartType: pie,
      },
      {
        name: I.translate('dashboard.privateTopNetworkDestinationsWidgetTitle'),
        chartType: toplist,
      },
      {
        name: I.translate('dashboard.publicTopNetworkDestinationsWidgetTitle'),
        chartType: toplist,
      },
      {
        name: I.translate('dashboard.publicNetworkAccessWidgetTitle'),
        chartType: line,
      },
      {
        name: I.translate('dashboard.privateNetworkAccessWidgetTitle'),
        chartType: line,
      },
      {
        name: I.translate('dashboard.networkAccessControlAppliedPoliciesWidgetTitle'),
        chartType: pie,
      },
      {
        name: I.translate('dashboard.totalActiveUsersWidgetTitle'),
        chartType: count,
      },
      {
        name: I.translate('connectors.connectors'),
        chartType: line,
      },
    ]

    DASHBOARD_WIDGETS.forEach(widget =>
      I.findByRole('gridcell', { name: cardLabel(widget.name, widget.chartType) })
        .findAllByRole('heading', {
          name: I.translate('dashboard:permissionNeeded'),
        })
        .should('exist'),
    )
  })
})
