import { apolloQuery } from '@ues-behaviour/shared-e2e'
import { makePageableResponse } from '@ues-data/shared-types'

import { mobileDeviceEntities } from '../support/commands'
import { ColumnId } from '../support/pages'
import { MobileDevicesGrid } from '../support/pages/mobileDevicesGridPage'

describe('Verify basic elements', () => {
  before(() => {
    window.localStorage.setItem('UES_DATA_MOCK', 'true')
    window.localStorage.setItem('ues.nav.cronos.enabled', 'true')
    I.loadI18nNamespaces('platform/common', 'components', 'general/form').then(() => {
      I.visit('#/mobile-devices/')
    })
  })

  it('Should have correct help link', () => {
    I.findByRole('link', { name: I.translate('components:helpLink.helpLinkText') })
      .should('exist')
      .should('have.attr', 'href', MobileDevicesGrid.HELP_LINK)
  })

  it('Verify export button', () => {
    I.findAllByRole('button', { name: I.translate('general/form:commonLabels.export') })
      .should('exist')
      .click()
    I.findAllByRole('button', { name: I.translate('general/form:commonLabels.cancel') }).click()
  })
})

describe('Columns and filters', () => {
  before(() => {
    I.loadI18nNamespaces('platform/endpoints', 'components', 'general/form', 'formats', 'tables').then(() => {
      I.fixture(mobileDeviceEntities).then(entities => {
        window.localStorage.setItem('UES_DATA_MOCK', 'true')
        window.localStorage.setItem('ues.nav.cronos.enabled', 'true')
        window.localStorage.setItem('ues.action.orchestrator.enabled', 'true')
        window.localStorage.setItem('ues.intune.integration.enabled', 'true')
        I.visit('#/mobile-devices/', {
          onBeforeLoad: contentWindow => {
            contentWindow.model.mockAll({
              id: 'platform.endpoints.queryEndpoints',
              data: apolloQuery({
                queryName: 'platformEndpoints',
                result: makePageableResponse(entities.data),
              }),
            })
          },
        })
      })
    })
  })

  it('Test column data', () => {
    window.localStorage.setItem('UES_DATA_MOCK', 'true')
    window.localStorage.setItem('ues.nav.cronos.enabled', 'true')
    window.localStorage.setItem('ues.action.orchestrator.enabled', 'true')
    window.localStorage.setItem('ues.intune.integration.enabled', 'true')
    I.fixture(mobileDeviceEntities).then(entities => {
      // wait for page to load
      I.findByRole('grid').should('exist')
      MobileDevicesGrid.showColumn(MobileDevicesGrid.columns.find(x => x.id === ColumnId.OS_SECURITY_PATCH))
      MobileDevicesGrid.showColumn(MobileDevicesGrid.columns.find(x => x.id === ColumnId.EMAIL))
      I.say('Verifying data in Device column')
      MobileDevicesGrid.testDeviceColumn(entities.data)
      I.say('Verifying data in User column')
      MobileDevicesGrid.testUserColumn(entities.data)
      I.say('Verifying data in Device OS column')
      MobileDevicesGrid.testDeviceOsColumn(entities.data)
      I.say('Verifying data in OS Version column')
      MobileDevicesGrid.testOsVersionColumn(entities.data)
      I.say('Verifying data in Agent column')
      MobileDevicesGrid.testAgentColumn(entities.data)
      I.say('Verifying data in Enrollment column')
      MobileDevicesGrid.testEnrollmentColumn(entities.data)
      I.say('Verifying data in OS Security Patch column')
      MobileDevicesGrid.testOsSecurityPatchColumn(entities.data)
      I.say('Verifying data in Risk status column')
      MobileDevicesGrid.testRiskColumn(entities.data)
      I.say('Verifying data in EMM connections column')
      MobileDevicesGrid.testEmmConnectionsColumn(entities.data)
    })
  })

  it('Verify filters and columns combinations (filter should stay when column it is set on is hidden).', () => {
    MobileDevicesGrid.columns.forEach(c => {
      if (c.canBeHidden) MobileDevicesGrid.showColumn(c)
      if (c.filterType !== null) MobileDevicesGrid.checkFilter({ column: c })
      if (c.canBeHidden) {
        MobileDevicesGrid.hideColumn(c)
        MobileDevicesGrid.findColumnHeader(c).should('not.exist')
      }
      MobileDevicesGrid.checkFilter({ column: c, filterChipOnly: true })
    })

    I.findByRole('toolbar').findByText(I.translate('tables:clear')).click()
  })
})
