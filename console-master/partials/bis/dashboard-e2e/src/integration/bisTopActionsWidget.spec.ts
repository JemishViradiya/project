import { FeatureName, Permission } from '@ues-data/shared-types'
import { CommonFns } from '@ues/assets-e2e'

import { TranslationKey } from '../support/utils'

const PERMISSION_NEEDED = 'dashboard:permissionNeeded'

const { loadingIconShould } = CommonFns(I)

describe('BIS Top Actions Widget', () => {
  describe('RBAC permissions', () => {
    describe('Ues:Bis:Events:Read', () => {
      before(() => {
        window.localStorage.clear()
        window.localStorage.setItem('UES_DATA_MOCK', 'true')
        window.localStorage.setItem('ues.permission.checks.enabled', 'true')

        I.loadI18nNamespaces('components', 'bis/standalone/common', 'bis/ues', 'dashboard').then(() => {
          I.visit('#/dashboard')
        })
      })

      beforeEach(() => {
        loadingIconShould('not.exist')
      })

      it('should render chart if true', () => {
        I.overridePermissions({ [Permission.BIS_EVENTS_READ]: true })
        I.findByRole('gridcell', { name: `${I.translate(TranslationKey.TopActionsWidgetTitle)} TopList` })
          .should('exist')
          .findByRole('heading', { name: I.translate(PERMISSION_NEEDED) })
          .should('not.exist')
      })

      it('should render permission denied fallback if false', () => {
        I.overridePermissions({ [Permission.BIS_EVENTS_READ]: false })

        I.findByRole('gridcell', { name: `${I.translate(TranslationKey.TopActionsWidgetTitle)} TopList` })
          .should('exist')
          .findByRole('heading', { name: I.translate(PERMISSION_NEEDED) })
          .should('exist')
      })
    })

    describe('Features', () => {
      describe('UESActionOrchestrator', () => {
        beforeEach(() => {
          window.localStorage.clear()
        })
        it('should render chart if feature UESActionOrchestrator is false', () => {
          window.localStorage.setItem(FeatureName.UESActionOrchestrator, 'false')
          I.loadI18nNamespaces('components', 'navigation', 'bis/standalone/common', 'bis/ues', 'dashboard').then(() => {
            I.visit('#/dashboard')
          })

          I.findByRole('gridcell', { name: `${I.translate(TranslationKey.TopActionsWidgetTitle)} TopList` }).should('exist')
        })
        it('should not render chart if feature UESActionOrchestrator is true', () => {
          window.localStorage.setItem(FeatureName.UESActionOrchestrator, 'true')
          I.loadI18nNamespaces('components', 'navigation', 'bis/standalone/common', 'bis/ues', 'dashboard').then(() => {
            I.visit('#/dashboard')
          })

          I.findByRole('gridcell', { name: `${I.translate(TranslationKey.TopActionsWidgetTitle)} TopList` }).should('not.exist')
        })
      })
    })
  })
})
