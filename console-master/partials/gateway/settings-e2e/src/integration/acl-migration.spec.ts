//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { FeatureName } from '@ues-data/shared-types'
import {
  ACL_COMMITTED_URL,
  ACL_MIGRATION_BUTTON_LABEL,
  ACL_MIGRATION_CHECKBOX_LABEL,
  ACL_RULES_LABEL,
  ADD_NETWORK_SERVICES_URL,
  AriaElementLabel,
  COMMON_ADD_BUTTON,
  COMMON_DELETE_BUTTON,
  COMMON_EDIT_BUTTON,
  CommonFns,
  EDIT_NETWORK_SERVICES_URL,
  EDITED_NETWORK_SERVICE_DATA,
  FORM_CLOSE_LABEL,
  NETWORK_SERVICES_URL,
  NETWORK_SERVICES_V2_DESCRIPTION,
  NETWORK_SERVICES_V3_DESCRIPTION,
  POLICIES_NAC_LABEL,
} from '@ues/assets-e2e'

import { getMockedIsAclQueryVisitOptions } from '../support/utils'

const { getSwitchButton, getButton, loadingIconShould, visitView, validateURL } = CommonFns(I)

const validateTableRowActions = condition => {
  I.findAllByRole('row')
    .eq(1)
    .findByRole('button', { name: I.translate(COMMON_EDIT_BUTTON) })
    .should(condition)
  I.findAllByRole('row')
    .eq(1)
    .findByRole('button', { name: I.translate(COMMON_DELETE_BUTTON) })
    .should(condition)
}

const validateNetworkServicesV3 = () => {
  it('should render table with network services v3', () => {
    I.findByRole('grid').should('exist')
    I.findAllByRole('row').eq(1).findAllByRole('cell').eq(0).findByRole('link').should('exist')
    validateTableRowActions('not.exist')
  })

  it('should be able to add network service from editor', () => {
    getButton(I.translate(COMMON_ADD_BUTTON)).should('be.enabled').click()
    validateURL(ADD_NETWORK_SERVICES_URL)
    getButton(AriaElementLabel.DiscardChangesButton).eq(0).should('be.enabled').click()
  })

  it('should be able to edit network service from editor', () => {
    I.findByRole('cell', { name: EDITED_NETWORK_SERVICE_DATA.name }).findByRole('link').click()
    validateURL(EDIT_NETWORK_SERVICES_URL)
    getButton(AriaElementLabel.DiscardChangesButton).eq(0).should('be.enabled').click()
  })
}

const validateNetworkServicesV2 = () => {
  it('should render table with network services v2', () => {
    I.findByRole('grid').should('exist')
    validateTableRowActions('exist')
  })

  it('should be able to add network service from dialog', () => {
    getButton(I.translate(COMMON_ADD_BUTTON)).should('be.enabled').click()
    validateURL(NETWORK_SERVICES_URL)
    I.findAllByRole('dialog')
      .should('exist')
      .findByRole('button', { name: I.translate(FORM_CLOSE_LABEL) })
      .click()
  })

  it('should be able to edit network service from dialog', () => {
    I.findByRole('row', { name: EDITED_NETWORK_SERVICE_DATA.name })
      .findByRole('button', { name: I.translate(COMMON_EDIT_BUTTON) })
      .click()
    validateURL(NETWORK_SERVICES_URL)
    I.findAllByRole('dialog')
      .should('exist')
      .findByRole('button', { name: I.translate(FORM_CLOSE_LABEL) })
      .click()
  })
}

describe('Settings: ACL Rules', () => {
  describe('Migrated to ACL', () => {
    before(() => {
      visitView(ACL_COMMITTED_URL, {}, [], getMockedIsAclQueryVisitOptions(true))
    })

    beforeEach(() => {
      loadingIconShould('not.exist')
    })

    it('should not render alert with migration', () => {
      I.findByRole('alert').should('not.exist')
    })
  })

  describe('Not Migrated to ACL', () => {
    before(() => {
      visitView(ACL_COMMITTED_URL, {}, [], getMockedIsAclQueryVisitOptions(false))
    })

    beforeEach(() => {
      loadingIconShould('not.exist')
    })

    it('should render alert with migration ', () => {
      I.findByRole('alert').should('exist')
    })

    it('should open dialog with migration', () => {
      getButton(I.translate(ACL_MIGRATION_BUTTON_LABEL)).should('be.enabled').click()
      I.findAllByRole('dialog').should('exist')
      getButton(I.translate(ACL_MIGRATION_BUTTON_LABEL)).should('be.disabled')
      getSwitchButton(I.translate(ACL_MIGRATION_CHECKBOX_LABEL)).click()
      getButton(I.translate(ACL_MIGRATION_BUTTON_LABEL)).should('be.enabled')
    })
  })
})

describe('Settings: Network services', () => {
  describe('Migrated to ACL', () => {
    before(() => {
      visitView(NETWORK_SERVICES_URL, {}, [], getMockedIsAclQueryVisitOptions(true))
    })

    beforeEach(() => {
      loadingIconShould('not.exist')
    })

    validateNetworkServicesV3()
  })

  describe(`Not Migrated to ACL and ${FeatureName.UESBigAclMigrationEnabled} is not enabled`, () => {
    before(() => {
      visitView(
        NETWORK_SERVICES_URL,
        { [FeatureName.UESBigAclMigrationEnabled]: false },
        [],
        getMockedIsAclQueryVisitOptions(false),
      )
    })

    beforeEach(() => {
      loadingIconShould('not.exist')
    })

    validateNetworkServicesV2()
  })

  describe(`Not Migrated to ACL and ${FeatureName.UESBigAclMigrationEnabled} is enabled`, () => {
    before(() => {
      visitView(NETWORK_SERVICES_URL, { [FeatureName.UESBigAclMigrationEnabled]: true }, [], getMockedIsAclQueryVisitOptions(false))
    })

    beforeEach(() => {
      loadingIconShould('not.exist')
    })

    it('should render button group navigation', () => {
      getButton(I.translate(ACL_RULES_LABEL)).should('exist')
      getButton(I.translate(POLICIES_NAC_LABEL)).should('exist')
    })

    describe('Network Services v3', () => {
      it('should navigate to network services v3', () => {
        getButton(I.translate(ACL_RULES_LABEL)).should('be.enabled').click()
        I.findByText(I.translate(NETWORK_SERVICES_V3_DESCRIPTION)).should('exist')
        I.findByText(I.translate(NETWORK_SERVICES_V2_DESCRIPTION)).should('not.exist')
      })
      validateNetworkServicesV3()
    })

    describe('Network Services v2', () => {
      it('should navigate to network services v2', () => {
        getButton(I.translate(POLICIES_NAC_LABEL)).should('be.enabled').click()
        I.findByText(I.translate(NETWORK_SERVICES_V2_DESCRIPTION)).should('exist')
        I.findByText(I.translate(NETWORK_SERVICES_V3_DESCRIPTION)).should('not.exist')
      })
      validateNetworkServicesV2()
    })
  })
})
