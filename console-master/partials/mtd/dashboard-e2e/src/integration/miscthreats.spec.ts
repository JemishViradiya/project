/* eslint-disable no-restricted-globals */
/* eslint-disable no-unused-expressions */
import { FeatureName } from '@ues-data/shared-types'

import {
  bar,
  cardLabel,
  count,
  enableWidget,
  expectUrlParams,
  findWaitByRole,
  findWaitByRoleOptionsWithin,
  line,
  loadChartTypeStrings,
  pie,
} from '../utils/utils'

const MOBILE_ALERTS_URI_HASH = '/mobile-alerts'

describe('MTD Dashboard: MiscThreats', () => {
  const visitOptions = {
    onBeforeLoad: contentWindow => {
      contentWindow.localStorage.setItem('UES_DATA_MOCK', 'true')
      window.localStorage.setItem(FeatureName.UESCronosNavigation, 'true')
      window.localStorage.setItem(FeatureName.SingleNXApp, 'true')
    },
  }
  before(() => {
    loadChartTypeStrings('mtd/common')
    I.visit('/', visitOptions)
  })

  beforeEach(() => {
    I.visit('/', visitOptions)
  })

  it('Should load Dashboard', () => {
    findWaitByRole('navigation').should('exist')
    findWaitByRole('heading', { name: I.translate('dashboard.title') }).should('exist')
  })

  it('Enabled devices - Count', () => {
    enableWidget('enabledDevicesChart')

    findWaitByRoleOptionsWithin('gridcell', { name: cardLabel(I.translate('dashboard.enabledDevices'), count) }, 'heading')
  })

  it('Mobile devices with threat alerts - Count - Clickthrough - Mobile Alerts', () => {
    enableWidget('mobileThreatsDevicesDeltaChart')
    const getParams = expectUrlParams()

    findWaitByRoleOptionsWithin(
      'gridcell',
      { name: cardLabel(I.translate('dashboard.mobileDevicesWithThreatAlerts'), count) },
      'heading',
    ).click()

    cy.then(() => {
      const searchParams = getParams(MOBILE_ALERTS_URI_HASH)
      console.error(searchParams.toString())
      expect(searchParams.get('detectedStart')).to.have.length.gt(0)
      expect(searchParams.get('detectedEnd')).to.have.length.gt(0)
      expect(searchParams.get('groupBy')).equal('device')
      expect(searchParams.get('status')).to.be.null
      expect(searchParams.get('type')).to.be.null
    })
  })

  it('Mobile threats detected - Count - Clickthrough - Mobile Alerts', () => {
    enableWidget('mobileThreatsDeltaChart')
    const getParams = expectUrlParams()

    findWaitByRoleOptionsWithin(
      'gridcell',
      { name: cardLabel(I.translate('dashboard.totalThreatsDetected'), count) },
      'heading',
    ).click()

    cy.then(() => {
      const searchParams = getParams(MOBILE_ALERTS_URI_HASH)
      expect(searchParams.get('detectedStart')).to.have.length.gt(0)
      expect(searchParams.get('detectedEnd')).to.have.length.gt(0)
      expect(searchParams.get('groupBy')).equal('none')
      expect((searchParams.get('status') as string).split(',')).to.include.members(['new', 'resolved'])
      expect(searchParams.get('type')).to.be.null
    })
  })

  it('Mobile threats by category - Pie - Clickthrough - Mobile Alerts', () => {
    enableWidget('mobileThreatsPieChart')
    const getParams = expectUrlParams()

    findWaitByRole('gridcell', { name: cardLabel(I.translate('dashboard.mobileThreatsByCategory'), pie) })
      .contains(I.translate('common.total') as string)
      .click()

    cy.then(() => {
      const searchParams = getParams(MOBILE_ALERTS_URI_HASH)
      expect(searchParams.get('detectedStart')).to.have.length.gt(0)
      expect(searchParams.get('detectedEnd')).to.have.length.gt(0)
      expect(searchParams.get('groupBy')).equal('none')
      expect((searchParams.get('status') as string).split(',')).to.include.members(['new', 'resolved'])
      expect(searchParams.get('type')).to.be.null
    })
  })

  it('Mobile threats by category - Line - Clickthrough - Mobile Alerts', () => {
    enableWidget('mobileThreatsSummaryLineChart')
    const getParams = expectUrlParams()

    findWaitByRole('gridcell', { name: cardLabel(I.translate('dashboard.mobileThreatsByCategory'), line) })
      .contains(I.translate('common.total') as string)
      .click()

    cy.then(() => {
      const searchParams = getParams(MOBILE_ALERTS_URI_HASH)
      expect(searchParams.get('detectedStart')).to.have.length.gt(0)
      expect(searchParams.get('detectedEnd')).to.have.length.gt(0)
      expect(searchParams.get('groupBy')).equal('none')
      expect((searchParams.get('status') as string).split(',')).to.include.members(['new', 'resolved'])
      expect(searchParams.get('type')).to.be.null
    })
  })

  it('Mobile app threats - Bar - Clickthrough - Mobile Alerts', () => {
    enableWidget('mobileAppThreatsBarChart')
    const getParams = expectUrlParams()

    findWaitByRole('gridcell', { name: cardLabel(I.translate('dashboard.mobileAppThreats'), bar) })
      .contains(I.translate('common.total') as string)
      .click()

    cy.then(() => {
      const searchParams = getParams(MOBILE_ALERTS_URI_HASH)
      expect(searchParams.get('detectedStart')).to.have.length.gt(0)
      expect(searchParams.get('detectedEnd')).to.have.length.gt(0)
      expect(searchParams.get('groupBy')).equal('none')
      expect((searchParams.get('status') as string).split(',')).to.include.members(['new', 'resolved'])
      expect((searchParams.get('type') as string).split(',')).to.include.members(['maliciousApplication', 'sideLoadedApplication'])
    })
  })

  it('Mobile app threats - Line - Clickthrough - Mobile Alerts', () => {
    enableWidget('mobileAppThreatsLineChart')
    const getParams = expectUrlParams()

    findWaitByRole('gridcell', { name: cardLabel(I.translate('dashboard.mobileAppThreats'), line) })
      .contains(I.translate('common.total') as string)
      .click()
    cy.then(() => {
      const searchParams = getParams(MOBILE_ALERTS_URI_HASH)
      expect(searchParams.get('detectedStart')).to.have.length.gt(0)
      expect(searchParams.get('detectedEnd')).to.have.length.gt(0)
      expect(searchParams.get('groupBy')).equal('none')
      expect((searchParams.get('status') as string).split(',')).to.include.members(['new', 'resolved'])
      expect((searchParams.get('type') as string).split(',')).to.include.members(['maliciousApplication', 'sideLoadedApplication'])
    })
  })

  it('Mobile network threats - Bar - Clickthrough - Mobile Alerts', () => {
    enableWidget('mobileNetworkThreatsBarChart')
    const getParams = expectUrlParams()

    findWaitByRole('gridcell', { name: cardLabel(I.translate('dashboard.mobileNetworkThreats'), bar) })
      .contains(I.translate('common.total') as string)
      .click()

    cy.then(() => {
      const searchParams = getParams(MOBILE_ALERTS_URI_HASH)
      expect(searchParams.get('detectedStart')).to.have.length.gt(0)
      expect(searchParams.get('detectedEnd')).to.have.length.gt(0)
      expect(searchParams.get('groupBy')).equal('none')
      expect((searchParams.get('status') as string).split(',')).to.include.members(['new', 'resolved'])
      expect((searchParams.get('type') as string).split(',')).to.include.members(['compromisedNetwork', 'insecureWiFi'])
    })
  })

  it('Mobile network threats - Line - Clickthrough - Mobile Alerts', () => {
    enableWidget('mobileNetworkThreatsLineChart')
    const getParams = expectUrlParams()

    findWaitByRole('gridcell', { name: cardLabel(I.translate('dashboard.mobileNetworkThreats'), line) })
      .contains(I.translate('common.total') as string)
      .click()

    cy.then(() => {
      const searchParams = getParams(MOBILE_ALERTS_URI_HASH)
      expect(searchParams.get('detectedStart')).to.have.length.gt(0)
      expect(searchParams.get('detectedEnd')).to.have.length.gt(0)
      expect(searchParams.get('groupBy')).equal('none')
      expect((searchParams.get('status') as string).split(',')).to.include.members(['new', 'resolved'])
      expect((searchParams.get('type') as string).split(',')).to.include.members(['compromisedNetwork', 'insecureWiFi'])
    })
  })

  it('Mobile device security threats - Bar - Clickthrough - Mobile Alerts', () => {
    enableWidget('mobileDeviceSecurityThreatsBarChart')
    const getParams = expectUrlParams()

    findWaitByRole('gridcell', { name: cardLabel(I.translate('dashboard.mobileDeviceSecurityThreats'), bar) })
      .contains(I.translate('common.total') as string)
      .click()

    cy.then(() => {
      const searchParams = getParams(MOBILE_ALERTS_URI_HASH)
      expect(searchParams.get('detectedStart')).to.have.length.gt(0)
      expect(searchParams.get('detectedEnd')).to.have.length.gt(0)
      expect(searchParams.get('groupBy')).equal('none')
      expect((searchParams.get('status') as string).split(',')).to.include.members(['new', 'resolved'])
      expect((searchParams.get('type') as string).split(',')).to.include.members([
        'jailbrokenOrRooted',
        'deviceEncryption',
        'deviceScreenlock',
        'unsupportedOS',
        'unsupportedModel',
        'securityPatch',
        'iOsIntegrityFailure',
        'androidSafetyNetFailure',
        'androidHWFailure',
      ])
    })
  })

  it('Mobile device security threats - Line - Clickthrough - Mobile Alerts', () => {
    enableWidget('mobileDeviceSecurityThreatsLineChart')
    const getParams = expectUrlParams()

    findWaitByRole('gridcell', { name: cardLabel(I.translate('dashboard.mobileDeviceSecurityThreats'), line) })
      .contains(I.translate('common.total') as string)
      .click()

    cy.then(() => {
      const searchParams = getParams(MOBILE_ALERTS_URI_HASH)
      expect(searchParams.get('detectedStart')).to.have.length.gt(0)
      expect(searchParams.get('detectedEnd')).to.have.length.gt(0)
      expect(searchParams.get('groupBy')).equal('none')
      expect((searchParams.get('status') as string).split(',')).to.include.members(['new', 'resolved'])
      expect((searchParams.get('type') as string).split(',')).to.include.members([
        'jailbrokenOrRooted',
        'deviceEncryption',
        'deviceScreenlock',
        'unsupportedOS',
        'unsupportedModel',
        'securityPatch',
        'iOsIntegrityFailure',
        'androidSafetyNetFailure',
        'androidHWFailure',
      ])
    })
  })
})
