import { CommonFns } from '@ues/assets-e2e'

import {
  mockAdminRoleToken,
  mockInstallerDownloadToken,
  mockNoAdminNoPermissionToken,
  mockUserRoleToken,
  mockZoneManagerRoleToken,
} from '../support/app.po'

const { loadingIconShould } = CommonFns(I)

describe('Deployments View', () => {
  const ACCOUNT_AUTH_URL = '**/Account/Authorize'
  const INSTALLER_PACKAGE_CONTAINER = '[data-autoid="installer-package-container"]'

  before(() => {
    window.localStorage.setItem('UES_DATA_MOCK', 'true')
  })

  beforeEach(() => {
    window.localStorage.setItem('Deployments.UpdateRules.enabled', 'true')
    window.localStorage.setItem('Deployments.UpdateStrategies.enabled', 'true')
    I.visit('/')
    I.intercept('GET', '**/flagsBulk/**', {
      body: {
        'Deployments.MobileApp.enabled': true,
        'Deployments.UpdateRules.enabled': false,
        'Deployments.UpdateStrategies.enabled': false,
      },
    }).as('flags')
    loadingIconShould('not.exist')
  })

  it('should render items according to feature flag', () => {
    I.get('[data-autoid="update-strategies-component"]').should('not.exist')
    I.get('[data-autoid="update-rules-component"]').should('not.exist')
  })

  it('displays installer package download UI if admin', () => {
    I.intercept('POST', ACCOUNT_AUTH_URL, {
      body: [mockAdminRoleToken],
    }).as(ACCOUNT_AUTH_URL)
    // reload to force another auth request. uses stubbed auth route
    I.reload()

    I.get(INSTALLER_PACKAGE_CONTAINER).should('exist')
  })

  it('displays installer package download UI if InstallerDownload role assigned', () => {
    I.intercept('POST', ACCOUNT_AUTH_URL, {
      body: [mockInstallerDownloadToken],
    }).as(ACCOUNT_AUTH_URL)
    I.reload()

    I.get(INSTALLER_PACKAGE_CONTAINER).should('exist')
  })

  it('displays installer package download UI if user role assigned', () => {
    I.intercept('POST', ACCOUNT_AUTH_URL, {
      body: [mockUserRoleToken],
    }).as(ACCOUNT_AUTH_URL)
    I.reload()

    I.get(INSTALLER_PACKAGE_CONTAINER).should('exist')
  })

  it('displays installer package download UI if zone manager role assigned', () => {
    I.intercept('POST', ACCOUNT_AUTH_URL, {
      body: [mockZoneManagerRoleToken],
    }).as(ACCOUNT_AUTH_URL)
    I.reload()

    I.get(INSTALLER_PACKAGE_CONTAINER).should('exist')
  })

  it('does not display installer download UI if none of allowed roles assigned', () => {
    I.intercept('POST', ACCOUNT_AUTH_URL, {
      body: [mockNoAdminNoPermissionToken],
    }).as(ACCOUNT_AUTH_URL)
    I.reload()

    I.get(INSTALLER_PACKAGE_CONTAINER).should('not.exist')
  })
})
