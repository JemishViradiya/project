import { MobileDevicesGrid } from '../../support/pages'

describe('Mobile devices grids RBAC', () => {
  beforeEach(() => {
    window.localStorage.setItem('UES_DATA_MOCK', 'true')
    window.localStorage.setItem('ues.permission.checks.enabled', 'true')
    window.localStorage.setItem('ues.nav.cronos.enabled', 'true')
    I.loadI18nNamespaces('general/form', 'access').then(() => I.visit('#/mobile-devices/'))
  })

  it(`Read only permission - column selection and 'Remove' buttons should not appear`, () => {
    MobileDevicesGrid.setReadonlyDevicePermissions()
    I.findByRole('checkbox', { name: 'Select All Rows checkbox' }).should('not.exist')
    MobileDevicesGrid.getRemoveButton().should('not.exist')
  })

  it('No Read permission - should redirect to not found page if read permissions are missing', () => {
    MobileDevicesGrid.setNoDevicesPermissions()
    MobileDevicesGrid.findNotFoundMessage()
  })
})
