import { Permission } from '@ues-data/shared-types'
import { CommonFns } from '@ues/assets-e2e'

import { TranslationKey } from '../support/utils'

const PERMISSION_NEEDED = 'dashboard:permissionNeeded'

const { loadingIconShould } = CommonFns(I)

describe.skip('BIS Dashboard', () => {
  describe('BIS Geozone Risk Alerts Widget', () => {
    describe('RBAC - Read', () => {
      before(() => {
        I.loadI18nNamespaces('components', 'bis/standalone/common', 'bis/ues', 'dashboard')
        window.localStorage.setItem('UES_DATA_MOCK', 'true')
        window.localStorage.setItem('ues.permission.checks.enabled', 'true')
        I.visit('#/dashboard')
      })
      beforeEach(() => {
        const overridePermissionsObj = {}
        I.overridePermissions({ ...overridePermissionsObj })
      })
      it('Should show chart when Read permission is true', () => {
        loadingIconShould('not.exist')
        const overridePermissionsObj = {}
        overridePermissionsObj[Permission.BIS_EVENTS_READ] = true
        I.overridePermissions({ ...overridePermissionsObj })
        I.findByRole('gridcell', {
          name: `${I.translate(TranslationKey.GeozoneRiskAlertsWidgetTitle)}`,
        })
          .should('exist')
          .findByRole('heading', { name: I.translate(PERMISSION_NEEDED) })
          .should('not.exist')
      })
      it('Should show "Permissions needed" when read permission is false', () => {
        loadingIconShould('not.exist')
        const overridePermissionsObj = {}
        overridePermissionsObj[Permission.BIS_EVENTS_READ] = false
        I.overridePermissions({ ...overridePermissionsObj })

        I.findByRole('gridcell', {
          name: `${I.translate(TranslationKey.GeozoneRiskAlertsWidgetTitle)}`,
        })
          .should('exist')
          .findByRole('heading', { name: I.translate(PERMISSION_NEEDED) })
          .should('exist')
      })
    })
  })
})
