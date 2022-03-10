//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { FeatureName } from '@ues-data/shared-types'
import { ADD_NETWORK_SERVICES_URL, CommonFns } from '@ues/assets-e2e'

import { validateInputGroupsValues } from '../../../support/utils'

const { loadingIconShould, visitView } = CommonFns(I)

describe('Settings: Network Service Add', () => {
  before(() => {
    visitView(ADD_NETWORK_SERVICES_URL, { [FeatureName.UESBigAclEnabled]: true }, ['components', 'gateway-settings'])
  })

  beforeEach(() => {
    loadingIconShould('not.exist')
  })

  const FIRST_COL_GRID_ITEM_NAME = 'grid-item-00'
  const SECOND_COL_GRID_ITEM_NAME = 'grid-item-01'

  context('Network Service Add', () => {
    it('should display a proper heading', () => {
      I.findByRole('heading', { name: I.translate('networkServices.labelAddNetworkService') }).should('exist')
      I.findByRole('heading', { name: I.translate('common.generalInfo') }).should('exist')
      I.findByRole('heading', { name: I.translate('networkServices.destinationsTitle') }).should('exist')
    })

    it('should display an empty inputs', () => {
      I.findByRole('gridcell', { name: FIRST_COL_GRID_ITEM_NAME }).should('exist')
      I.findByRole('gridcell', { name: SECOND_COL_GRID_ITEM_NAME }).should('exist')

      validateInputGroupsValues([''])

      I.findByRole('textbox', { name: 'Name' })
        .invoke('val')
        .then(val => expect(val).eq(''))

      I.findByRole('textbox', { name: 'Description' })
        .invoke('val')
        .then(val => expect(val).eq(''))

      I.findByRole('combobox')
        .invoke('val')
        .then(val => expect(val).eq(''))
    })
  })
})
