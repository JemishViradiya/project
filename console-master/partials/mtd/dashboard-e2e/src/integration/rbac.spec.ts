import { Permission } from '@ues-data/shared-types'

import {
  bar,
  cardLabel,
  count,
  enableWidget,
  findWaitByRole,
  findWaitByText,
  findWaitByXGridCell,
  line,
  loadChartTypeStrings,
  pie,
  setLocalStorageState,
  toplist,
} from '../utils/utils'

let permissionNeeded: string

describe('MTD Dashboard: RBAC', () => {
  before(() => {
    loadChartTypeStrings('mtd/common', 'platform/common', 'access').then(() => {
      permissionNeeded = I.translate('dashboard:permissionNeeded')
    })
    I.visit('/', {
      onBeforeLoad: setLocalStorageState,
    })
  })

  beforeEach(() => {
    I.location('pathname').then(pathname => {
      if (pathname !== '/uc/mtd-dashboard') {
        I.visit('/', {
          onBeforeLoad: setLocalStorageState,
        })
      }
      I.visitRoute('/dashboard')
    })
  })

  it('Threats - All Types - No permissions', () => {
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.MTD_EVENTS_READ] = false
    I.overridePermissions({ ...overridePermissionsObj })

    findWaitByRole('gridcell', { name: cardLabel(I.translate('mtd/common:dashboard.mobileDevicesWithThreatAlerts'), count) })
      .findAllByRole('heading', {
        name: permissionNeeded,
      })
      .should('exist')

    findWaitByRole('gridcell', { name: cardLabel(I.translate('mtd/common:dashboard.totalThreatsDetected'), count) })
      .findAllByRole('heading', {
        name: permissionNeeded,
      })
      .should('exist')

    findWaitByRole('gridcell', { name: cardLabel(I.translate('mtd/common:dashboard.mobileThreatsByCategory'), pie) })
      .findAllByRole('heading', {
        name: permissionNeeded,
      })
      .should('exist')

    findWaitByRole('gridcell', { name: cardLabel(I.translate('mtd/common:dashboard.mobileThreatsByCategory'), line) })
      .findAllByRole('heading', {
        name: permissionNeeded,
      })
      .should('exist')

    findWaitByRole('gridcell', { name: cardLabel(I.translate('mtd/common:dashboard.mobileAppThreats'), bar) })
      .findAllByRole('heading', {
        name: permissionNeeded,
      })
      .should('exist')

    findWaitByRole('gridcell', { name: cardLabel(I.translate('mtd/common:dashboard.mobileAppThreats'), line) })
      .findAllByRole('heading', {
        name: permissionNeeded,
      })
      .should('exist')

    findWaitByRole('gridcell', { name: cardLabel(I.translate('mtd/common:dashboard.mobileNetworkThreats'), bar) })
      .findAllByRole('heading', {
        name: permissionNeeded,
      })
      .should('exist')

    findWaitByRole('gridcell', { name: cardLabel(I.translate('mtd/common:dashboard.mobileNetworkThreats'), line) })
      .findAllByRole('heading', {
        name: permissionNeeded,
      })
      .should('exist')

    findWaitByRole('gridcell', { name: cardLabel(I.translate('mtd/common:dashboard.mobileDeviceSecurityThreats'), bar) })
      .findAllByRole('heading', {
        name: permissionNeeded,
      })
      .should('exist')

    findWaitByRole('gridcell', { name: cardLabel(I.translate('mtd/common:dashboard.mobileDeviceSecurityThreats'), line) })
      .findAllByRole('heading', {
        name: permissionNeeded,
      })
      .should('exist')

    findWaitByRole('gridcell', { name: cardLabel(I.translate('mtd/common:dashboard.topInsecureWifiThreats'), toplist) })
      .findAllByRole('heading', {
        name: permissionNeeded,
      })
      .should('exist')

    findWaitByRole('gridcell', { name: cardLabel(I.translate('mtd/common:dashboard.topCompromisedNetworkThreats'), toplist) })
      .findAllByRole('heading', {
        name: permissionNeeded,
      })
      .should('exist')

    findWaitByRole('gridcell', { name: cardLabel(I.translate('mtd/common:dashboard.topSideLoadedAppThreats'), toplist) })
      .findAllByRole('heading', {
        name: permissionNeeded,
      })
      .should('exist')

    findWaitByRole('gridcell', { name: cardLabel(I.translate('mtd/common:dashboard.topUnsupportedOsThreats'), toplist) })
      .findAllByRole('heading', {
        name: permissionNeeded,
      })
      .should('exist')

    findWaitByRole('gridcell', { name: cardLabel(I.translate('mtd/common:dashboard.topUnsupportedModelThreats'), toplist) })
      .findAllByRole('heading', {
        name: permissionNeeded,
      })
      .should('exist')

    findWaitByRole('gridcell', { name: cardLabel(I.translate('mtd/common:dashboard.topUnsupportedSecurityPatchThreats'), toplist) })
      .findAllByRole('heading', {
        name: permissionNeeded,
      })
      .should('exist')

    findWaitByRole('gridcell', { name: cardLabel(I.translate('mtd/common:dashboard.topMobileThreatDetections'), toplist) })
      .findAllByRole('heading', {
        name: permissionNeeded,
      })
      .should('exist')

    findWaitByRole('gridcell', { name: cardLabel(I.translate('mtd/common:dashboard.topMobileThreatDevices'), toplist) })
      .findAllByRole('heading', {
        name: permissionNeeded,
      })
      .should('exist')
    findWaitByRole('gridcell', { name: cardLabel(I.translate('mtd/common:dashboard.topUnsafeMessages'), toplist) })
      .findAllByRole('heading', {
        name: permissionNeeded,
      })
      .should('exist')
  })

  it('Enabled devices - Count - No permissions', () => {
    enableWidget('enabledDevicesChart')

    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.ECS_DEVICES_READ] = false
    I.overridePermissions({ ...overridePermissionsObj })

    findWaitByRole('gridcell', { name: cardLabel(I.translate('mtd/common:dashboard.enabledDevices'), count) })
      .findAllByRole('heading', {
        name: permissionNeeded,
      })
      .should('exist')
  })

  it('Threats - Top devices with mobile threats - No click through', () => {
    enableWidget('mobileThreatTopDeviceListChart')

    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.ECS_DEVICES_READ] = false
    I.overridePermissions({ ...overridePermissionsObj })

    findWaitByRole('gridcell', { name: cardLabel(I.translate('mtd/common:dashboard.topMobileThreatDevices'), toplist) })
      .findAllByRole('listitem')
      .first()
      .click()
    I.url().should('include', '/uc/mtd-dashboard#/dashboard')
  })

  it('Mobile OS with vulnerabilities - Bar - No permissions', () => {
    enableWidget('vulnerableMobileOsChart')

    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.ECS_VULNERABILITIES_READ] = false
    I.overridePermissions({ ...overridePermissionsObj })

    findWaitByRole('gridcell', { name: cardLabel(I.translate('mtd/common:dashboard.mobileOsWithVulnerabilities'), bar) })
      .findAllByRole('heading', {
        name: permissionNeeded,
      })
      .should('exist')
  })

  it('Mobile OS with vulnerabilities - OS Details - No permissions', () => {
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.ECS_VULNERABILITIES_READ] = false
    I.overridePermissions({ ...overridePermissionsObj })

    I.visitRoute('/vulnerabilities')

    findWaitByText(I.translate('access:Ues_Ecs_Vulnerabilities_Read')).should('exist')
  })

  it('Mobile OS with vulnerabilities - CVEs - No permissions', () => {
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.ECS_VULNERABILITIES_READ] = false
    I.overridePermissions({ ...overridePermissionsObj })

    I.visitRoute('/vulnerabilities/cve?plarform=ios&version=13')

    findWaitByText(I.translate('access:errors.notFound.title')).should('exist')
  })

  it('Mobile OS with vulnerabilities - OS Details - No device read permission', () => {
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.ECS_DEVICES_READ] = false
    I.overridePermissions({ ...overridePermissionsObj })

    I.visitRoute('/vulnerabilities')

    findWaitByXGridCell(2, 3 /*endpointCount*/).within(() => {
      findWaitByText('2').should('exist')
    })
  })
})
