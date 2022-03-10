import type { ColumnConfig } from '../../support/pages'
import { ColumnId, MobileDevicesGrid } from '../../support/pages'

describe('Risk level status column (featurized, feature ues.action.orchestrator.enabled)', () => {
  describe('Feature on', () => {
    before(() => {
      window.localStorage.setItem('ues.nav.cronos.enabled', 'true')
      window.localStorage.setItem('UES_DATA_MOCK', 'true')
      window.localStorage.setItem('ues.action.orchestrator.enabled', 'true')
      I.loadI18nNamespaces('platform/endpoints').then(() => I.visit('#/mobile-devices/'))
    })

    it(`Risk column should be visible when the feature is on`, () => {
      MobileDevicesGrid.findColumnHeaderById(ColumnId.RISK).should('exist')
    })
  })

  describe('Feature off', () => {
    before(() => {
      window.localStorage.setItem('ues.nav.cronos.enabled', 'true')
      window.localStorage.setItem('UES_DATA_MOCK', 'true')
      window.localStorage.setItem('ues.action.orchestrator.enabled', 'false')
      I.loadI18nNamespaces('platform/endpoints').then(() => {
        I.visit('#/mobile-devices/')
      })
    })

    it(`Risk column should not be visible when the feature is off`, () => {
      const riskColumn: ColumnConfig = MobileDevicesGrid.columns.find(x => x.id === ColumnId.RISK)

      MobileDevicesGrid.findColumnHeader(riskColumn).should('not.exist')

      MobileDevicesGrid.openColumnPicker()
      MobileDevicesGrid.findColumnInPickerByLabelKey(riskColumn.labelKey).should('not.exist')
      MobileDevicesGrid.clickOutsideModal()
    })
  })
})
