import type { ColumnConfig } from '../../support/pages'
import { ColumnId, MobileDevicesGrid } from '../../support/pages'

describe('Emm connections column (featurized, feature ues.intune.integration.enabled)', () => {
  describe('Feature on', () => {
    before(() => {
      window.localStorage.setItem('ues.nav.cronos.enabled', 'true')
      window.localStorage.setItem('UES_DATA_MOCK', 'true')
      window.localStorage.setItem('ues.intune.integration.enabled', 'true')
      I.loadI18nNamespaces('platform/endpoints').then(() => I.visit('#/mobile-devices/'))
    })

    it(`Emm connections column should be visible when the feature is on`, () => {
      MobileDevicesGrid.findColumnHeaderById(ColumnId.EMM_CONNECTIONS).should('exist')
    })
  })

  describe('Feature off', () => {
    before(() => {
      window.localStorage.setItem('ues.nav.cronos.enabled', 'true')
      window.localStorage.setItem('UES_DATA_MOCK', 'true')
      window.localStorage.setItem('ues.intune.integration.enabled', 'false')
      I.loadI18nNamespaces('platform/endpoints').then(() => {
        I.visit('#/mobile-devices/')
      })
    })

    it(`Emm connections column should not be visible when the feature is off`, () => {
      const emmConnections: ColumnConfig = MobileDevicesGrid.columns.find(x => x.id === ColumnId.EMM_CONNECTIONS)

      MobileDevicesGrid.findColumnHeader(emmConnections).should('not.exist')

      MobileDevicesGrid.openColumnPicker()
      MobileDevicesGrid.findColumnInPickerByLabelKey(emmConnections.labelKey).should('not.exist')
      MobileDevicesGrid.clickOutsideModal()
    })
  })
})
