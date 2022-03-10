//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { FeatureName } from '@ues-data/shared-types'
import { CommonFns, EDIT_NETWORK_SERVICES_URL } from '@ues/assets-e2e'

import { validateInputGroupsValues } from '../../../support/utils'

const { loadingIconShould, visitView } = CommonFns(I)

const NETWORK_SERVICE_NAME = 'blackberrysquare'
const NETWORK_SERVICE_DESCRIPTION = 'Blackberrysquare Network Service'

describe('Settings: Network Service Edit', () => {
  before(() => {
    visitView(EDIT_NETWORK_SERVICES_URL, { [FeatureName.UESBigAclEnabled]: true }, ['components', 'gateway-settings'])
  })

  beforeEach(() => {
    loadingIconShould('not.exist')
  })

  const FIRST_COL_GRID_ITEM_NAME = 'grid-item-00'
  const SECOND_COL_GRID_ITEM_NAME = 'grid-item-01'
  const TEST_DATA = ['blackberrysquare.rim.net', '10.0.0.0/20']

  context('Network Service Edit', () => {
    it('should display a proper heading', () => {
      I.findByRole('heading', { name: I.translate('networkServices.titleNetworkService', NETWORK_SERVICE_NAME) }).should('exist')
      I.findByRole('heading', { name: I.translate('common.generalInfo') }).should('exist')
      I.findByRole('heading', { name: I.translate('networkServices.destinationsTitle') }).should('exist')

      I.findByRole('textbox', { name: 'Name' })
        .invoke('val')
        .then(val => expect(val).eq(NETWORK_SERVICE_NAME))

      I.findByRole('textbox', { name: 'Description' })
        .invoke('val')
        .then(val => expect(val).eq(NETWORK_SERVICE_DESCRIPTION))
    })

    it('should display a proper data', () => {
      I.findByRole('gridcell', { name: FIRST_COL_GRID_ITEM_NAME }).should('exist')
      I.findByRole('gridcell', { name: SECOND_COL_GRID_ITEM_NAME }).should('exist')
      validateInputGroupsValues(TEST_DATA)
    })
  })
})
