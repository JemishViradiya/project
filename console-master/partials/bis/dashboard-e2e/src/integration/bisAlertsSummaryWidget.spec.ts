import { RiskSummaryQueryMock } from '@ues-data/bis/mocks'
import { Permission } from '@ues-data/shared-types'
import { CommonFns } from '@ues/assets-e2e'

import { TranslationKey } from '../support/utils'

const { loadingIconShould } = CommonFns(I)

const PERMISSION_NEEDED = 'dashboard:permissionNeeded'
const riskSummary = RiskSummaryQueryMock.riskSummary
const highIdentityRiskCount = riskSummary[1].count

describe('BIS Dashboard', () => {
  describe('BIS Alerts Summary Widget', () => {
    describe('RBAC - Read', () => {
      before(() => {
        I.loadI18nNamespaces('components', 'bis/standalone/common', 'bis/ues', 'dashboard')
      })
      beforeEach(() => {
        window.localStorage.setItem('UES_DATA_MOCK', 'true')
        window.localStorage.setItem('ues.permission.checks.enabled', 'true')
        window.localStorage.setItem('ues.navigation.gatewayalerts.transition', 'true')
        I.visit('#/dashboard')
        const overridePermissionsObj = {}
        I.overridePermissions({ ...overridePermissionsObj })
        loadingIconShould('not.exist')
      })
      it('Should show chart when Read permission is true', () => {
        const overridePermissionsObj = {}
        overridePermissionsObj[Permission.BIS_EVENTS_READ] = true
        I.overridePermissions({ ...overridePermissionsObj })

        I.findByText(I.translate(TranslationKey.HighNetworkAnomalyAlerts)).should('exist')
        I.findByText(I.translate(TranslationKey.HighNetworkAnomalyAlerts))
          .parent()
          .next()
          .should('have.text', highIdentityRiskCount)
        I.findByRole('gridcell', {
          name: `${I.translate(TranslationKey.NetworkAlertSummaryWidgetTitle)} TopList`,
        })
          .should('exist')
          .findByRole('heading', { name: I.translate(PERMISSION_NEEDED) })
          .should('not.exist')
      })
      it('Should show "Permissions needed" when read permission is false', () => {
        const overridePermissionsObj = {}
        overridePermissionsObj[Permission.BIS_EVENTS_READ] = false
        I.overridePermissions({ ...overridePermissionsObj })

        I.findByRole('gridcell', {
          name: `${I.translate(TranslationKey.NetworkAlertSummaryWidgetTitle)} TopList`,
        })
          .should('exist')
          .findByRole('heading', { name: I.translate(PERMISSION_NEEDED) })
          .should('exist')
        I.findByText(I.translate(TranslationKey.HighNetworkAnomalyAlerts)).should('not.exist')
      })
    })
  })
})
