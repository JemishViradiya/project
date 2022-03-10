/* eslint-disable no-restricted-globals */
/* eslint-disable no-unused-expressions */

import { FeatureName } from '@ues-data/shared-types'

import { cardLabel, enableWidget, expectUrlParams, findWaitByRole, loadChartTypeStrings, toplist } from '../utils/utils'

const MOBILE_ALERTS_URI_HASH = '/mobile-alerts'

const MOBILE_DEVICES_URI_HASH = 'alerts'

describe('MTD Dashboard: TopThreats', () => {
  const visitOptions = {
    onBeforeLoad: window => {
      window.localStorage.setItem('UES_DATA_MOCK', 'true')
      window.localStorage.setItem(FeatureName.UESCronosNavigation, 'true')
      window.localStorage.setItem(FeatureName.SingleNXApp, 'true')
      window.localStorage.setItem(FeatureName.MobileThreatDetectionUnsafeMsgThreat, 'true')
      window.localStorage.setItem(FeatureName.MobileThreatDetectionUnresponsiveAgentThreat, 'true')
      window.localStorage.setItem(FeatureName.MobileThreatDetectionDeveloperModeThreat, 'true')
    },
  }
  before(() => {
    window.localStorage.setItem('UES_DATA_MOCK', 'true')
    window.localStorage.setItem(FeatureName.UESCronosNavigation, 'true')
    window.localStorage.setItem(FeatureName.SingleNXApp, 'true')

    loadChartTypeStrings('mtd/common')
  })

  beforeEach(() => {
    I.visit('/', visitOptions)
  })

  it('Top insecure Wi-Fi networks - Top List - Clickthrough - Mobile Alerts', () => {
    enableWidget('insecureWifiTopListChart')

    findWaitByRole('gridcell', { name: cardLabel(I.translate('dashboard.topInsecureWifiThreats'), toplist) })
      .findAllByRole('listitem')
      .first()
      .click()
    const getParams = expectUrlParams()
    cy.then(() => {
      const searchParams = getParams(MOBILE_ALERTS_URI_HASH)
      expect(searchParams.get('detectedStart')).to.have.length.gt(0)
      expect(searchParams.get('detectedEnd')).to.have.length.gt(0)
      expect(searchParams.get('groupBy')).equal('detection')
      expect((searchParams.get('status') as string).split(',')).to.include.members(['new', 'resolved'])
      expect(searchParams.get('type')).equal('insecureWiFi')
      expect(searchParams.get('name')).to.have.length.gt(0)
    })
  })

  it('Top compromised networks - Top List - Clickthrough - Mobile Alerts', () => {
    enableWidget('compromisedNetworkTopListChart')

    findWaitByRole('gridcell', { name: cardLabel(I.translate('dashboard.topCompromisedNetworkThreats'), toplist) })
      .findAllByRole('listitem')
      .first()
      .click()
    const getParams = expectUrlParams()
    cy.then(() => {
      const searchParams = getParams(MOBILE_ALERTS_URI_HASH)
      expect(searchParams.get('detectedStart')).to.have.length.gt(0)
      expect(searchParams.get('detectedEnd')).to.have.length.gt(0)
      expect(searchParams.get('groupBy')).equal('detection')
      expect((searchParams.get('status') as string).split(',')).to.include.members(['new', 'resolved'])
      expect(searchParams.get('type')).equal('compromisedNetwork')
      expect(searchParams.get('name')).to.have.length.gt(0)
    })
  })

  it('Top sideloaded apps - Top List - Clickthrough - Mobile Alerts', () => {
    enableWidget('sideLoadedAppTopListChart')

    findWaitByRole('gridcell', { name: cardLabel(I.translate('dashboard.topSideLoadedAppThreats'), toplist) })
      .findAllByRole('listitem')
      .first()
      .click()
    const getParams = expectUrlParams()
    cy.then(() => {
      const searchParams = getParams(MOBILE_ALERTS_URI_HASH)
      expect(searchParams.get('detectedStart')).to.have.length.gt(0)
      expect(searchParams.get('detectedEnd')).to.have.length.gt(0)
      expect(searchParams.get('groupBy')).equal('detection')
      expect((searchParams.get('status') as string).split(',')).to.include.members(['new', 'resolved'])
      expect(searchParams.get('type')).equal('sideLoadedApplication')
      expect(searchParams.get('name')).to.have.length.gt(0)
    })
  })

  it('Top malicious apps - Top List - Clickthrough - Mobile Alerts', () => {
    enableWidget('maliciousAppTopListChart')

    findWaitByRole('gridcell', { name: cardLabel(I.translate('dashboard.topMaliciousAppThreats'), toplist) })
      .findAllByRole('listitem')
      .first()
      .click()
    const getParams = expectUrlParams()
    cy.then(() => {
      const searchParams = getParams(MOBILE_ALERTS_URI_HASH)
      expect(searchParams.get('detectedStart')).to.have.length.gt(0)
      expect(searchParams.get('detectedEnd')).to.have.length.gt(0)
      expect(searchParams.get('groupBy')).equal('detection')
      expect((searchParams.get('status') as string).split(',')).to.include.members(['new', 'resolved'])
      expect(searchParams.get('type')).equal('maliciousApplication')
      expect(searchParams.get('name')).to.have.length.gt(0)
    })
  })

  it('Top unsupported OS - Top List - Clickthrough - Mobile Alerts', () => {
    enableWidget('unsupportedOsTopListChart')

    findWaitByRole('gridcell', { name: cardLabel(I.translate('dashboard.topUnsupportedOsThreats'), toplist) })
      .findAllByRole('listitem')
      .first()
      .click()
    const getParams = expectUrlParams()
    cy.then(() => {
      const searchParams = getParams(MOBILE_ALERTS_URI_HASH)
      expect(searchParams.get('detectedStart')).to.have.length.gt(0)
      expect(searchParams.get('detectedEnd')).to.have.length.gt(0)
      expect(searchParams.get('groupBy')).equal('detection')
      expect((searchParams.get('status') as string).split(',')).to.include.members(['new', 'resolved'])
      expect(searchParams.get('type')).equal('unsupportedOS')
      expect(searchParams.get('name')).to.have.length.gt(0)
    })
  })

  it('Top unsupported Model - Top List - Clickthrough - Mobile Alerts', () => {
    enableWidget('unsupportedModelTopListChart')

    findWaitByRole('gridcell', { name: cardLabel(I.translate('dashboard.topUnsupportedModelThreats'), toplist) })
      .findAllByRole('listitem')
      .first()
      .click()
    const getParams = expectUrlParams()
    cy.then(() => {
      const searchParams = getParams(MOBILE_ALERTS_URI_HASH)
      expect(searchParams.get('detectedStart')).to.have.length.gt(0)
      expect(searchParams.get('detectedEnd')).to.have.length.gt(0)
      expect(searchParams.get('groupBy')).equal('detection')
      expect((searchParams.get('status') as string).split(',')).to.include.members(['new', 'resolved'])
      expect(searchParams.get('type')).equal('unsupportedModel')
      expect(searchParams.get('name')).to.have.length.gt(0)
    })
  })

  it('Top unsupported security patch - Top List - Clickthrough - Mobile Alerts', () => {
    enableWidget('unsupportedSecurityPatchTopListChart')

    findWaitByRole('gridcell', {
      name: cardLabel(I.translate('dashboard.topUnsupportedSecurityPatchThreats'), toplist),
    })
      .findAllByRole('listitem')
      .first()
      .click()
    const getParams = expectUrlParams()
    cy.then(() => {
      const searchParams = getParams(MOBILE_ALERTS_URI_HASH)
      expect(searchParams.get('detectedStart')).to.have.length.gt(0)
      expect(searchParams.get('detectedEnd')).to.have.length.gt(0)
      expect(searchParams.get('groupBy')).equal('detection')
      expect((searchParams.get('status') as string).split(',')).to.include.members(['new', 'resolved'])
      expect(searchParams.get('type')).equal('securityPatch')
      expect(searchParams.get('name')).to.have.length.gt(0)
    })
  })

  it('Top mobile threat detections - Top List - Clickthrough - Mobile Alerts', () => {
    enableWidget('mobileThreatDetectionsTopListChart')

    findWaitByRole('gridcell', {
      name: cardLabel(I.translate('dashboard.topMobileThreatDetections'), toplist),
    })
      .findAllByRole('listitem')
      .first()
      .click()
    const getParams = expectUrlParams()
    cy.then(() => {
      const searchParams = getParams(MOBILE_ALERTS_URI_HASH)
      expect(searchParams.get('detectedStart')).to.have.length.gt(0)
      expect(searchParams.get('detectedEnd')).to.have.length.gt(0)
      expect(searchParams.get('groupBy')).equal('detection')
      expect((searchParams.get('status') as string).split(',')).to.include.members(['new', 'resolved'])
      expect(searchParams.get('type')).to.be.null
      expect(searchParams.get('name')).to.have.length.gt(0)
    })
  })

  it('Top unsafe messages - Top List - Clickthrough - Mobile Alerts', () => {
    enableWidget('unsafeMessagesTopListChart')

    findWaitByRole('gridcell', { name: cardLabel(I.translate('dashboard.topUnsafeMessages'), toplist) })
      .findAllByRole('listitem')
      .first()
      .click()
    const getParams = expectUrlParams()
    cy.then(() => {
      const searchParams = getParams(MOBILE_ALERTS_URI_HASH)
      expect(searchParams.get('detectedStart')).to.have.length.gt(0)
      expect(searchParams.get('detectedEnd')).to.have.length.gt(0)
      expect(searchParams.get('groupBy')).equal('none')
      expect((searchParams.get('status') as string).split(',')).to.include.members(['new', 'resolved'])
      expect(searchParams.get('type')).equal('unsafeMessage')
      expect(searchParams.get('description')).to.have.length.gt(0)
      expect(searchParams.get('name')).to.be.null
    })
  })

  it('Top devices with mobile threats - Top List - Clickthrough - Mobile Alerts', () => {
    enableWidget('mobileThreatTopDeviceListChart')

    findWaitByRole('gridcell', { name: cardLabel(I.translate('dashboard.topMobileThreatDevices'), toplist) })
      .findAllByRole('listitem')
      .first()
      .click()
    const getParams = expectUrlParams()
    cy.then(() => {
      const searchParams = getParams(MOBILE_DEVICES_URI_HASH)
      expect(searchParams.get('detectedStart')).to.have.length.gt(0)
      expect(searchParams.get('detectedEnd')).to.have.length.gt(0)
      expect(searchParams.get('groupBy')).to.be.null
      expect(searchParams.get('status')).equal('')
      expect(searchParams.get('type')).to.be.null
    })
  })
})
