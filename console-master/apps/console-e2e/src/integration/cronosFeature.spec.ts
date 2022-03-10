/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
let cronosNavItems

const AUTHENTICATION_URL = '#/settings/authentication/authenticators'
const AUTHENTICATION_TITLE_KEY = 'console:authentication.title'
const ADAPTIVE_SECURITY_URL = '#/settings/adaptive-security'
const ADAPTIVE_SECURITY_TITLE_KEY = 'console:adaptiveSecurity.title'
const GLOBAL_LIST_URL = '#/settings/global-list'
const GLOBAL_LIST_TITLE_KEY = 'console:protectGlobalListNew.title'
const DIRECTORY_CONNECTIONS_URL = '#/settings/directory-connections'
const DIRECTORY_CONNECTIONS_TITLE_KEY = 'console:directoryConnections.title'
const NETWORK_URL = '#/settings/network'
const NETWORK_TITLE_KEY = 'console:network.title'

const disableCronosFeature = () => {
  window.localStorage.clear()
  window.localStorage.setItem('ues.nav.cronos.enabled', 'false')
}

const enableCronosFeature = () => {
  window.localStorage.clear()
  window.localStorage.setItem('UES_DATA_MOCK', 'true')
  window.localStorage.setItem('ues.nav.cronos.enabled', 'true')
  window.localStorage.setItem('ues.single.nx.app.enabled', 'true')
}

const initFeatureTests = () => {
  I.loadI18nNamespaces('navigation', 'console').then(() => {
    I.visit('/')
  })
  return I.fixture('apps.cronos').then(apps => JSON.parse(apps).navigation)
}

const openNavigation = () => {
  I.findByRole('navigation').find('a[href="/Application"]').trigger('mouseover')
}

const closeNavigation = () => {
  I.findByRole('navigation').find('a[href="/Application"]').trigger('mouseout')
}

describe('cronos feature enabled', () => {
  before(() => {
    enableCronosFeature()
    initFeatureTests().then(items => {
      cronosNavItems = items
    })
  })

  it('cronos nav items shoul be visible', () => {
    openNavigation()
    for (const item of cronosNavItems) {
      I.findByRole('tooltip').findByText(I.translate(item['name'])).should('exist')
    }
    closeNavigation()
  })

  it('Authentication page should be visible', () => {
    I.visit(AUTHENTICATION_URL)
    I.findByText(I.translate(AUTHENTICATION_TITLE_KEY)).should('exist')
  })

  it('Adaptive security page should be visible', () => {
    I.visit(ADAPTIVE_SECURITY_URL)
    I.findByText(I.translate(ADAPTIVE_SECURITY_TITLE_KEY)).should('exist')
  })

  it('Global list page should be visible', () => {
    I.visit(GLOBAL_LIST_URL)
    I.findByText(I.translate(GLOBAL_LIST_TITLE_KEY)).should('exist')
  })

  it('Directory connections page should be visible', () => {
    I.visit(DIRECTORY_CONNECTIONS_URL)
    I.findByText(I.translate(DIRECTORY_CONNECTIONS_TITLE_KEY)).should('exist')
  })

  it('Network page should be visible', () => {
    I.visit(NETWORK_URL)
    I.findByText(I.translate(NETWORK_TITLE_KEY)).should('exist')
  })
})

describe.skip('cronos feature disabled', () => {
  before(() => {
    initFeatureTests().then(items => {
      cronosNavItems = items
    })
  })

  beforeEach(() => {
    disableCronosFeature()
  })

  it('cronos nav items shoul be hidden', () => {
    openNavigation()
    for (const item of cronosNavItems) {
      I.findByRole('tooltip').findByText(I.translate(item['name'])).should('not.exist')
    }
    closeNavigation()
  })

  it('Authentication page should not be visible', () => {
    I.visit(AUTHENTICATION_URL)
    I.findByText(I.translate(AUTHENTICATION_TITLE_KEY)).should('not.exist')
  })

  it('Adaptive security page should not be visible', () => {
    I.visit(ADAPTIVE_SECURITY_URL)
    I.findByText(I.translate(ADAPTIVE_SECURITY_TITLE_KEY)).should('not.exist')
  })

  it('Global list page should be not visible', () => {
    I.visit(GLOBAL_LIST_URL)
    I.findByText(I.translate(GLOBAL_LIST_TITLE_KEY)).should('not.exist')
  })

  it('Directory connections page should not be visible', () => {
    I.visit(DIRECTORY_CONNECTIONS_URL)
    I.findByText(I.translate(DIRECTORY_CONNECTIONS_TITLE_KEY)).should('not.exist')
  })

  it('Network page should not be visible', () => {
    I.visit(NETWORK_URL)
    I.findByText(I.translate(NETWORK_TITLE_KEY)).should('not.exist')
  })
})
