//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { FeatureName } from '@ues-data/shared-types'
import { AriaElementLabel, COMMON_ADD_BUTTON, CommonFns, NETWORK_SERVICES_URL } from '@ues/assets-e2e'

const { getButton, visitView } = CommonFns(I)

describe('Settings: Network Services List v3', () => {
  before(() => {
    visitView(NETWORK_SERVICES_URL, { [FeatureName.UESBigAclEnabled]: true })
  })

  const PREDEFINED_SERVICES = ['Office 365', 'Saleforce', 'WebEx']

  context('Network Services List', () => {
    it('should display a proper heading', () => {
      I.findByRole('heading', { name: I.translate('common.networkServices') }).should('exist')
    })

    it('should display predefined network services', () => {
      PREDEFINED_SERVICES.forEach(name => {
        I.findByRole('cell', { name }).should('exist')
      })
    })

    it('should display proper table columns', () => {
      I.findByRole('columnheader', { name: I.translate('common.name') }).should('exist')
      I.findByRole('columnheader', { name: I.translate('common.description') }).should('exist')
      I.findByRole('columnheader', { name: I.translate('networkServices.saasApps') }).should('exist')
    })

    it('should redirect to an Add a network service page after Add button click', () => {
      getButton(I.translate(COMMON_ADD_BUTTON)).should('be.enabled').click()
      I.findByRole('heading', { name: I.translate('networkServices.labelAddNetworkService') }).should('exist')

      getButton(AriaElementLabel.DiscardChangesButton).eq(0).should('exist').click()
    })

    it('should redirect to a Network service edit page', () => {
      I.findByRole('link', { name: PREDEFINED_SERVICES[0] }).should('exist').click()
      I.findByRole('heading', { name: I.translate('networkServices.titleNetworkService', PREDEFINED_SERVICES[0]) }).should('exist')
    })
  })
})
